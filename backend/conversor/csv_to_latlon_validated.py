#!/usr/bin/env python3
"""
csv_to_latlon_validated.py
===========================

This script augments a CSV file containing addresses and/or GPS coordinate
information by extracting latitude and longitude pairs, validating them
against rough country bounding boxes and optionally falling back to
pre‑existing coordinate columns.  It is a more robust version of the
`csv_to_latlon.py` utility which was originally provided with the
dataset.  Key improvements include:

* Support for decimal coordinates that use either a dot or comma as the
  decimal separator.  The delimiter between the latitude and longitude
  may be a comma, semicolon or whitespace.
* Handling of cardinal notation (e.g. "18.2208° N 66.5901° W"), labels
  such as "Latitude"/"Longitude", and embedded Google Maps URLs.
* Optional use of a Mapbox API token to forward‑geocode addresses when
  no coordinates can be extracted directly.  A country hint can be
  passed to the geocoder to improve accuracy.
* Validation of extracted (and existing) coordinates against a set of
  coarse bounding boxes for each supported country.  Coordinates that
  fall outside the expected bounds are discarded and flagged.
* Ability to leverage existing latitude/longitude columns in the input
  CSV as a fallback when the extracted coordinates are missing or
  invalid.  Existing coordinates are also validated against the
  bounding boxes.
* A new ``geo_status`` column describing where the final coordinates
  came from and whether any issues were detected.  Possible values
  include ``EXTRACTED``, ``EXISTING``, ``BOTH_VALID`` (both sources
  agree), ``EXTRACTED_OUT_OF_BOUNDS``, ``EXISTING_OUT_OF_BOUNDS`` or
  ``NO_COORDS``.

The bounding boxes used here are deliberately conservative and are
intended as a first‑pass sanity check.  They do not respect political
borders precisely but rather encompass the approximate range of
latitudes and longitudes for each country represented in the dataset.

Example usage::

    python3 csv_to_latlon_validated.py input.csv \
      --address_column "Address and/or GPS coordinates (exact location)" \
      --country_column "In which country is your library located?" \
      --lat_column lat --lon_column lon \
      --token YOUR_MAPBOX_TOKEN \
      --output_csv enriched.csv

If ``--token`` is omitted, the script will only extract coordinates
embedded in the address field and will not attempt to geocode plain
addresses.
"""

import argparse
import csv
import json
import os
import re
import sys
from dataclasses import dataclass
from typing import Iterable, List, Optional, Tuple, Dict

try:
    import requests  # optional, only required for URL expansion and Mapbox
except ImportError:
    requests = None  # type: ignore


# ---------------------------------------------------------------------------
# Bounding box definitions
#
# These bounding boxes are approximate and intended only for sanity
# checking.  They cover the range of latitudes and longitudes for the
# countries represented in the survey data.  If a country is not
# present in this mapping the validation step will skip the country
# check and any coordinates will be accepted as long as they lie within
# the legal coordinate ranges (|lat| <= 90, |lon| <= 180).

