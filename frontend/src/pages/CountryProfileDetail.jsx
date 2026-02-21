// src/pages/CountryProfileDetail.jsx
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import COUNTRY_PROFILES_DATA from "../data/countryProfilesData";

/* ============================
   Pie Chart (SVG, no deps)
============================ */
function PieChart({ yes, no }) {
  const total = yes + no;
  const yesAngle = (yes / total) * 360;

  // SVG arc helper
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  };

  const cx = 120, cy = 120, r = 110;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={240} height={240} viewBox="0 0 240 240">
        {/* "No" slice (starts at 0) */}
        <path d={describeArc(cx, cy, r, 0, 360 - yesAngle)} fill="#1A8C7B" />
        {/* "Yes" slice */}
        <path d={describeArc(cx, cy, r, 360 - yesAngle, 360)} fill="#0F6641" />
      </svg>

      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", width: 240, marginTop: 8 }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ font: "normal normal bold 14px/18px Noto Sans", color: "#4B4B4B" }}>No</div>
          <div style={{ font: "normal normal normal 14px/18px Noto Sans", color: "#4B4B4B" }}>{no}%</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ font: "normal normal bold 14px/18px Noto Sans", color: "#4B4B4B" }}>Yes</div>
          <div style={{ font: "normal normal normal 14px/18px Noto Sans", color: "#4B4B4B" }}>{yes}%</div>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Bar Chart Table
============================ */
function BarChartTable({ data }) {
  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: 8,
          marginBottom: 4,
          gap: 16,
        }}
      >
        <div style={{ flex: "0 0 55%", font: "normal normal bold 16px/20px Noto Sans", color: "#000" }}>
          Value
        </div>
        <div style={{ flex: 1, font: "normal normal bold 16px/20px Noto Sans", color: "#000" }}>
          Percent
        </div>
      </div>

      {/* Rows */}
      {data.map((row, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 0",
            gap: 16,
          }}
        >
          <div
            style={{
              flex: "0 0 55%",
              font: "normal normal normal 14px/20px Noto Sans",
              color: "#000",
            }}
          >
            {row.label}
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
            {/* Bar background */}
            <div
              style={{
                flex: 1,
                height: 10,
                background: "#E0E0E0",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${row.percent}%`,
                  height: "100%",
                  background: "#0F6641",
                  borderRadius: 5,
                }}
              />
            </div>
            <span
              style={{
                font: "normal normal normal 14px/18px Noto Sans",
                color: "#000",
                minWidth: 45,
                textAlign: "right",
              }}
            >
              {row.percent}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================
   Country Profile Detail Page
============================ */
export default function CountryProfileDetail() {
  const { slug } = useParams();
  const data = COUNTRY_PROFILES_DATA[slug];

  if (!data) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h1 style={{ font: "normal normal bold 32px/40px Noto Sans", color: "#C90030" }}>
          Country not found
        </h1>
        <p style={{ marginTop: 16 }}>
          <Link to="/country-profiles" style={{ color: "#0F6641", textDecoration: "underline" }}>
            Back to Country profiles
          </Link>
        </p>
      </div>
    );
  }

  const { paragraphs, pieChart, pieCaption, barChart, barCaption, barChartAfterParagraph } = data;
  const insertIdx = barChartAfterParagraph ?? paragraphs.length;

  return (
    <div className="min-h-screen bg-gray-50" style={{ position: "relative", overflow: "hidden" }}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <a href="/" style={styles.breadcrumbLink}>Home</a>
            <span style={styles.breadcrumbSep}> &gt; </span>
            <Link to="/country-profiles" style={styles.breadcrumbLink}>Country profiles</Link>
            <span style={styles.breadcrumbSep}> &gt; </span>
            <span style={styles.breadcrumbCurrent}>{data.name}</span>
          </div>
          <h1 style={styles.title}>{data.name}</h1>
        </div>
      </section>

      {/* Content */}
      <section style={styles.contentSection}>
        <div style={styles.contentLayout}>
          {/* Left: text + bar chart */}
          <div style={styles.textColumn}>
            {paragraphs.map((p, idx) => (
              <div key={idx}>
                <p style={styles.paragraph}>{p}</p>

                {/* Insert bar chart after the specified paragraph */}
                {idx === insertIdx && barChart && (
                  <div style={{ margin: "32px 0" }}>
                    <BarChartTable data={barChart} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: pie chart (sticky) */}
          <div style={styles.chartColumn}>
            <div style={styles.chartSticky}>
              {pieChart && (
                <>
                  <PieChart yes={pieChart.yes} no={pieChart.no} />
                  {pieCaption && (
                    <p style={styles.pieCaption}>{pieCaption}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  heroSection: {
    position: "relative",
    width: "100%",
    minHeight: "195px",
    background: "#E9F4F0",
    zIndex: 0,
  },
  heroContent: {
    maxWidth: "1280px",
    width: "100%",
    margin: "0 auto",
    padding: "clamp(20px, 4vw, 35px) 16px",
    position: "relative",
    zIndex: 2,
  },
  breadcrumb: {
    marginBottom: 12,
  },
  breadcrumbLink: {
    font: "normal normal normal 12px/17px Noto Sans",
    color: "#000000",
    textDecoration: "underline",
  },
  breadcrumbSep: {
    font: "normal normal normal 12px/17px Noto Sans",
    color: "#000000",
  },
  breadcrumbCurrent: {
    font: "normal normal normal 12px/17px Noto Sans",
    color: "#000000",
  },
  title: {
    font: "normal normal bold clamp(28px, 5vw, 42px)/1.35 Noto Sans",
    color: "#0F6641",
    margin: 0,
  },
  contentSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "clamp(32px, 5vw, 60px) 16px",
  },
  contentLayout: {
    display: "flex",
    gap: "60px",
    alignItems: "flex-start",
  },
  textColumn: {
    flex: "1 1 60%",
    minWidth: 0,
  },
  chartColumn: {
    flex: "0 0 300px",
  },
  chartSticky: {
    position: "sticky",
    top: 100,
  },
  paragraph: {
    font: "normal normal normal 16px/26px Noto Sans",
    color: "#000000",
    marginBottom: 24,
    textAlign: "left",
  },
  caption: {
    font: "italic normal normal 13px/18px Noto Sans",
    color: "#0F6641",
    marginTop: 12,
    textAlign: "center",
  },
  pieCaption: {
    font: "italic normal normal 13px/18px Noto Sans",
    color: "#0F6641",
    marginTop: 16,
    textAlign: "center",
    maxWidth: 260,
  },
};
