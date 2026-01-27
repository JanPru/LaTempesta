// src/pages/MapPage.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Papa from "papaparse";

import MenuLateral from "../components/MenuLateral";
import LibraryInfoPopup from "../components/LibraryInfoPopup";
import MapLegend from "../components/MapLegend";
import TopBrand from "../components/TopBrand";

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

  // ✅ BOTTOM FILTER SELECTED
  const [activeBottomFilter, setActiveBottomFilter] = useState("library_status");

    // =========================================================
  // ✅ PERCEIVED QUALITY (0-100) column + bucket
  // =========================================================
  const PERCEIVED_QUALITY_COL =
    "How would you rate the current state of digital infrastructure and devices in your library?";

  const PQ_COLORS = {
    very_poor: "#F82055",
    poor: "#FF7A00",
    fair: "#FFD400",
    good: "#8BE04E",
    excellent: "#2EAD27",
    unknown: "#20BBCE",
  };

  const toNumberOrNull = (v) => {
    if (v == null) return null;
    const s = String(v).trim().replace(",", ".");
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  const getPerceivedQualityBucketFromProps = (props) => {
    const n = toNumberOrNull(props?.[PERCEIVED_QUALITY_COL]);
    if (n == null) return "unknown";

    if (n >= 0 && n <= 19) return "very_poor";
    if (n >= 20 && n <= 49) return "poor";
    if (n >= 50 && n <= 59) return "fair";
    if (n >= 60 && n <= 79) return "good";
    if (n >= 80 && n <= 100) return "excellent";

    // fora rang
    return "unknown";
  };

  const getPerceivedQualityColorFromProps = (props) => {
    const b = props?.__pqBucket || getPerceivedQualityBucketFromProps(props);
    return PQ_COLORS[b] || PQ_COLORS.unknown;
  };

  // =========================================================
  // ✅ NOT CONNECT: reasons columns (exact headers)
  // =========================================================
  const NOT_CONNECT_REASON_COLS = useMemo(
    () => [
      {
        key: "infrastructure",
        label: "Infrastructure limitations",
        col:
          "Infrastructure limitations:Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
      },
      {
        key: "high_cost",
        label: "High cost",
        col:
          "High cost:Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
      },
      {
        key: "electrical",
        label: "Electrical supply issues",
        col:
          "Electrical supply issues:Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
      },
      {
        key: "digital_literacy",
        label: "Digital literacy gaps",
        col:
          "Digital literacy gaps (library staff lacks basic digital skills so there would be underutilization of connectivity resources):Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
      },
      {
        key: "policy",
        label: "Policy/Regulatory barriers",
        col:
          "Policy/Regulatory barriers (national regulations limit Internet access):Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
      },
      {
        key: "all_above",
        label: "All of the above",
        col:
          "All of the above:Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
      },
    ],
    []
  );

  const [globalStats, setGlobalStats] = useState({
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
    dlRed: 0,
    dlOrange: 0,
    dlGreen: 0,
    internetYes: 0,
    internetNo: 0,
    connectionTypeCounts: null,
    notConnectReasonsCounts: null,
    perceivedQualityCounts: null,
  });

  const [countryStats, setCountryStats] = useState({
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
    dlRed: 0,
    dlOrange: 0,
    dlGreen: 0,
    internetYes: 0,
    internetNo: 0,
    connectionTypeCounts: null,
    notConnectReasonsCounts: null,
    perceivedQualityCounts: null,
  });

  const [countryBBoxes, setCountryBBoxes] = useState(null);
  const [countriesGeojson, setCountriesGeojson] = useState(null);

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

  // =========================================================
  // TYPE OF CONNECTION helpers
  // =========================================================
  const CONNECTION_COL = "What type of internet connection does your library have?";

  const splitMulti = (raw) => {
    return String(raw ?? "")
      .split(/[,;/|]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const bucketConnectionType = (token) => {
    const t = String(token ?? "").toLowerCase().trim();
    if (!t) return "unknown";

    if (t.includes("optic") || t.includes("fiber") || t.includes("fibre")) return "optic_fiber";
    if (t.includes("dsl") || t.includes("adsl") || t.includes("vdsl")) return "dsl";
    if (t.includes("satellite") || t.includes("sat")) return "satellite";
    if (t.includes("cable") || t.includes("coax")) return "cable";

    if (
      t.includes("mobile") ||
      t.includes("cell") ||
      t.includes("3g") ||
      t.includes("4g") ||
      t.includes("5g") ||
      t.includes("lte")
    ) {
      return "mobile_data";
    }

    if (t.includes("other")) return "other";
    if (t === "unknown" || t === "n/a" || t === "na" || t === "none") return "unknown";

    return "other";
  };

  const CONNECTION_COLORS = {
    optic_fiber: "#FF2AAE",
    dsl: "#FF8A00",
    satellite: "#5CFF7A",
    cable: "#D5E600",
    mobile_data: "#1E5BFF",
    other: "#7A1FFF",
    unknown: "#27C7D8",
  };

  const CONNECTION_PRIORITY = [
    "optic_fiber",
    "cable",
    "dsl",
    "mobile_data",
    "satellite",
    "other",
    "unknown",
  ];

  const primaryConnectionBucketFromProps = (props) => {
    const rawConn = props?.[CONNECTION_COL];
    const tokens = splitMulti(rawConn);

    if (!tokens.length) return "unknown";

    const buckets = Array.from(new Set(tokens.map(bucketConnectionType)));
    for (const p of CONNECTION_PRIORITY) {
      if (buckets.includes(p)) return p;
    }
    return buckets[0] || "unknown";
  };

  const getConnectionColorFromProps = (props) => {
    const b = props?.__connBucket || primaryConnectionBucketFromProps(props);
    return CONNECTION_COLORS[b] || CONNECTION_COLORS.unknown;
  };

  // =========================================================
  // Existing helpers (download buckets etc.)
  // =========================================================
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

  const getDownloadBucket = (props) => {
    const raw = props?.["What is the average Internet/download speed available at the library?"];

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

  const getHaloColorFromProps = (props) => {
    const b = props?.__dlBucket ?? (getDownloadBucket(props) || "unknown");
    if (b === "red") return "#F82055";
    if (b === "orange") return "#FDB900";
    if (b === "green") return "#3ED896";
    return "#20BBCE";
  };

  // ✅ helper: when a column has ANY value => reason selected
  const hasReasonValue = (v) => {
    if (v == null) return false;
    const s = String(v).trim();
    if (!s) return false;
    const l = s.toLowerCase();
    if (l === "na" || l === "n/a" || l === "none" || l === "null") return false;
    if (l === "0" || l === "false" || l === "no") return false;
    return true;
  };

  // =========================================================
  // ✅ NOT CONNECT colors + reason bucket
  // =========================================================
  const NOT_CONNECT_COLORS = {
    infrastructure: "#36A6D8",
    high_cost: "#FF6C00",
    electrical: "#0EAD27",
    digital_literacy: "#B3BE39",
    policy: "#9E65AC",
    multi: "#D83A8F",
    unknown: "#20BBCE",
  };

  const getNotConnectReasonBucketFromProps = (props) => {
    const acc = String(props?.["Does the library currently have Internet access?"] ?? "")
      .trim()
      .toLowerCase();

    if (acc !== "no") return "unknown";

    const allAboveDef = NOT_CONNECT_REASON_COLS.find((x) => x.key === "all_above");
    const hasAllAbove = allAboveDef ? hasReasonValue(props?.[allAboveDef.col]) : false;
    if (hasAllAbove) return "multi";

    const selected = [];
    for (const r of NOT_CONNECT_REASON_COLS) {
      if (r.key === "all_above") continue;
      if (hasReasonValue(props?.[r.col])) selected.push(r.key);
    }

    if (selected.length >= 2) return "multi";
    if (selected.length === 1) return selected[0];
    return "unknown";
  };

  const getNotConnectColorFromProps = (props) => {
    const b = props?.__reasonBucket || getNotConnectReasonBucketFromProps(props);
    return NOT_CONNECT_COLORS[b] || NOT_CONNECT_COLORS.unknown;
  };

  const computeStatsFromFeatures = (features) => {
    const totalPoints = features.length;

    let connectivityMapped = 0;
    let downloadMeasured = 0;
    let dlRed = 0;
    let dlOrange = 0;
    let dlGreen = 0;

    let internetYes = 0;
    let internetNo = 0;

    const perceivedQualityCounts = {
      very_poor: 0,
      poor: 0,
      fair: 0,
      good: 0,
      excellent: 0,
      unknown: 0,
    };

    const connectionTypeCounts = {
      optic_fiber: 0,
      dsl: 0,
      satellite: 0,
      cable: 0,
      mobile_data: 0,
      other: 0,
      unknown: 0,
    };

    // ✅ NEW: not connect reasons (sense all_above com a categoria)
    const notConnectReasonsCounts = NOT_CONNECT_REASON_COLS.reduce((acc, r) => {
      if (r.key !== "all_above") acc[r.key] = 0;
      return acc;
    }, {});

    for (const f of features) {
      const props = f.properties || {};
      if (hasConnectivityInfo(props)) connectivityMapped++;

      const acc = String(props["Does the library currently have Internet access?"] ?? "")
        .trim()
        .toLowerCase();
      
      const pq = props.__pqBucket || getPerceivedQualityBucketFromProps(props);
      perceivedQualityCounts[pq] = (perceivedQualityCounts[pq] || 0) + 1;

      const isNo = acc === "no";
      if (acc === "yes") internetYes++;
      else if (isNo) internetNo++;

      if (isNo) {
        // si marca "All of the above", suma a totes les categories (excepte all_above)
        const allAboveDef = NOT_CONNECT_REASON_COLS.find((x) => x.key === "all_above");
        const hasAllAbove = allAboveDef ? hasReasonValue(props?.[allAboveDef.col]) : false;

        if (hasAllAbove) {
          for (const r of NOT_CONNECT_REASON_COLS) {
            if (r.key === "all_above") continue;
            notConnectReasonsCounts[r.key] = (notConnectReasonsCounts[r.key] || 0) + 1;
          }
        } else {
          for (const r of NOT_CONNECT_REASON_COLS) {
            if (r.key === "all_above") continue;
            if (hasReasonValue(props?.[r.col])) {
              notConnectReasonsCounts[r.key] = (notConnectReasonsCounts[r.key] || 0) + 1;
            }
          }
        }
      }

      // count type of connection (multi-select adds to each)
      const rawConn = props[CONNECTION_COL];
      const tokens = splitMulti(rawConn);

      if (!tokens.length) {
        connectionTypeCounts.unknown++;
      } else {
        const uniqueBuckets = new Set(tokens.map(bucketConnectionType));
        uniqueBuckets.forEach((b) => {
          connectionTypeCounts[b] = (connectionTypeCounts[b] || 0) + 1;
        });
      }

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
      internetYes,
      internetNo,
      connectionTypeCounts,
      notConnectReasonsCounts,
      perceivedQualityCounts,
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

  const circleRadiusForZoom = (z) => {
    if (!Number.isFinite(z)) return 5;
    if (z <= 0) return 3;

    if (z > 0 && z < 5) return 3 + ((z - 0) * (5 - 3)) / (5 - 0);
    if (z >= 5 && z < 10) return 5 + ((z - 5) * (8 - 5)) / (10 - 5);
    return 8;
  };

  // =========================================================
  // Countries geojson + resize
  // =========================================================
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

  useEffect(() => {
    const onResize = () => {
      const map = mapRef.current?.getMap?.();
      if (map) map.resize();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // =========================================================
  // Hover / click
  // =========================================================
  const onMouseEnter = useCallback(
    (e) => {
      if (!e.features || !e.features.length) return;

      const f = e.features[0];
      if (f?.layer?.id !== LAYER_CONFIG.points.id) return;
      if (f?.source !== "libraries-source") return;

      if (hoveredFeature && mapRef.current) {
        mapRef.current
          .getMap()
          .setFeatureState({ source: "libraries-source", id: hoveredFeature.id }, { hover: false });
      }

      setHoveredFeature(f);

      if (mapRef.current) {
        mapRef.current
          .getMap()
          .setFeatureState({ source: "libraries-source", id: f.id }, { hover: true });
      }
    },
    [hoveredFeature]
  );

  const onMouseLeave = useCallback(() => {
    if (hoveredFeature && mapRef.current) {
      mapRef.current
        .getMap()
        .setFeatureState({ source: "libraries-source", id: hoveredFeature.id }, { hover: false });
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
            padding: { top: 80, bottom: 80, left: menuOpen ? 420 : 60, right: 60 },
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
            padding: { top: 90, bottom: 90, left: menuOpen ? 420 : 60, right: 80 },
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

      const countryHit = e.features.find((f) => f?.layer?.id === COUNTRY_LAYER.fill.id);
      if (countryHit) {
        setSelectedFeature(null);
        const countryName = countryHit?.properties?.name;
        if (countryName) handleSelectCountry(countryName);
      }
    },
    [handleSelectCountry]
  );

  // =========================================================
  // LOAD CSV -> geojson (✅ also computes __connBucket + __reasonBucket)
  // =========================================================
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
          transformHeader: (h) => String(h || "").replace(/\u00A0/g, " ").trim(),
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

            const dlBucket = getDownloadBucket(props) || "unknown";
            const connBucket = primaryConnectionBucketFromProps(props);
            const reasonBucket = getNotConnectReasonBucketFromProps(props);
            const pqBucket = getPerceivedQualityBucketFromProps(props);

            return {
              type: "Feature",
              id: index,
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: {
                ...props,
                __country: c,
                __dlBucket: dlBucket,
                __connBucket: connBucket,
                __reasonBucket: reasonBucket,
                __pqBucket: pqBucket,
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

  const selectedCoords = useMemo(() => {
    if (!selectedFeature?.geometry?.coordinates) return null;
    const [lon, lat] = selectedFeature.geometry.coordinates;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return { lon, lat };
  }, [selectedFeature]);

  // ✅ pin color follows same rule as point color
  const selectedPinColor = useMemo(() => {
    const props = selectedFeature?.properties;
    if (!props) return "#20BBCE";

    if (activeBottomFilter === "type_connect") {
      return getConnectionColorFromProps(props);
    }

    if (activeBottomFilter === "not_connect") {
      return getNotConnectColorFromProps(props); // only "no" should be selectable anyway
    }
    if (activeBottomFilter === "perceived_quality") {
      return getPerceivedQualityColorFromProps(props);
    }

    return getHaloColorFromProps(props);
  }, [selectedFeature, activeBottomFilter]);

  const selectedPinOffset = useMemo(() => {
    const r = circleRadiusForZoom(currentZoom);
    const gap = -8;
    const y = -(r + gap);
    return [0, y];
  }, [currentZoom]);

  const pointsPaint = useMemo(() => {
    const base = {
      ...LAYER_CONFIG.points.paint,
      "circle-opacity": [
        "case",
        ["==", ["id"], selectedFeature?.id ?? -1],
        0,
        1,
      ],
    };

    if (activeBottomFilter === "type_connect") {
      return {
        ...base,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#005FCC",

          [
            "match",
            ["get", "__connBucket"],
            "optic_fiber",
            CONNECTION_COLORS.optic_fiber,
            "dsl",
            CONNECTION_COLORS.dsl,
            "satellite",
            CONNECTION_COLORS.satellite,
            "cable",
            CONNECTION_COLORS.cable,
            "mobile_data",
            CONNECTION_COLORS.mobile_data,
            "other",
            CONNECTION_COLORS.other,
            CONNECTION_COLORS.unknown,
          ],
        ],
      };
    }

    if (activeBottomFilter === "not_connect") {
      return {
        ...base,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#005FCC",

          [
            "match",
            ["get", "__reasonBucket"],
            "infrastructure",
            NOT_CONNECT_COLORS.infrastructure,
            "high_cost",
            NOT_CONNECT_COLORS.high_cost,
            "electrical",
            NOT_CONNECT_COLORS.electrical,
            "digital_literacy",
            NOT_CONNECT_COLORS.digital_literacy,
            "policy",
            NOT_CONNECT_COLORS.policy,
            "multi",
            NOT_CONNECT_COLORS.multi,
            NOT_CONNECT_COLORS.unknown,
          ],
        ],
      };
    }
    if (activeBottomFilter === "perceived_quality") {
      return {
        ...base,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#005FCC",

          [
            "match",
            ["get", "__pqBucket"],
            "very_poor",
            PQ_COLORS.very_poor,
            "poor",
            PQ_COLORS.poor,
            "fair",
            PQ_COLORS.fair,
            "good",
            PQ_COLORS.good,
            "excellent",
            PQ_COLORS.excellent,
            PQ_COLORS.unknown,
          ],
        ],
      };
    }

    return base;
  }, [activeBottomFilter, selectedFeature?.id]);

  // ✅ HIDE connected points when mode is not_connect
  const pointsFilter = useMemo(() => {
    if (activeBottomFilter === "not_connect") {
      return [
        "==",
        ["downcase", ["get", "Does the library currently have Internet access?"]],
        "no",
      ];
    }
    return undefined;
  }, [activeBottomFilter]);

  // ✅ If a "yes" point was selected and user switches to not_connect, clear selection
  useEffect(() => {
    if (activeBottomFilter !== "not_connect") return;

    const acc = String(
      selectedFeature?.properties?.["Does the library currently have Internet access?"] ?? ""
    )
      .trim()
      .toLowerCase();

    if (acc === "yes") setSelectedFeature(null);
  }, [activeBottomFilter, selectedFeature]);

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
        activeBottomFilter={activeBottomFilter}
        onChangeBottomFilter={setActiveBottomFilter}
      />

      <TopBrand menuOpen={false} />

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
          <Source id="libraries-source" type="geojson" data={geojson} promoteId="id">
            <Layer {...LAYER_CONFIG.points} paint={pointsPaint} filter={pointsFilter} />

          {selectedCountry !== "Worldwide" &&
          activeBottomFilter !== "type_connect" &&
          activeBottomFilter !== "perceived_quality" &&
          activeBottomFilter !== "not_connect" && (
            <Layer {...LAYER_CONFIG.halo} beforeId={LAYER_CONFIG.points.id} />
          )}
          </Source>
        )}

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

        {selectedFeature && (
          <LibraryInfoPopup feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
        )}
      </Map>

      <MapLegend mode={activeBottomFilter} />
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

  halo: {
    id: "library-halo",
    type: "circle",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 6, 5, 10.5, 10, 14],
      "circle-opacity": [
        "case",
        ["==", ["downcase", ["get", "Does the library currently have Internet access?"]], "no"],
        0,
        0.5,
      ],
      "circle-color": [
        "match",
        ["get", "__dlBucket"],
        "red",
        "#F82055",
        "orange",
        "#FDB900",
        "green",
        "#3ED896",
        "#20BBCE",
      ],
      "circle-stroke-width": 0,
    },
  },
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