import { useEffect, useState } from "react";
import StatBox from "../components/StatBox";
import AnimatedNetwork from "../components/AnimatedNetwork";

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

export default function Home() {
  const [stats, setStats] = useState(null);
  const isMdUp = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error(err));
  }, []);

  const networkPosition = {
    verticalOffset: 25,
    horizontalOffset: -40,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center relative">

          {/* TEXT */}
          <div className="order-1">
            <h1 style={styles.heroTitle}>Libraries Boosting Connectivity</h1>
            <p style={styles.heroText}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
              et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
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
    borderRadius: "4px",
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
};
