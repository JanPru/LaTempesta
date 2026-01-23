import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Papa from "papaparse";

import MenuLateral from "../components/MenuLateral";
import LibraryInfoPopup from "../components/LibraryInfoPopup";

export default function MapPage() {
  const mapRef = useRef(null);

  const [fullGeojson, setFullGeojson] = useState(null);
  const [geojson, setGeojson] = useState(null);

  const [error, setError] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const [mapStyle, setMapStyle] = useState("grayScale");
  const [isLoading, setIsLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(true);

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Worldwide");

  // ✅ stats globals i stats del país seleccionat
  const [globalStats, setGlobalStats] = useState({
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
  });

  const [countryStats, setCountryStats] = useState({
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
  });

  const [countryBBoxes, setCountryBBoxes] = useState(null);

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

  const normalize = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // 🔎 Detectar país del CSV de forma robusta
  const extractCountryFromProps = (props) => {
    const keys = [
      "country",
      "Country",
      "COUNTRY",
      "admin",
      "ADMIN",
      "nation",
      "Nation",
      "país",
      "pais",
      "País",
      "Pais",
    ];
    for (const k of keys) {
      if (props && props[k]) return String(props[k]).trim();
    }
    return "";
  };

  // 🔎 Heurístiques per trobar camps de connectivitat i download
  const hasConnectivityInfo = (props) => {
    if (!props) return false;
    for (const [k, v] of Object.entries(props)) {
      const key = String(k).toLowerCase();
      if (
        key.includes("connect") ||
        key.includes("connectivity") ||
        key.includes("status") ||
        key.includes("wifi")
      ) {
        const s = String(v ?? "").trim();
        if (s && s.toLowerCase() !== "na" && s.toLowerCase() !== "n/a") return true;
      }
    }
    return false;
  };

  const getDownloadSpeed = (props) => {
    if (!props) return null;

    // Busquem un camp que sembli download/speed/mbps
    for (const [k, v] of Object.entries(props)) {
      const key = String(k).toLowerCase();
      if (
        key.includes("download") &&
        (key.includes("speed") || key.includes("mbps") || key.includes("rate"))
      ) {
        const num = Number(v);
        if (Number.isFinite(num)) return num;
      }
      if (key.includes("dl") && key.includes("mbps")) {
        const num = Number(v);
        if (Number.isFinite(num)) return num;
      }
    }
    return null;
  };

  const computeStatsFromFeatures = (features) => {
    const totalPoints = features.length;

    let connectivityMapped = 0;
    let downloadMeasured = 0;
    let goodDownload = 0;

    // Llindar “good download” (ajustable)
    const GOOD_DL_MBPS = 10;

    for (const f of features) {
      const props = f.properties || {};
      if (hasConnectivityInfo(props)) connectivityMapped++;

      const dl = getDownloadSpeed(props);
      if (dl !== null) {
        downloadMeasured++;
        if (dl >= GOOD_DL_MBPS) goodDownload++;
      }
    }

    return { totalPoints, connectivityMapped, downloadMeasured, goodDownload };
  };

  // Compute bbox for country geojson feature
  const computeBBox = (geometry) => {
    const coords = [];
    const walk = (c) => {
      if (!c) return;
      if (typeof c[0] === "number" && typeof c[1] === "number") coords.push(c);
      else c.forEach(walk);
    };
    walk(geometry.coordinates);

    if (!coords.length) return null;

    let minLon = Infinity,
      minLat = Infinity,
      maxLon = -Infinity,
      maxLat = -Infinity;

    for (const [lon, lat] of coords) {
      minLon = Math.min(minLon, lon);
      minLat = Math.min(minLat, lat);
      maxLon = Math.max(maxLon, lon);
      maxLat = Math.max(maxLat, lat);
    }

    return [
      [minLon, minLat],
      [maxLon, maxLat],
    ];
  };

  // ✅ Carrega bboxes reals de països (per fer fitBounds a país sencer)
  useEffect(() => {
    const loadCountriesGeo = async () => {
      try {
        const url =
          "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
        const res = await fetch(url);
        if (!res.ok) throw new Error("No puc carregar el geojson de països");

        const gj = await res.json();

        const index = {};
        for (const f of gj.features || []) {
          const name = f?.properties?.name;
          const iso2 = f?.properties?.["ISO3166-1-Alpha-2"];
          const iso3 = f?.properties?.["ISO3166-1-Alpha-3"];
          const bbox = computeBBox(f.geometry);
          if (!bbox) continue;

          if (name) index[normalize(name)] = bbox;
          if (iso2) index[normalize(iso2)] = bbox;
          if (iso3) index[normalize(iso3)] = bbox;
        }

        setCountryBBoxes(index);
      } catch {
        setCountryBBoxes(null);
      }
    };

    loadCountriesGeo();
  }, []);

  const onMouseEnter = useCallback(
    (e) => {
      if (!e.features || !e.features.length) return;
      const feature = e.features[0];

      // neteja hover anterior
      if (hoveredFeature && mapRef.current) {
        mapRef.current.getMap().setFeatureState(
          { source: "libraries-source", id: hoveredFeature.id },
          { hover: false }
        );
      }

      setHoveredFeature(feature);

      if (mapRef.current) {
        mapRef.current.getMap().setFeatureState(
          { source: "libraries-source", id: feature.id },
          { hover: true }
        );
      }
    },
    [hoveredFeature]
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

  // Click: selecciona biblioteca + fly suau (sense zoom exagerat)
const onClick = useCallback((e) => {
  if (!e.features || !e.features.length || !mapRef.current) return;

  const feature = e.features[0];
  setSelectedFeature(feature);

  const map = mapRef.current.getMap();
  const [lon, lat] = feature.geometry.coordinates;

  const currentZoom = map.getZoom();

  // ✅ zoom suau, sense passar-nos
  const TARGET_ZOOM = 6.5; // zoom “agradable” per biblioteca
  const MAX_ZOOM = 8;     // límit dur
  const MIN_ZOOM = 4.5;   // si estàs molt lluny, assegura focus

  const nextZoom = Math.max(
    MIN_ZOOM,
    Math.min(MAX_ZOOM, Math.max(currentZoom, TARGET_ZOOM))
  );

  map.flyTo({
    center: [lon, lat],
    zoom: nextZoom,
    duration: 600,
    essential: true,
  });
}, []);


  // ✅ Carrega CSV
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

        const countrySet = new Set();

        const features = (parsed.data || [])
          .map((row, index) => {
            const lat = Number(row.lat);
            const lon = Number(row.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

            const { lat: _lat, lon: _lon, ...props } = row;

            const c = extractCountryFromProps(props);
            if (c) countrySet.add(c);

            return {
              type: "Feature",
              id: index,
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: {
                ...props,
                __country: c,
                hasData: Boolean(props.name || props.address),
              },
            };
          })
          .filter(Boolean);

        const gj = { type: "FeatureCollection", features };

        setFullGeojson(gj);
        setGeojson(gj);

        const gStats = computeStatsFromFeatures(features);
        setGlobalStats(gStats);
        setCountryStats(gStats);

        setCountries(Array.from(countrySet));

        // Fit inicial a tots (sense exagerar)
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
            padding: { top: 80, bottom: 80, left: menuOpen ? 420 : 60, right: 60 },
            duration: 800,
            maxZoom: 3.5,
          });
        }, 100);

        setIsLoading(false);
      } catch (e) {
        setError(e.message || "Error carregant el CSV");
        setIsLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor pointer on hover
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    map.on("mouseenter", LAYER_CONFIG.points.id, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", LAYER_CONFIG.points.id, () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      map.off("mouseenter", LAYER_CONFIG.points.id, () => {});
      map.off("mouseleave", LAYER_CONFIG.points.id, () => {});
    };
  }, [geojson]);

  // ✅ Quan selecciones país:
  // - canvia punts (només país)
  // - canvia stats cards (només país)
  // - fa fitBounds al bbox real país
  const handleSelectCountry = useCallback(
    (country) => {
      setSelectedCountry(country);
      setSelectedFeature(null);

      if (!fullGeojson) return;

      // Worldwide
      if (!country || country === "Worldwide") {
        setGeojson(fullGeojson);
        setCountryStats(globalStats);

        // Fit global (suau)
        if (mapRef.current && fullGeojson.features.length) {
          const bounds = fullGeojson.features.reduce(
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
            padding: { top: 80, bottom: 80, left: menuOpen ? 420 : 60, right: 60 },
            duration: 800,
            maxZoom: 3.5,
          });
        }
        return;
      }

      // Filtra punts per país
      const n = normalize(country);
      const filteredFeatures = fullGeojson.features.filter(
        (f) => normalize(f.properties?.__country) === n
      );

      setGeojson({ type: "FeatureCollection", features: filteredFeatures });

      // Stats del país
      setCountryStats(computeStatsFromFeatures(filteredFeatures));

      // Fit bbox real del país (no punts)
      if (mapRef.current && countryBBoxes) {
        const bbox = countryBBoxes[n];
        if (bbox) {
          mapRef.current.getMap().fitBounds(bbox, {
            padding: { top: 90, bottom: 90, left: menuOpen ? 420 : 60, right: 80 },
            duration: 800,
            maxZoom: 5.0,
          });
        }
      }
    },
    [fullGeojson, countryBBoxes, globalStats, menuOpen]
  );

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
      <MenuLateral
        isLoading={isLoading}
        isOpen={menuOpen}
        onToggle={() => setMenuOpen((v) => !v)}   // ✅ toggle
        countries={countries}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        countriesCount={countries.length}
        stats={countryStats}
      />

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

      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle={MAP_STYLES[mapStyle]}
        projection="mercator"
        style={{
          width: "100%",
          height: "100%",
          //filter: "grayscale(100%) brightness(1.1) contrast(0.9)",
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

        {/* ✅ Component reusable: Pin + pestanya info */}
        {selectedFeature && (
          <LibraryInfoPopup
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
            pinSrc="/img/pin.svg"
          />
        )}
      </Map>
    </div>
  );
}

export const LAYER_CONFIG = {
  points: {
    id: "library-points",
    type: "circle",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 3, 5, 5, 10, 8],

      "circle-color": [
        "case",

        // Hover highlight
        ["boolean", ["feature-state", "hover"], false],
        "#005FCC",

        // Connected
        [
          "==",
          ["downcase", ["get", "Does the library currently have Internet access?"]],
          "yes",
        ],
        "#3ED892",

        // Not connected
        [
          "==",
          ["downcase", ["get", "Does the library currently have Internet access?"]],
          "no",
        ],
        "#F82055",

        // Unknown (default)
        "#20BBCE",
      ],

      "circle-stroke-color": "#FFFFFF",
      "circle-stroke-width": 1.5,
      "circle-opacity": 1,
    },
  },
};


export const MAP_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  streets: "mapbox://styles/mapbox/streets-v12",
  grayScale: "mapbox://styles/mapbox/light-v11",
};
