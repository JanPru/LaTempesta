// MapPage.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Papa from "papaparse";

import MenuLateral from "../components/MenuLateral";
import LibraryInfoPopup from "../components/LibraryInfoPopup";
import MapLegend from "../components/MapLegend";

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

  const [globalStats, setGlobalStats] = useState({
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
    dlRed: 0,
    dlOrange: 0,
    dlGreen: 0,
  });

  const [countryStats, setCountryStats] = useState({
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
    dlRed: 0,
    dlOrange: 0,
    dlGreen: 0,
  });

  const [countryBBoxes, setCountryBBoxes] = useState(null);
  const [countriesGeojson, setCountriesGeojson] = useState(null);

  // ✅ per fer l’offset del pin “clavat” al punt segons zoom
  const [currentZoom, setCurrentZoom] = useState(8);

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
        if (s && s.toLowerCase() !== "na" && s.toLowerCase() !== "n/a")
          return true;
      }
    }
    return false;
  };

  // ✅ bucket robust (JS) -> després Mapbox només fa "match" (no peta mai)
  const getDownloadBucket = (props) => {
    const raw =
      props?.[
        "What is the average Internet/download speed available at the library?"
      ];

    const v = String(raw ?? "")
      .toLowerCase()
      .replace(/[–—]/g, "-")
      .trim();

    if (!v) return null;

    if (
      v.includes("less than 1") ||
      v.includes("between 1-5") ||
      v.includes("1-5") ||
      v.includes("less than 5")
    ) {
      return "red";
    }
    if (
      v.includes("between 5-20") ||
      v.includes("5-20") ||
      v.includes("between 20-40") ||
      v.includes("20-40")
    ) {
      return "orange";
    }
    if (
      v.includes("between 40-100") ||
      v.includes("40-100") ||
      v.includes("more than 100") ||
      v.includes(">100")
    ) {
      return "green";
    }
    return null;
  };

  // ✅ color del pin: usa el bucket precalculat si existeix
  const getHaloColorFromProps = (props) => {
    const b = props?.__dlBucket ?? (getDownloadBucket(props) || "unknown");
    if (b === "red") return "#F82055";
    if (b === "orange") return "#FDB900";
    if (b === "green") return "#3ED896";
    return "#20BBCE";
  };

  const computeStatsFromFeatures = (features) => {
    const totalPoints = features.length;

    let connectivityMapped = 0;
    let downloadMeasured = 0;
    let dlRed = 0;
    let dlOrange = 0;
    let dlGreen = 0;

    for (const f of features) {
      const props = f.properties || {};
      if (hasConnectivityInfo(props)) connectivityMapped++;

      const bucket = props.__dlBucket ?? getDownloadBucket(props);
      if (bucket && bucket !== "unknown") {
        downloadMeasured++;
        if (bucket === "red") dlRed++;
        else if (bucket === "orange") dlOrange++;
        else if (bucket === "green") dlGreen++;
      }
    }

    return {
      totalPoints,
      connectivityMapped,
      downloadMeasured,
      goodDownload: dlGreen,
      dlRed,
      dlOrange,
      dlGreen,
    };
  };

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

  // ✅ helper: cercle “radius” segons la teva expressió del layer (interpolate zoom)
  const circleRadiusForZoom = (z) => {
    if (!Number.isFinite(z)) return 5;

    if (z <= 0) return 3;

    if (z > 0 && z < 5) {
      return 3 + ((z - 0) * (5 - 3)) / (5 - 0);
    }

    if (z >= 5 && z < 10) {
      return 5 + ((z - 5) * (8 - 5)) / (10 - 5);
    }

    return 8;
  };

  useEffect(() => {
    const loadCountriesGeo = async () => {
      try {
        const url =
          "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
        const res = await fetch(url);
        if (!res.ok) throw new Error("No puc carregar el geojson de països");

        const gj = await res.json();
        setCountriesGeojson(gj);

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
        setCountriesGeojson(null);
      }
    };

    loadCountriesGeo();
  }, []);

  // ✅ Resize-proof: map.resize() quan canvia la finestra (o layout)
  useEffect(() => {
    const onResize = () => {
      const map = mapRef.current?.getMap?.();
      if (map) map.resize();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onMouseEnter = useCallback(
    (e) => {
      if (!e.features || !e.features.length) return;

      const f = e.features[0];
      if (f?.layer?.id !== LAYER_CONFIG.points.id) return;
      if (f?.source !== "libraries-source") return;

      if (hoveredFeature && mapRef.current) {
        mapRef.current.getMap().setFeatureState(
          { source: "libraries-source", id: hoveredFeature.id },
          { hover: false }
        );
      }

      setHoveredFeature(f);

      if (mapRef.current) {
        mapRef.current.getMap().setFeatureState(
          { source: "libraries-source", id: f.id },
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

  const handleSelectCountry = useCallback(
    (country) => {
      setSelectedCountry(country);

      if (!fullGeojson) return;

      if (!country || country === "Worldwide") {
        setGeojson(fullGeojson);
        setCountryStats(globalStats);

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
            padding: {
              top: 80,
              bottom: 80,
              left: menuOpen ? 420 : 60,
              right: 60,
            },
            duration: 800,
            maxZoom: 3.5,
          });
        }
        return;
      }

      const n = normalize(country);
      const filteredFeatures = fullGeojson.features.filter(
        (f) => normalize(f.properties?.__country) === n
      );

      setGeojson({ type: "FeatureCollection", features: filteredFeatures });
      setCountryStats(computeStatsFromFeatures(filteredFeatures));

      if (mapRef.current && countryBBoxes) {
        const bbox = countryBBoxes[n];
        if (bbox) {
          mapRef.current.getMap().fitBounds(bbox, {
            padding: {
              top: 90,
              bottom: 90,
              left: menuOpen ? 420 : 60,
              right: 80,
            },
            duration: 800,
            maxZoom: 5.0,
          });
        }
      }
    },
    [fullGeojson, countryBBoxes, globalStats, menuOpen]
  );

  const selectedLibrary = useMemo(() => {
    if (!selectedFeature) return null;
    return { properties: selectedFeature.properties || {} };
  }, [selectedFeature]);

  const onClick = useCallback(
    (e) => {
      if (!e.features || e.features.length === 0) {
        setSelectedFeature(null);
        handleSelectCountry("Worldwide");
        return;
      }

      const hit = e.features.find((f) => f?.layer?.id === LAYER_CONFIG.points.id);

      if (hit) {
        setSelectedFeature(hit);

        const clickedCountry = hit?.properties?.__country;
        handleSelectCountry(clickedCountry || "Worldwide");
        return;
      }

      const countryHit = e.features.find(
        (f) => f?.layer?.id === COUNTRY_LAYER.fill.id
      );
      if (countryHit) {
        setSelectedFeature(null);
        const countryName = countryHit?.properties?.name;
        if (countryName) handleSelectCountry(countryName);
      }
    },
    [handleSelectCountry]
  );

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
                __dlBucket: getDownloadBucket(props) || "unknown", // ✅ FIX unknown halos
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
            padding: {
              top: 80,
              bottom: 80,
              left: menuOpen ? 420 : 60,
              right: 60,
            },
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
  }, []); // tal qual

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    const onEnter = () => (map.getCanvas().style.cursor = "pointer");
    const onLeave = () => (map.getCanvas().style.cursor = "");

    map.on("mouseenter", LAYER_CONFIG.points.id, onEnter);
    map.on("mouseleave", LAYER_CONFIG.points.id, onLeave);

    map.on("mouseenter", COUNTRY_LAYER.fill.id, onEnter);
    map.on("mouseleave", COUNTRY_LAYER.fill.id, onLeave);

    return () => {
      map.off("mouseenter", LAYER_CONFIG.points.id, onEnter);
      map.off("mouseleave", LAYER_CONFIG.points.id, onLeave);

      map.off("mouseenter", COUNTRY_LAYER.fill.id, onEnter);
      map.off("mouseleave", COUNTRY_LAYER.fill.id, onLeave);
    };
  }, [geojson]);

  // ✅ coords del seleccionat
  const selectedCoords = useMemo(() => {
    if (!selectedFeature?.geometry?.coordinates) return null;
    const [lon, lat] = selectedFeature.geometry.coordinates;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return { lon, lat };
  }, [selectedFeature]);

  // ✅ color del pin = color del halo (via __dlBucket)
  const selectedPinColor = useMemo(() => {
    if (!selectedFeature?.properties) return "#20BBCE";
    return getHaloColorFromProps(selectedFeature.properties);
  }, [selectedFeature]);

  // ✅ offset del pin: “just a sobre del punt” segons zoom (estable)
  const selectedPinOffset = useMemo(() => {
    const r = circleRadiusForZoom(currentZoom);
    const gap = -8;
    const y = -(r + gap);
    return [0, y];
  }, [currentZoom]);

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
        onClose={() => setMenuOpen((v) => !v)}
        countries={countries}
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedFeature(null);
          handleSelectCountry(c);
        }}
        countriesCount={countries.length}
        stats={countryStats}
        selectedLibrary={selectedLibrary}
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
        style={{ width: "100%", height: "100%" }}
        interactiveLayerIds={[LAYER_CONFIG.points.id, COUNTRY_LAYER.fill.id]}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        onMove={(evt) => {
          const z = evt?.viewState?.zoom;
          if (Number.isFinite(z)) setCurrentZoom(z);
        }}
      >
        {countriesGeojson && (
          <Source id="countries-source" type="geojson" data={countriesGeojson}>
            <Layer {...COUNTRY_LAYER.fill} />
            <Layer {...COUNTRY_LAYER.outline} />
          </Source>
        )}

        {geojson && (
          <Source
            id="libraries-source"
            type="geojson"
            data={geojson}
            promoteId="id"
          >
            {/* ✅ PUNTS: amaguem el seleccionat perquè ara es veurà com a pin */}
            <Layer
              {...LAYER_CONFIG.points}
              paint={{
                ...LAYER_CONFIG.points.paint,
                "circle-opacity": [
                  "case",
                  ["==", ["id"], selectedFeature?.id ?? -1],
                  0,
                  1,
                ],
              }}
            />

            {/* ✅ HALO: ara amb __dlBucket (no peta -> no negre) */}
            {selectedCountry !== "Worldwide" && (
              <Layer {...LAYER_CONFIG.halo} beforeId={LAYER_CONFIG.points.id} />
            )}
          </Source>
        )}

        {/* ✅ PIN DEFAULT (com new mapboxgl.Marker()) */}
        {selectedCoords && (
          <Marker
            key={`${selectedFeature?.id ?? "none"}-${selectedPinColor}`}
            longitude={selectedCoords.lon}
            latitude={selectedCoords.lat}
            anchor="bottom"
            color={selectedPinColor}
            offset={selectedPinOffset}
            onClick={(e) => e.originalEvent.stopPropagation()}
          />
        )}

        {/* ✅ Popup */}
        {selectedFeature && (
          <LibraryInfoPopup
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </Map>

      <MapLegend />
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
        ["boolean", ["feature-state", "hover"], false],
        "#005FCC",

        [
          "==",
          ["downcase", ["get", "Does the library currently have Internet access?"]],
          "yes",
        ],
        "#3ED896",

        [
          "==",
          ["downcase", ["get", "Does the library currently have Internet access?"]],
          "no",
        ],
        "#F82055",

        "#20BBCE",
      ],
      "circle-stroke-color": "#FFFFFF",
      "circle-stroke-width": 0,
      "circle-opacity": 1,
    },
  },

  // ✅ FIX: halo usa bucket precalculat i fallback blau
  halo: {
  id: "library-halo",
  type: "circle",
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0, 6,
      5, 10.5,
      10, 14
    ],

    // ❌ NO HALO si Not connected
    "circle-opacity": [
      "case",
      [
        "==",
        ["downcase", ["get", "Does the library currently have Internet access?"]],
        "no"
      ],
      0,
      0.5
    ],

    // 🎨 color segons bucket (ja arreglat)
    "circle-color": [
      "match",
      ["get", "__dlBucket"],
      "red", "#F82055",
      "orange", "#FDB900",
      "green", "#3ED896",
      "#20BBCE" // unknown
    ],

    "circle-stroke-width": 0
  }
}
};

export const COUNTRY_LAYER = {
  fill: {
    id: "countries-fill",
    type: "fill",
    paint: { "fill-color": "#000000", "fill-opacity": 0.01 },
  },
  outline: {
    id: "countries-outline",
    type: "line",
    paint: { "line-color": "#000000", "line-opacity": 0.08, "line-width": 1 },
  },
};

export const MAP_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  streets: "mapbox://styles/mapbox/streets-v12",
  grayScale: "mapbox://styles/mapbox/light-v11",
};