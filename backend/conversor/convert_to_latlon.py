"""
Utilities to normalize raw location strings into latitude/longitude coordinates.

The functions in this module attempt to extract geographic coordinates from
arbitrary text.  They handle a variety of common formats encountered when
working with real‑world location data, including:

* Decimal latitude/longitude pairs, e.g. "41.3851, 2.1734".
* Cardinal notation where N/S/E/W (or O for Oest) follow the number, e.g.
  "18.2208° N 66.5901° O".  South and West (or O) values will be negated.
* "Latitude" and "Longitude" labels embedded in prose.
* Google Maps URLs containing coordinates in the `@lat,lon,zoom` or
  `!3dLat!4dLon` patterns or as query parameters (e.g. `?q=lat,lon`).
* Optionally, short Google redirect URLs (maps.app.goo.gl) can be
  expanded via HTTP requests.  The expanded link often contains the
  coordinate patterns above.  Network access is required for this.
* If none of the extraction patterns match and a Mapbox API token is
  provided, the module can attempt to geocode the entire string using
  Mapbox's forward geocoding endpoint.  This requires a valid token and
  network access.

The top‑level function ``extract_lat_lon`` orchestrates these steps for
each input string.  It will try fast, local patterns first, then fall
back to network calls only when necessary.

Example usage::

    from convert_to_latlon import extract_lat_lon

    raw_entries = [
        "37.176932, -78.120640",
        "18.2208° N 66.5901° O",
        "https://maps.app.goo.gl/kjVGP5ZSGSWxvroD7",
        "Despuut Street, Extention 1 Koes",
    ]
    results = [extract_lat_lon(entry, token="YOUR_MAPBOX_TOKEN_HERE") for entry in raw_entries]
    for original, coords in zip(raw_entries, results):
        print(original, "=>", coords)

The module can also be executed as a script.  If run directly, it will
read lines from a text file (or stdin) and output a JSON array of
objects with the original text and extracted coordinates.  This is
useful for one‑off conversions without writing additional code.
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from typing import Iterable, List, Optional, Tuple

try:
    # ``requests`` may not be installed in all environments.  It's only
    # necessary if you intend to expand short Google URLs or geocode via
    # Mapbox.  The code defensively handles missing requests.
    import requests  # type: ignore
except ImportError:
    requests = None  # type: ignore


LatLon = Tuple[float, float]


def _parse_decimal_pair(text: str) -> Optional[LatLon]:
    """Attempt to parse a simple ``lat, lon`` decimal pair.

    Matches patterns like ``41.3851, 2.1734``.  Negative values and
    spaces around the comma are permitted.  Values must be within
    reasonable latitude/longitude bounds.  Returns ``None`` on failure.
    """
    m = re.search(r"(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)", text)
    if not m:
        return None
    try:
        lat = float(m.group(1))
        lon = float(m.group(2))
    except ValueError:
        return None
    if abs(lat) <= 90 and abs(lon) <= 180:
        return lat, lon
    return None


def _parse_cardinal_decimal(text: str) -> Optional[LatLon]:
    """Parse cardinal notation like ``18.2208° N 66.5901° O``.

    Recognises N/S/E/W or O (for Oest/west in some languages).  The
    degree symbol is optional.  Commas are optional.  Both values must be
    present.  Returns ``None`` if not matched or if the values are out
    of bounds.
    """
    parts = re.findall(r"(\d{1,3}\.\d+)\s*°?\s*([NSEWO])", text.upper())
    if len(parts) < 2:
        return None
    try:
        lat_val, lat_dir = parts[0]
        lon_val, lon_dir = parts[1]
        lat = float(lat_val)
        lon = float(lon_val)
        if lat_dir == "S":
            lat = -lat
        if lon_dir in ("W", "O"):  # O == Oest (west) in some languages
            lon = -lon
    except ValueError:
        return None
    if abs(lat) <= 90 and abs(lon) <= 180:
        return lat, lon
    return None


def _parse_lat_lon_words(text: str) -> Optional[LatLon]:
    """Extract coordinates from phrases like ``Latitude 12.3° Longitude -77.1°``.

    Recognises the words ``latitude`` and ``longitude`` (case insensitive)
    followed by a number.  The degree symbol and separator punctuation
    (colon, dash, etc.) are ignored.  Returns ``None`` if either
    component is missing or out of range.
    """
    mlat = re.search(r"LATITUDE\s*[:\-]?\s*(-?\d{1,3}(?:\.\d+)?)", text.upper())
    mlon = re.search(r"LONGITUDE\s*[:\-]?\s*(-?\d{1,3}(?:\.\d+)?)", text.upper())
    if not (mlat and mlon):
        return None
    try:
        lat = float(mlat.group(1))
        lon = float(mlon.group(1))
    except ValueError:
        return None
    if abs(lat) <= 90 and abs(lon) <= 180:
        return lat, lon
    return None


def _parse_google_maps_url(text: str) -> Optional[LatLon]:
    """Extract coordinates from the various patterns used by Google Maps URLs.

    Patterns handled:
    - ``@lat,lon`` where zoom may follow, e.g. ``@41.40338,2.17403,17z``
    - ``!3dLAT!4dLON`` segments
    - query parameter ``?q=lat,lon``

    Returns ``None`` if no pattern matches or the extracted values are
    outside of valid coordinate bounds.
    """
    # @lat,lon pattern
    m = re.search(r"@(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)", text)
    if m:
        lat = float(m.group(1))
        lon = float(m.group(2))
        if abs(lat) <= 90 and abs(lon) <= 180:
            return lat, lon

    # !3dLAT!4dLON pattern
    m = re.search(r"!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)", text)
    if m:
        lat = float(m.group(1))
        lon = float(m.group(2))
        if abs(lat) <= 90 and abs(lon) <= 180:
            return lat, lon

    # ?q=lat,lon pattern
    m = re.search(r"[?&]q=(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)", text)
    if m:
        lat = float(m.group(1))
        lon = float(m.group(2))
        if abs(lat) <= 90 and abs(lon) <= 180:
            return lat, lon

    return None


def _expand_short_google_url(url: str, timeout: int = 15) -> Optional[str]:
    """Expand a short ``maps.app.goo.gl`` or ``goo.gl`` URL via HTTP redirects.

    Returns the final URL after following redirects, or ``None`` if
    ``requests`` is unavailable or an error occurs.  A reasonable
    timeout (in seconds) should be supplied to avoid hanging for too
    long.  This helper is used internally by ``extract_lat_lon`` when
    necessary.
    """
    if requests is None:
        return None
    try:
        resp = requests.get(url, allow_redirects=True, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
        return resp.url
    except Exception:
        return None


def _mapbox_geocode(query: str, token: str, *, country: Optional[str] = None, limit: int = 1) -> Optional[LatLon]:
    """Perform a forward geocoding request against the Mapbox API.

    The ``query`` string is passed to Mapbox's ``/geocoding/v5`` endpoint.
    A valid API token must be provided.  Optionally, a ``country`` ISO
    code can limit results to a particular country (e.g. ``"ES"``).  Only
    the first result's coordinates are returned, as a tuple ``(lat, lon)``.
    Returns ``None`` on error or if no results are found.

    Note: This function makes a network request.  It will raise an
    exception if ``requests`` is not installed.
    """
    if not token:
        return None
    if requests is None:
        raise RuntimeError("requests module is required for Mapbox geocoding")
    base = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
    url = base + requests.utils.quote(query) + ".json"
    params: dict[str, object] = {"access_token": token, "limit": limit}
    if country:
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


def extract_lat_lon(raw: str, *, token: Optional[str] = None) -> Optional[LatLon]:
    """Orchestrate extraction of latitude/longitude from a raw location string.

    The extraction proceeds in stages:

    1. Check for decimal pairs (``_parse_decimal_pair``).
    2. Check for cardinal notation with N/S/E/W (``_parse_cardinal_decimal``).
    3. Check for explicit "Latitude" / "Longitude" labels.
    4. Check for coordinates embedded in Google Maps URL patterns.
    5. If the string contains a short Google URL, expand it and try
       again (requires ``requests`` and network access).
    6. As a last resort, if a Mapbox token is provided, attempt to
       geocode the entire string using Mapbox's API.

    Returns a tuple ``(lat, lon)`` on success or ``None`` if no
    coordinates could be determined.
    """
    text = (raw or "").strip()
    if not text:
        return None

    # Stage 1: decimal pair
    coords = _parse_decimal_pair(text)
    if coords:
        return coords

    # Stage 2: cardinal with N/S/E/W (or O)
    coords = _parse_cardinal_decimal(text)
    if coords:
        return coords

    # Stage 3: explicit Latitude/Longitude labels
    coords = _parse_lat_lon_words(text)
    if coords:
        return coords

    # Stage 4: Google Maps URL embedded coordinates
    # Search for all URLs in the text; some may contain coords directly.
    url_match = re.search(r"(https?://\S+)", text)
    if url_match:
        url = url_match.group(1)
        coords = _parse_google_maps_url(url)
        if coords:
            return coords

        # Stage 5: expand short Google URLs
        host = re.sub(r"^https?://", "", url).split("/")[0]
        if host.endswith("goo.gl") or host.endswith("maps.app") or "maps.app" in host:
            expanded = _expand_short_google_url(url)
            if expanded:
                coords = _parse_google_maps_url(expanded)
                if coords:
                    return coords

    # Stage 6: Mapbox geocoding as fallback
    if token:
        try:
            coords = _mapbox_geocode(text, token)
            if coords:
                return coords
        except Exception:
            pass

    return None


@dataclass
class EntryResult:
    """Dataclass representing the result for one input entry."""

    original: str
    lat: Optional[float]
    lon: Optional[float]

    def to_dict(self) -> dict[str, object]:
        return {
            "original": self.original,
            "lat": self.lat,
            "lon": self.lon,
        }


def process_entries(entries: Iterable[str], *, token: Optional[str] = None) -> List[EntryResult]:
    """Process an iterable of raw strings into ``EntryResult`` objects.

    Each entry is passed to ``extract_lat_lon``.  Results are returned in
    the same order as the inputs.
    """
    results: List[EntryResult] = []
    for raw in entries:
        coords = extract_lat_lon(raw, token=token)
        if coords:
            lat, lon = coords
        else:
            lat = lon = None
        results.append(EntryResult(original=raw, lat=lat, lon=lon))
    return results


def main(argv: List[str]) -> None:
    """CLI entry point.

    Usage:
        python convert_to_latlon.py input.txt [--token=MAPBOX_TOKEN]

    The script reads lines from ``input.txt`` (or stdin if omitted)
    and writes a JSON array to stdout containing objects with
    ``original``, ``lat``, and ``lon`` fields.
    """
    import argparse
    parser = argparse.ArgumentParser(description="Normalize raw location strings to latitude/longitude.")
    parser.add_argument("input", nargs="?", help="Input text file (one location per line).  If omitted, reads stdin.")
    parser.add_argument("-t", "--token", help="Mapbox API token for fallback geocoding.")
    args = parser.parse_args(argv[1:])

    # Read input lines
    if args.input:
        with open(args.input, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f]
    else:
        lines = [line.strip() for line in sys.stdin]

    results = process_entries(lines, token=args.token)
    json.dump([r.to_dict() for r in results], sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main(sys.argv)