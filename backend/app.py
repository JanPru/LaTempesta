from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
from typing import Optional

app = FastAPI(title="La Tempesta API")

# CORS (per dev): permet que el frontend (Vite) pugui cridar el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = Path(__file__).parent / "data" / "arxiu_sortida.csv"

_cache_geojson = None  # cache simple en memòria


def build_geojson(df: pd.DataFrame, limit: Optional[int] = None):
    # Normalitza columnes
    if "lat" not in df.columns or "lon" not in df.columns:
        raise ValueError("El CSV ha de contenir columnes 'lat' i 'lon'")

    # Converteix a numeric i filtra files invàlides
    df = df.copy()
    df["lat"] = pd.to_numeric(df["lat"], errors="coerce")
    df["lon"] = pd.to_numeric(df["lon"], errors="coerce")
    df = df.dropna(subset=["lat", "lon"])

    # Filtra rangs vàlids (evita punts absurds)
    df = df[(df["lat"].between(-90, 90)) & (df["lon"].between(-180, 180))]

    if limit is not None:
        df = df.head(limit)

    features = []
    for _, row in df.iterrows():
        props = row.drop(labels=["lat", "lon"], errors="ignore").to_dict()
        features.append(
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(row["lon"]), float(row["lat"])],
                },
                "properties": props,
            }
        )

    return {"type": "FeatureCollection", "features": features}


@app.get("/api/points")
def get_points(limit: Optional[int] = Query(default=None, ge=1, le=200000)):
    """
    Retorna punts en format GeoJSON.
    `limit` és útil per provar (ex: /api/points?limit=1000)
    """
    global _cache_geojson

    # Cache només si no hi ha limit (per no guardar variants)
    if limit is None and _cache_geojson is not None:
        return _cache_geojson

    if not CSV_PATH.exists():
        return {"error": f"No existeix el CSV a: {CSV_PATH}"}

    df = pd.read_csv(CSV_PATH)

    geojson = build_geojson(df, limit=limit)

    if limit is None:
        _cache_geojson = geojson

    return geojson
