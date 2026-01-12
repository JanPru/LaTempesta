import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Papa from "papaparse";
import "mapbox-gl/dist/mapbox-gl.css";

const pointLayer = {
  id: "points",
  type: "circle",
  paint: {
    "circle-radius": 5,
    "circle-stroke-width": 1,
  },
};

export default function MapPage() {
  const mapRef = useRef(null);
  const [geojson, setGeojson] = useState(null);
  const [error, setError] = useState("");

  const initialViewState = useMemo(
    () => ({ longitude: 2.1734, latitude: 41.3851, zoom: 3 }),
    []
  );

  useEffect(() => {
    const load = async () => {
      try {
        setError("");

        const res = await fetch("/arxiu_sortida.csv");
        if (!res.ok) throw new Error(`No puc carregar el CSV: ${res.status}`);

        const text = await res.text();

        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });

        const features = (parsed.data || [])
          .map((row) => {
            const lat = Number(row.lat);
            const lon = Number(row.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

            // props = totes les columnes menys lat/lon (opcional)
            const { lat: _lat, lon: _lon, ...props } = row;

            return {
              type: "Feature",
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: props,
            };
          })
          .filter(Boolean);

        const gj = { type: "FeatureCollection", features };
        setGeojson(gj);

        // Fit bounds als punts
        setTimeout(() => {
          if (!features.length || !mapRef.current) return;

          let minLon = features[0].geometry.coordinates[0];
          let maxLon = minLon;
          let minLat = features[0].geometry.coordinates[1];
          let maxLat = minLat;

          for (const f of features) {
            const [lon, lat] = f.geometry.coordinates;
            minLon = Math.min(minLon, lon);
            maxLon = Math.max(maxLon, lon);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
          }

          mapRef.current.getMap().fitBounds(
            [
              [minLon, minLat],
              [maxLon, maxLat],
            ],
            { padding: 60, duration: 800 }
          );
        }, 0);
      } catch (e) {
        setError(e.message || "Error carregant el CSV");
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Mapa interactiu</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ height: "70vh", borderRadius: 12, overflow: "hidden" }}>
        <Map
          ref={mapRef}
          initialViewState={initialViewState}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {geojson && (
            <Source id="points-src" type="geojson" data={geojson}>
              <Layer {...pointLayer} />
            </Source>
          )}
        </Map>
      </div>
    </div>
  );
}
