#!/usr/bin/env python3
"""
Script to convert a CSV containing addresses or coordinates to a new CSV with
explicit latitude and longitude fields.

This script reads an input CSV file, extracts a specified column containing
addresses and/or coordinates, and uses the ``convert_to_latlon`` module to
derive geographic coordinates.  It appends three new columns to the
DataFrame: ``lat``, ``lon`` and ``latlon`` (a comma‑separated string of
latitude and longitude).  The resulting DataFrame is written to an output
CSV file.

Prerequisites::

    pip install pandas requests

You must also have ``convert_to_latlon.py`` (or its compiled module) in the
same directory or on your Python path.  That module provides the
``extract_lat_lon`` function used here.  If your dataset contains short
Google Maps URLs (maps.app.goo.gl) and you wish to expand them, install
``requests`` so that ``convert_to_latlon`` can follow HTTP redirects.

Usage example::

    python3 csv_to_latlon.py export-16469207.csv \
      --column "Address and/or GPS coordinates (exact location)" \
      --token YOUR_MAPBOX_TOKEN \
      --output_csv biblioteques_coords.csv

In the absence of a Mapbox token, the script only extracts coordinates that
are already present in the address strings.  With a token, it will also
attempt to geocode addresses via Mapbox.
"""

import argparse
import pandas as pd
from convert_to_latlon import extract_lat_lon


def main() -> None:
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description=(
            "Llegeix un CSV, extreu latitud/longitud de la columna especificada "
            "i desa un nou CSV amb coordenades."
        )
    )
    parser.add_argument(
        "input_csv",
        help="Ruta al fitxer CSV d’entrada que conté una columna amb adreces o coordenades",
    )
    parser.add_argument(
        "--column",
        "-c",
        default="Address and/or GPS coordinates (exact location)",
        help=(
            "Nom de la columna del CSV amb les adreces o coordenades. "
            "Per defecte: 'Address and/or GPS coordinates (exact location)'."
        ),
    )
    parser.add_argument(
        "--token",
        "-t",
        help=(
            "Token de Mapbox per geocodificar adreces que no contenen coordenades. "
            "Opcional: si totes les entrades tenen coords, pots ometre'l."
        ),
    )
    parser.add_argument(
        "--output_csv",
        "-o",
        default="output_with_coords.csv",
        help="Nom del fitxer CSV de sortida (per defecte: output_with_coords.csv)",
    )
    args = parser.parse_args()

    # Load the input CSV using pandas
    df = pd.read_csv(args.input_csv)

    if args.column not in df.columns:
        raise ValueError(
            f"No s’ha trobat la columna {args.column!r} al CSV. Columnes disponibles: {list(df.columns)}"
        )

    # Ensure the column is string type and fill NaNs with empty strings
    addresses = df[args.column].astype(str).fillna("")

    lat_list = []
    lon_list = []

    for addr in addresses:
        coords = extract_lat_lon(addr, token=args.token)
        if coords:
            lat, lon = coords
        else:
            lat = lon = None
        lat_list.append(lat)
        lon_list.append(lon)

    # Append coordinates to the DataFrame
    df["lat"] = lat_list
    df["lon"] = lon_list
    df["latlon"] = df.apply(
        lambda row: f"{row.lat},{row.lon}" if pd.notnull(row.lat) and pd.notnull(row.lon) else "",
        axis=1,
    )

    # Save the augmented DataFrame to the specified output CSV
    df.to_csv(args.output_csv, index=False)
    print(
        f"Processades {len(df)} files. Arxiu amb coordenades desat a {args.output_csv}"
    )


if __name__ == "__main__":
    main()