COUNTRY_BBOXES: Dict[str, Tuple[float, float, float, float]] = {
    # country_name: (min_lat, max_lat, min_lon, max_lon)
    "Ethiopia": (3.0, 15.0, 33.0, 48.0),
    "United States": (24.0, 49.0, -125.0, -66.0),
    "Australia": (-43.0, -10.0, 113.0, 154.0),
    "Dominican Republic": (17.0, 20.0, -72.0, -68.0),
    "Namibia": (-29.0, -16.0, 11.0, 26.0),
    "Cameroon": (1.0, 14.0, 8.0, 17.0),
    "Nigeria": (4.0, 14.0, 2.0, 15.0),
    "Sudan": (8.0, 22.0, 21.0, 39.0),
    "Zambia": (-18.5, -8.0, 22.0, 34.0),
    "Kenya": (-5.0, 5.5, 33.5, 42.5),
    "Lebanon": (33.0, 35.0, 35.0, 37.0),
    "United Arab Emirates": (22.0, 27.5, 51.0, 56.5),
    "Philippines": (5.0, 19.0, 116.0, 126.0),
    "Lesotho": (-31.0, -28.0, 27.0, 30.0),
    "India": (6.0, 36.0, 68.0, 98.0),
    "Uganda": (-2.5, 4.5, 29.0, 36.0),
    "Iraq": (29.0, 38.0, 39.0, 49.0),
    "Georgia": (40.0, 44.5, 39.0, 47.0),
    "South Africa": (-35.0, -22.0, 16.0, 33.0),
    "Sierra Leone": (6.0, 10.0, -13.5, -10.0),
    "Qatar": (24.0, 26.5, 50.5, 52.0),
    "Sri Lanka": (5.0, 10.0, 79.0, 82.0),
    "Zimbabwe": (-22.5, -15.0, 25.0, 34.0),
    "Armenia": (38.5, 41.5, 43.0, 47.0),
    "Romania": (43.5, 48.5, 20.0, 30.0),
    "Canada": (41.0, 83.0, -141.0, -52.0),
    "Benin": (6.0, 12.5, 0.5, 3.5),
    "Algeria": (18.0, 37.5, -9.0, 12.0),
    "Egypt": (22.0, 32.0, 24.0, 36.0),
    "Libya": (19.0, 33.5, 9.0, 25.0),
    "Afghanistan": (29.0, 38.5, 60.0, 75.0),
}


# ---------------------------------------------------------------------------
# Coordinate parsing helpers

LatLon = Tuple[float, float]


def _parse_decimal_pair(text: str) -> Optional[LatLon]:
    """Attempt to parse a pair of latitude/longitude values from a string.

    This function handles both dot and comma as decimal separators.  The
    delimiter between the two numbers may be a comma, semicolon or any
    amount of whitespace.  Only the first pair of numbers that looks
    like a coordinate pair is returned.  Values outside the legal
    latitude/longitude ranges are rejected.
    """
    # Replace semicolons with commas to simplify the pattern.
    candidate = text.replace(";", ",")
    # Regex pattern: one number followed by a delimiter then another number.
    m = re.search(r"(-?\d{1,3}(?:[.,]\d+)?)\s*[,\s]\s*(-?\d{1,3}(?:[.,]\d+)?)", candidate)
    if not m:
        return None
    lat_str, lon_str = m.group(1), m.group(2)
    try:
        lat = float(lat_str.replace(",", "."))
        lon = float(lon_str.replace(",", "."))
    except ValueError:
        return None
    if abs(lat) <= 90 and abs(lon) <= 180:
        return lat, lon
    return None


def _parse_cardinal_decimal(text: str) -> Optional[LatLon]:
    """Parse coordinates specified with cardinal directions.

    Matches patterns like ``18.2208° N 66.5901° W`` or
    ``18,2208°S 66,5901°O``.  West ('W' or 'O') and South ('S') are
    negated.  Returns ``None`` if two values with cardinal directions
    cannot be found or if they fall outside the legal coordinate ranges.
    """
    # Find all decimal numbers followed by a cardinal direction letter.
    parts = re.findall(r"(\d{1,3}(?:[.,]\d+)?)\s*°?\s*([NSEWO])", text.upper())
    if len(parts) < 2:
        return None
    try:
        lat_val, lat_dir = parts[0]
        lon_val, lon_dir = parts[1]
        lat = float(lat_val.replace(",", "."))
        lon = float(lon_val.replace(",", "."))
        if lat_dir == "S":
            lat = -lat
        if lon_dir in ("W", "O"):
            lon = -lon
    except ValueError:
        return None
    if abs(lat) <= 90 and abs(lon) <= 180:
        return lat, lon
    return None


