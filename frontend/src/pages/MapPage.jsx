import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Papa from "papaparse";

// External UI components
import MenuLateral from "../components/MenuLateral";

/*
 * MapPage wraps the interactive map together with a sliding side menu.  The
 * component loads a CSV of library locations on mount, converts it into
 * GeoJSON and then renders it using Mapbox.  When the user hovers or
 * clicks on a point the feature state is updated, which drives the colour
 * and stroke styling defined below.  A popup is displayed on click to
 * surface the library details.
 */
export default function MapPage() {
  const mapRef = useRef(null);
  const [geojson, setGeojson] = useState(null);
  const [error, setError] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mapStyle, setMapStyle] = useState("grayScale");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0 });
  const [menuOpen, setMenuOpen] = useState(true);

  // Initial viewport centres on Barcelona by default.  Using useMemo avoids
  // recreating this object on every render.
  const initialViewState = useMemo(
    () => ({
      longitude: 2.1734,
      latitude: 41.3851,
      zoom: 8,
      pitch: 0,
      bearing: 0,
    }),
    []
  );

  // When hovering over a point the feature state is marked so the circle
  // paint expression can draw a different colour and stroke width.  We
  // remember the last hovered feature so we can reset it on mouse leave.
  const onMouseEnter = useCallback(
    (e) => {
      if (!e.features || !e.features.length) return;
      const feature = e.features[0];
      setHoveredFeature(feature);
      if (mapRef.current) {
        mapRef.current.getMap().setFeatureState(
          { source: "libraries-source", id: feature.id },
          { hover: true }
        );
      }
    },
    []
  );

  const onMouseLeave = useCallback(() => {
    if (hoveredFeature && mapRef.current) {
      mapRef.current.getMap().setFeatureState(
        { source: "libraries-source", id: hoveredFeature.id },
        { hover: false }
      );
    }
    setHoveredFeature(null);
  }, [hoveredFeature]);

  const onClick = useCallback((e) => {
    if (!e.features || !e.features.length) return;
    const feature = e.features[0];
    setSelectedFeature(feature);
    if (mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: feature.geometry.coordinates,
        zoom: 12,
        duration: 800,
      });
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setIsLoading(true);
        const res = await fetch("/arxiu_sortida.csv");
        if (!res.ok) throw new Error(`No puc carregar el CSV: ${res.status}`);
        const text = await res.text();
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        const features = (parsed.data || [])
          .map((row, index) => {
            const lat = Number(row.lat);
            const lon = Number(row.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
            const { lat: _lat, lon: _lon, ...props } = row;
            return {
              type: "Feature",
              id: index,
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: {
                ...props,
                hasData: Boolean(props.name || props.address),
              },
            };
          })
          .filter(Boolean);
        const gj = { type: "FeatureCollection", features };
        setGeojson(gj);
        setStats({ total: features.length });
        // Fit the map to the bounds of our data.  Leave room for the side menu
        // by padding left when the menu is open.
        setTimeout(() => {
          if (!features.length || !mapRef.current) return;
          const bounds = features.reduce(
            (acc, f) => {
              const [lon, lat] = f.geometry.coordinates;
              return [
                [Math.min(acc[0][0], lon), Math.min(acc[0][1], lat)],
                [Math.max(acc[1][0], lon), Math.max(acc[1][1], lat)],
              ];
            },
            [[Infinity, Infinity], [-Infinity, -Infinity]]
          );
          mapRef.current.getMap().fitBounds(bounds, {
            padding: { top: 80, bottom: 80, left: menuOpen ? 340 : 60, right: 60 },
            duration: 1000,
            maxZoom: 15,
          });
        }, 100);
        setIsLoading(false);
      } catch (e) {
        setError(e.message || "Error carregant el CSV");
        setIsLoading(false);
      }
    };
    load();
  }, [menuOpen]);

  // Adjust the mouse cursor when hovering over features
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    map.on("mouseenter", LAYER_CONFIG.points.id, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", LAYER_CONFIG.points.id, () => {
      map.getCanvas().style.cursor = "";
    });
  }, [geojson]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        maxWidth: "100%",
        overflow: "hidden",
        background: "#E5E5E5",
        position: "relative",
      }}
    >
      {/* Side menu */}
      <MenuLateral
        stats={stats}
        isLoading={isLoading}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* ✅ NOVA PESTANYA per re-obrir (igual que la de tancar) */}
      {!menuOpen && (
        <div
          onClick={() => setMenuOpen(true)}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "14px",
            zIndex: 10,

            width: "18px",
            height: "55px",
            background: "#0F6641",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/img/menuLateral/arrowDropDown.png"
            alt="Open menu"
            style={{
              width: "14px",
              height: "14px",
              filter: "invert(1)",
              transform: "rotate(-90deg)", // obrir
            }}
          />
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            background: "#E74C3C",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "#fff",
          }}
        >
          {error}
        </div>
      )}

      {/* Map */}
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle={MAP_STYLES[mapStyle]}
        projection="mercator"
        style={{
          width: "100%",
          height: "100%",
          filter: "grayscale(100%) brightness(1.1) contrast(0.9)",
        }}
        interactiveLayerIds={[LAYER_CONFIG.points.id]}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {geojson && (
          <Source id="libraries-source" type="geojson" data={geojson} promoteId="id">
            <Layer {...LAYER_CONFIG.points} />
          </Source>
        )}
        {selectedFeature && (
          <Popup
            longitude={selectedFeature.geometry.coordinates[0]}
            latitude={selectedFeature.geometry.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedFeature(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div style={{ padding: "12px" }}>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "16px",
                  color: "#00A67E",
                  fontWeight: 600,
                }}
              >
                {selectedFeature.properties.name || "Biblioteca"}
              </h3>
              {Object.entries(selectedFeature.properties)
                .filter(([key]) => key !== "hasData")
                .map(([key, value]) => (
                  <div key={key} style={{ fontSize: "13px", marginBottom: "4px" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>{key}: </span>
                    <span>{value || "N/A"}</span>
                  </div>
                ))}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

// Layer configuration for the map.  When a feature is hovered the
// circle becomes blue with a thicker white border.
export const LAYER_CONFIG = {
  points: {
    id: "library-points",
    type: "circle",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 3, 5, 5, 10, 8],
      "circle-color": ["case", ["boolean", ["feature-state", "hover"], false], "#006FFF", "#00A67E"],
      "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 2, 1],
      "circle-stroke-color": "#FFFFFF",
      "circle-opacity": 1,
    },
  },
};

// Mapbox style overrides.  We default to a grayscale map when the side menu
// is open.  Additional styles could be added in the future by extending
// this object.
export const MAP_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  streets: "mapbox://styles/mapbox/streets-v12",
  grayScale: "mapbox://styles/mapbox/light-v11",
};
