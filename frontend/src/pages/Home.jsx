// Home.jsx
import { useEffect, useState } from "react";
import StatBox from "../components/StatBox";
import AnimatedNetwork from "../components/AnimatedNetwork";

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stats")
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 style={styles.heroTitle}>
              Libraries Boosting Connectivity
            </h1>
            <p style={styles.heroText}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam 
              et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            </p>
            <a 
              href="/map" 
              style={styles.exploreButton}
            >
              <span style={styles.exploreButtonText}>Explore LBC Map</span>
              <img 
                src="/img/Icon core-arrow-circle-right.png" 
                alt="Arrow"
                style={styles.exploreButtonIcon}
              />
            </a>
          </div>
          <div className="relative">
            <AnimatedNetwork />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-6">
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
    width: '700px',
    height: '57px',
    textAlign: 'left',
    font: 'normal normal bold 42px/57px Noto Sans',
    letterSpacing: '0px',
    color: '#0F6641',
    opacity: 1,
    marginBottom: '36px',
  },
  heroText: {
    width: '712px',
    height: '106px',
    textAlign: 'left',
    font: 'normal normal normal 16px/22px Noto Sans',
    letterSpacing: '0px',
    color: '#000000',
    opacity: 1,
    marginBottom: '0px',
  },
  exploreButton: {
    width: '197px',
    height: '38px',
    background: '#C90030',
    opacity: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 14px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  exploreButtonText: {
    width: '129px',
    height: '22px',
    textAlign: 'left',
    font: 'normal normal medium 16px/16px Noto Sans',
    letterSpacing: '0px',
    color: '#FFFFFF',
    opacity: 1,
  },
  exploreButtonIcon: {
    width: '16px',
    height: '16px',
    opacity: 1,
    filter: 'brightness(0) invert(1)', // Per fer la icona blanca
  },
};