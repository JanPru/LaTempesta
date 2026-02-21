// src/pages/CountryProfiles.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import CountryProfileCard from "../components/CountryProfileCard";
import { COUNTRY_LIST } from "../data/countryProfilesData";

export default function CountryProfiles() {
  const navigate = useNavigate();
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 600) setColumns(1);
      else if (w <= 900) setColumns(2);
      else if (w <= 1100) setColumns(3);
      else setColumns(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleMoreInfo = (slug) => {
    navigate(`/country-profiles/${slug}`);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <a href="/" style={styles.breadcrumbLink}>
              Home
            </a>
            <span style={styles.breadcrumbSeparator}> &gt; </span>
            <span style={styles.breadcrumbCurrent}>Country profiles</span>
          </div>

          {/* Title */}
          <h1 style={styles.title}>Country profiles</h1>
        </div>
      </section>

      {/* Cards Grid */}
      <section style={styles.gridSection}>
        <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {COUNTRY_LIST.map((c) => (
            <CountryProfileCard
              key={c.name}
              name={c.name}
              description={c.description}
              onMoreInfo={() => handleMoreInfo(c.slug)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
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
    marginBottom: "12px",
  },
  breadcrumbLink: {
    font: "normal normal normal 12px/17px Noto Sans",
    color: "#000000",
    textDecoration: "underline",
  },
  breadcrumbSeparator: {
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
  gridSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "clamp(32px, 5vw, 60px) 16px",
    position: "relative",
    zIndex: 2,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "32px",
    justifyContent: "start",
  },
};
