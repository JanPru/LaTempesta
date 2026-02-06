import { useEffect, useState } from "react";
import StatBox from "../components/StatBox";
import AnimatedNetwork from "../components/AnimatedNetwork";
import Footer from "../components/Footer";
import Papa from "papaparse";

/* ---------- Hook media query ---------- */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/* ---------- Stats computation helpers ---------- */
const CONNECTION_COL = "What type of internet connection does your library have?";
const PERCEIVED_QUALITY_COL = "How would you rate the current state of digital infrastructure and devices in your library?";

const toNumberOrNull = (v) => {
  if (v == null) return null;
  const s = String(v).trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const getPerceivedQualityBucket = (props) => {
  const n = toNumberOrNull(props?.[PERCEIVED_QUALITY_COL]);
  if (n == null) return "unknown";
  if (n >= 0 && n <= 19) return "very_poor";
  if (n >= 20 && n <= 49) return "poor";
  if (n >= 50 && n <= 59) return "fair";
  if (n >= 60 && n <= 79) return "good";
  if (n >= 80 && n <= 100) return "excellent";
  return "unknown";
};

const splitMulti = (raw) => {
  return String(raw ?? "")
    .split(/[,;/|]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
};

const bucketConnectionType = (token) => {
  const t = String(token ?? "").toLowerCase().trim();
  if (!t) return "unknown";
  if (t.includes("dsl") || t.includes("adsl") || t.includes("vdsl")) return "dsl";
  if (t.includes("optic") || t.includes("fiber") || t.includes("fibre")) return "optic_fiber";
  if (t.includes("satellite") || t.includes("sat")) return "satellite";
  if (t.includes("cable") || t.includes("coax")) return "cable";
  if (t.includes("mobile") || t.includes("cell") || t.includes("3g") || t.includes("4g") || t.includes("5g") || t.includes("lte")) return "mobile_data";
  if (t.includes("other")) return "other";
  if (t === "unknown" || t === "n/a" || t === "na" || t === "none") return "unknown";
  return "other";
};

export default function Home() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMdUp = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/arxiu_sortida.csv");
        if (!res.ok) throw new Error("Failed to load CSV");

        const text = await res.text();
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          transformHeader: (h) => String(h || "").replace(/\u00A0/g, " ").trim(),
        });

        let internetYes = 0;
        let dslCount = 0;
        let goodOrExcellent = 0;
        let totalWithQuality = 0;

        for (const row of parsed.data || []) {
          // Count libraries connected to internet
          const internetAccess = String(row["Does the library currently have Internet access?"] ?? "").trim().toLowerCase();
          if (internetAccess === "yes") {
            internetYes++;
          }

          // Count DSL connections
          const rawConn = row[CONNECTION_COL];
          const tokens = splitMulti(rawConn);
          for (const token of tokens) {
            if (bucketConnectionType(token) === "dsl") {
              dslCount++;
              break; // Count library once even if multiple DSL entries
            }
          }

          // Count perceived quality
          const qualityBucket = getPerceivedQualityBucket(row);
          if (qualityBucket !== "unknown") {
            totalWithQuality++;
            if (qualityBucket === "good" || qualityBucket === "excellent") {
              goodOrExcellent++;
            }
          }
        }

        const happyPercentage = totalWithQuality > 0 
          ? Math.round((goodOrExcellent / totalWithQuality) * 100) 
          : 0;

        setStats({
          librariesConnected: internetYes,
          librariesDSL: dslCount,
          happyPercentage: happyPercentage,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading stats:", err);
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const networkPosition = {
    verticalOffset: 25,
    horizontalOffset: -40,
  };

  // Format number to k (thousands)
  const formatK = (n) => {
    const v = Number(n) || 0;
    if (v >= 1000) return { value: Math.round(v / 1000), unit: "k" };
    return { value: v, unit: "" };
  };

  const connectedFormatted = formatK(stats?.librariesConnected || 0);
  const dslFormatted = formatK(stats?.librariesDSL || 0);

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center relative">

          {/* TEXT */}
          <div className="order-1" style={{ marginTop: "-40px" }}>
            <h1 style={styles.heroTitle}>Libraries Boosting Connectivity</h1>
            <p style={styles.heroText}>
              The 'Libraries Boosting Connectivity' project is an initiative looking to expand digital
              opportunities for and through libraries, aiming to obtain a more comprehensive picture of
              the global state of connectivity in libraries. The initiative gathers crucial library data on
              connectivity and the broader factors that shape digital access.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <a href="/map" style={styles.exploreButton}>
                <span style={styles.exploreButtonText}>Explore LBC Map</span>
                <img
                  src="/img/Icon core-arrow-circle-right.png"
                  alt="Arrow"
                  style={styles.exploreButtonIcon}
                />
              </a>
              <a href="/about" style={styles.aboutButton}>
                <span style={styles.aboutButtonText}>About</span>
              </a>
            </div>
          </div>

          {/* MAPA */}
          <div className="order-2 flex justify-center md:justify-end mt-10 md:mt-0">
            <div
              className="relative w-full max-w-[520px] md:max-w-none mb-12 md:mb-0"
              style={{
                transform: isMdUp
                  ? `translate(${networkPosition.horizontalOffset}vw, ${networkPosition.verticalOffset}vh)`
                  : "none",
                transition: "transform 0.3s ease",
              }}
            >
              <AnimatedNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 py-2">
        <div className="grid md:grid-cols-3 gap-6">
          <StatBox
            number={isLoading ? "..." : String(connectedFormatted.value)}
            unit={connectedFormatted.unit}
            description="libraries connected"
            text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod"
            link="/map?filter=library_status"
            linkText="Explore libraries status"
            imagePath="/img/Grupo 47.png"
            showGreenCircle={true}
          />

          <StatBox
            number={isLoading ? "..." : String(dslFormatted.value)}
            unit={dslFormatted.unit}
            description="libraries use DSL"
            text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod"
            link="/map?filter=type_connect"
            linkText="Explore types of connection"
            imagePath="/img/Grupo 49.png"
          />

          <StatBox
            number={isLoading ? "..." : String(stats?.happyPercentage || 0)}
            unit="%"
            description="of libraries are happy with their connection"
            text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod"
            link="/map?filter=perceived_quality"
            linkText="Explore perceived quality"
            imagePath="/img/Grupo 52.png"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const styles = {
  heroTitle: {
    font: "normal normal bold 42px/57px Noto Sans",
    color: "#0F6641",
    marginBottom: "36px",
    maxWidth: "700px",
  },
  heroText: {
    font: "normal normal normal 16px/22px Noto Sans",
    color: "#000000",
    marginBottom: "16px",
    maxWidth: "712px",
  },
  exploreButton: {
    background: "#C90030",
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: "0",
    textDecoration: "none",
  },
  exploreButtonText: {
    font: "normal normal medium 16px/16px Noto Sans",
    color: "#FFFFFF",
    marginRight: "8px",
  },
  exploreButtonIcon: {
    width: "16px",
    height: "16px",
    filter: "brightness(0) invert(1)",
  },
  aboutButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "83px",
    height: "38px",
    border: "1px solid #C90030",
    borderRadius: "0",
    textDecoration: "none",
    background: "transparent",
  },
  aboutButtonText: {
    font: "normal normal medium 16px/16px Noto Sans",
    color: "#C90030",
  },
};