def _parse_lat_lon_words(text: str) -> Optional[LatLon]:
    """Extract coordinates from phrases like ``Latitude 12.3° Longitude -77.1°``."""
    mlat = re.search(r"LATITUDE\s*[:\-]?\s*(-?\d{1,3}(?:[.,]\d+)?)", text.upper())
    mlon = re.search(r"LONGITUDE\s*[:\-]?\s*(-?\d{1,3}(?:[.,]\d+)?)", text.upper())
    if not (mlat and mlon):
        return None
    try:
        lat = float(mlat.group(1).replace(",", "."))
        lon = float(mlon.group(1).replace(",", "."))
    except ValueError:
        return None
    if abs(lat) <= 90 and abs(lon) <= 180:
        return lat, lon
    return None


def _parse_google_maps_url(text: str) -> Optional[LatLon]:
    """Extract coordinates from Google Maps URL patterns.

    Handles @lat,lon patterns, !3dLAT!4dLON segments and ?q=lat,lon
    query parameters.  Returns None if nothing matches or values are
    outside the legal coordinate bounds.
    """
    # Patterns in order of specificity
    # @lat,lon[,zoom]
    m = re.search(r"@(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)(?:,\d+(?:\.\d+)?z)?", text)
    if m:
        lat = float(m.group(1))
        lon = float(m.group(2))
        if abs(lat) <= 90 and abs(lon) <= 180:
            return lat, lon
    # !3dLAT!4dLON pattern
    m = re.search(r"!3d(-?\d{1,3}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)", text)
    if m:
        lat = float(m.group(1))
        lon = float(m.group(2))
        if abs(lat) <= 90 and abs(lon) <= 180:
            return lat, lon
    # ?q=lat,lon
    m = re.search(r"[?&]q=(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)", text)
    if m:
        lat = float(m.group(1))
        lon = float(m.group(2))
        if abs(lat) <= 90 and abs(lon) <= 180:
            return lat, lon
    return None


