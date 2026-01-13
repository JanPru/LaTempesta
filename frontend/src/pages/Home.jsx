import { useEffect, useState } from "react";
import StatBox from "../components/StatBox";
import AnimatedNetwork from "../components/AnimatedNetwork";

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div
          className="grid md:grid-cols-2 gap-12 items-center"
          style={{ position: "relative" }}
        >
          <div>
            <h1 style={styles.heroTitle}>Libraries Boosting Connectivity</h1>
            <p style={styles.heroText}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est
            </p>
            <a href="/map" style={styles.exploreButton}>
              <span style={styles.exploreButtonText}>Explore LBC Map</span>
              <img
                src="/img/Icon core-arrow-circle-right.png"
                alt="Arrow"
                style={styles.exploreButtonIcon}
              />
            </a>
          </div>
          <AnimatedNetwork />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-6 py-2">
        <div className="grid md:grid-cols-3 gap-6">
          <StatBox
            number={stats ? Math.floor(stats.total_libraries / 1000) : "310"}
            unit="k"
            description="libraries connected"
            text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod"
            link="#status"
            linkText="Explore libraries status"
            imagePath="/img/Grupo 47.png"
            showGreenCircle={true}
          />

          <StatBox
            number="90"
            unit="k"
            description="libraries use DSL"
            text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod"
            link="#connection"
            linkText="Explore types of connection"
            imagePath="/img/Grupo 49.png"
          />

          <StatBox
            number="55"
            unit="%"
            description="of libraries are happy with their connection"
            text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod"
            link="#quality"
            linkText="Explore perceived quality"
            imagePath="/img/Grupo 52.png"
          />
        </div>
      </section>
    </div>
  );
}

const styles = {
  heroTitle: {
    textAlign: "left",
    font: "normal normal bold 42px/57px Noto Sans",
    letterSpacing: "0px",
    color: "#0F6641",
    opacity: 1,
    marginBottom: "36px",
    width: "100%",
    maxWidth: "700px",
    height: "auto",
  },
  heroText: {
    textAlign: "left",
    font: "normal normal normal 16px/22px Noto Sans",
    letterSpacing: "0px",
    color: "#000000",
    opacity: 1,
    marginBottom: "16px",
    width: "100%",
    maxWidth: "712px",
    height: "auto",
  },
  exploreButton: {
    background: "#C90030",
    opacity: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 14px",
    textDecoration: "none",
    cursor: "pointer",
    borderRadius: "4px",
    width: "fit-content",
    height: "auto",
  },
  exploreButtonText: {
    textAlign: "left",
    font: "normal normal medium 16px/16px Noto Sans",
    letterSpacing: "0px",
    color: "#FFFFFF",
    opacity: 1,
    marginRight: "8px",
    whiteSpace: "nowrap",
  },
  exploreButtonIcon: {
    width: "16px",
    height: "16px",
    opacity: 1,
    filter: "brightness(0) invert(1)",
  },
};