def _expand_short_google_url(url: str, timeout: int = 15) -> Optional[str]:
    """Expand a short maps.app.goo.gl or goo.gl URL via HTTP redirects.

    When requests is unavailable or an exception occurs the original
    URL is returned unchanged.
    """
    if requests is None:
        return None
    try:
        resp = requests.get(url, allow_redirects=True, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
        return resp.url
    except Exception:
        return None


def _mapbox_geocode(query: str, token: str, *, country: Optional[str] = None, limit: int = 1) -> Optional[LatLon]:
    """Forward geocode a free‑form address via Mapbox.

    A country code (ISO2 or ISO3) may be supplied to limit results.  Only
    the first result is returned.  If the requests module is unavailable
    or any exception occurs this returns None.
    """
    if not token:
        return None
    if requests is None:
        return None
    base = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
    url = base + requests.utils.quote(query) + ".json"
    params: Dict[str, object] = {"access_token": token, "limit": limit}
    if country:
        # Mapbox accepts a comma‑separated list of ISO2 or ISO3 codes
        params["country"] = country
    try:
        resp = requests.get(url, params=params, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        feats = data.get("features", [])
        if not feats:
            return None
        lon, lat = feats[0]["center"]
        if abs(lat) <= 90 and abs(lon) <= 180:
            return float(lat), float(lon)
    except Exception:
        return None
    return None


def extract_lat_lon(raw: str, *, token: Optional[str] = None, country_hint: Optional[str] = None) -> Optional[LatLon]:
    """Try to extract a latitude/longitude pair from arbitrary text.

    Extraction proceeds in several stages:
    1. Parse decimal pairs (either dot or comma decimals).
    2. Parse cardinal notation with N/S/E/W (or O for West in some languages).
    3. Parse explicit Latitude/Longitude labels.
    4. Parse embedded Google Maps URL patterns.
    5. Expand short Google URLs and retry (requires requests).
    6. As a last resort, forward geocode the entire string via Mapbox
       if a token is provided.

    A country hint (ISO code) can be supplied to bias Mapbox results.
    """
    text = (raw or "").strip()
    if not text:
        return None
    # Stage 1: decimal pair
    coords = _parse_decimal_pair(text)
    if coords:
        return coords
    # Stage 2: cardinal notation
    coords = _parse_cardinal_decimal(text)
    if coords:
        return coords
    # Stage 3: explicit Latitude/Longitude labels
    coords = _parse_lat_lon_words(text)
    if coords:
        return coords
    # Stage 4: embedded Google Maps URL
    # Scan for a URL substring
    m = re.search(r"(https?://\S+)", text)
    if m:
        url = m.group(1)
        coords = _parse_google_maps_url(url)
        if coords:
            return coords
        # Stage 5: expand short URLs
        host = re.sub(r"^https?://", "", url).split("/")[0]
        if host.endswith("goo.gl") or host.endswith("maps.app") or "maps.app" in host:
            expanded = _expand_short_google_url(url)
            if expanded:
                coords = _parse_google_maps_url(expanded)
                if coords:
                    return coords
    # Stage 6: Mapbox geocoding fallback
    if token:
        coords = _mapbox_geocode(text, token, country=country_hint)
        if coords:
            return coords
    return None


def within_bbox(lat: float, lon: float, country: str) -> bool:
    """Return True if the coordinate is within the approximate bounding box for the country.

    If the country is not in the COUNTRY_BBOXES mapping this returns True
    for any coordinates inside the legal latitude/longitude range.  This
    behaviour allows the script to process data for countries without
    predefined bounds while still rejecting obviously invalid values.
    """
    # Always enforce global coordinate bounds first
    if not (-90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0):
        return False
    bbox = COUNTRY_BBOXES.get(country)
    if bbox is None:
        return True
    min_lat, max_lat, min_lon, max_lon = bbox
    return (min_lat <= lat <= max_lat) and (min_lon <= lon <= max_lon)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Read a CSV, extract latitude and longitude from a specified "
            "address column, validate and merge with existing coordinate "
            "columns, and write out an enriched CSV with geolocation status."
        )
    )
    parser.add_argument(
        "input_csv",
        help="Path to the input CSV file containing addresses and/or coordinates",
    )
    parser.add_argument(
        "--address_column",
        "-c",
        default="Address and/or GPS coordinates (exact location)",
        help="Name of the column containing addresses or raw coordinate strings",
    )
    parser.add_argument(
        "--country_column",
        "-C",
        default="In which country is your library located?",
        help="Name of the column indicating the country for each record",
    )
    parser.add_argument(
        "--lat_column",
        default=None,
        help="Name of an existing latitude column to use as a fallback",
    )
    parser.add_argument(
        "--lon_column",
        default=None,
        help="Name of an existing longitude column to use as a fallback",
    )
    parser.add_argument(
        "--token",
        "-t",
        help=(
            "Mapbox API token used to geocode addresses when no coordinates can "
            "be extracted directly from the address column. Optional."
        ),
    )
    parser.add_argument(
        "--output_csv",
        "-o",
        default="output_with_coords.csv",
        help="Name of the output CSV file to write",
    )
    args = parser.parse_args()

    # Read the CSV
    try:
        import pandas as pd
    except ImportError as exc:
        print("This script requires pandas to be installed.", file=sys.stderr)
        raise exc

    df = pd.read_csv(args.input_csv)

    # Ensure required columns exist
    if args.address_column not in df.columns:
        raise ValueError(
            f"Address column '{args.address_column}' not found in input CSV."
        )
    if args.country_column not in df.columns:
        raise ValueError(
            f"Country column '{args.country_column}' not found in input CSV."
        )
    if args.lat_column and args.lat_column not in df.columns:
        raise ValueError(
            f"Latitude fallback column '{args.lat_column}' not found in input CSV."
        )
    if args.lon_column and args.lon_column not in df.columns:
        raise ValueError(
            f"Longitude fallback column '{args.lon_column}' not found in input CSV."
        )

    # Initialise result lists
    final_lats: List[Optional[float]] = []
    final_lons: List[Optional[float]] = []
    statuses: List[str] = []

    # Precompute Mapbox country hints: iso2 codes where possible.
    # We'll build a simple mapping from country name to ISO2 code.  If
    # pycountry is not installed we fall back to None.
    iso_cache: Dict[str, Optional[str]] = {}
    try:
        import pycountry
    except ImportError:
        pycountry = None  # type: ignore

    def get_iso_code(name: str) -> Optional[str]:
        if not name:
            return None
        if name in iso_cache:
            return iso_cache[name]
        code = None
        if pycountry is not None:
            try:
                country_obj = pycountry.countries.lookup(name)
                code = country_obj.alpha_2  # type: ignore
            except Exception:
                code = None
        iso_cache[name] = code
        return code

    # Process each row
    for idx, row in df.iterrows():
        raw_addr = row.get(args.address_column, "")
        country = str(row.get(args.country_column, "")).strip()
        country = country if country else ""

        # Extract coordinates from address field
        extracted = None
        if raw_addr and isinstance(raw_addr, str):
            # Provide a country hint to Mapbox if available
            iso_hint = get_iso_code(country)
            extracted = extract_lat_lon(raw_addr, token=args.token, country_hint=iso_hint)

        # Parse fallback coordinates from existing columns
        existing = None
        if args.lat_column and args.lon_column:
            try:
                lat_val = row[args.lat_column]
                lon_val = row[args.lon_column]
                if pd.notnull(lat_val) and pd.notnull(lon_val):
                    existing = (float(lat_val), float(lon_val))
            except Exception:
                existing = None

        # Validate coordinates against bounding boxes
        extracted_valid = False
        existing_valid = False
        if extracted:
            extracted_valid = within_bbox(extracted[0], extracted[1], country)
        if existing:
            existing_valid = within_bbox(existing[0], existing[1], country)

        final_coord: Optional[Tuple[float, float]] = None
        status = "NO_COORDS"

        # Decide which coordinate to keep
        if extracted and extracted_valid and existing and existing_valid:
            # Both present and valid; if they are very close we choose one
            lat_diff = abs(extracted[0] - existing[0])
            lon_diff = abs(extracted[1] - existing[1])
            if lat_diff < 0.01 and lon_diff < 0.01:
                # Agree within ~1 km; choose extracted and mark both valid
                final_coord = extracted
                status = "BOTH_VALID"
            else:
                # Coordinates disagree; prefer the extracted one
                final_coord = extracted
                status = "EXTRACTED"
        elif extracted and extracted_valid:
            final_coord = extracted
            status = "EXTRACTED"
        elif existing and existing_valid:
            final_coord = existing
            status = "EXISTING"
        elif extracted and not extracted_valid:
            # Extracted present but outside expected bounds
            final_coord = None
            status = "EXTRACTED_OUT_OF_BOUNDS"
        elif existing and not existing_valid:
            final_coord = None
            status = "EXISTING_OUT_OF_BOUNDS"
        else:
            final_coord = None
            status = "NO_COORDS"

        if final_coord:
            final_lat, final_lon = final_coord
        else:
            final_lat = None
            final_lon = None

        final_lats.append(final_lat)
        final_lons.append(final_lon)
        statuses.append(status)

    # Append results to DataFrame
    df["lat_validated"] = final_lats
    df["lon_validated"] = final_lons
    df["latlon_validated"] = [f"{lat},{lon}" if lat is not None and lon is not None else "" for lat, lon in zip(final_lats, final_lons)]
    df["geo_status"] = statuses

    # Write to output
    df.to_csv(args.output_csv, index=False)
    print(f"Processed {len(df)} rows. Output saved to {args.output_csv}")


if __name__ == "__main__":
    main()