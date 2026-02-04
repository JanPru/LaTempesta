// src/pages/About.jsx
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ position: "relative", overflow: "hidden" }}>
      {/* Decorative Lines - Fora del quadre, per sobre de tot */}
      <div style={styles.decorativeLinesWrapper}>
        <img 
          src="/img/Lines.png" 
          alt="" 
          style={styles.decorativeLines}
        />
      </div>

      {/* Hero Section amb fons verd clar */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <a href="/" style={styles.breadcrumbLink}>Home</a>
            <span style={styles.breadcrumbSeparator}> &gt; </span>
            <span style={styles.breadcrumbCurrent}>About</span>
          </div>

          {/* Títol */}
          <h1 style={styles.title}>About LBC</h1>
        </div>
      </section>

      {/* Text Content */}
      <section style={styles.textSection}>
        <div style={styles.textContent}>
          <p style={styles.paragraph}>
            The 'Libraries Boosting Connectivity' project is an initiative looking to expand digital
            opportunities for and through libraries, aiming to obtain a more comprehensive picture of
            the global state of connectivity in libraries. The initiative gathers crucial library data on
            connectivity and the broader factors that shape digital access. Our main goal is to identify
            possible areas of need and opportunity
            to inform future strategies and improve Internet access in libraries, build capacity, foster
            partnerships and increase educational opportunities for communities worldwide.
          </p>

          <p style={styles.paragraph}>
            A pilot phase of the project started in October 2024 and ended in July 2025, conducting a
            survey in the following countries: Cameroon, Nigeria, Zambia, Kenya, Namibia, Lebanon,
            Iraq and Chile. The survey was part of the initial data gathering process and while it was
            open to all types of libraries, its main focus was to address public libraries. The information
            collected focused on two areas: first, identifying the geolocation and connectivity status in
            each library (e.g. average download speed, permanence, type of connection, etc.); and
            second, assessing the state of their infrastructure, available resources and types of digital-
            related training that those libraries offer.
          </p>

          <p style={styles.paragraph}>
            While most of the libraries that participated in the project are connected to the Internet, a
            certain number of unconnected libraries was also surveyed with the objective of
            understanding the barriers that they face to obtain Internet access and/or adequate
            devices.
          </p>

          <p style={styles.paragraph}>
            The data collection process was led by regional coordinators in collaboration with IFLA. This
            website was published upon the conclusion of the first phase of this project, and it is meant
            to serve as a starting point to continue deepening our understanding of the digital needs in
            these libraries and regions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const styles = {
  decorativeLinesWrapper: {
    position: "absolute",
    top: 0,
    right: "-200px",
    width: "80%",
    maxWidth: "850px",
    height: "550px",
    overflow: "hidden",
    zIndex: 1,
    pointerEvents: "none",
  },
  decorativeLines: {
    width: "120%",
    height: "auto",
    objectFit: "cover",
    objectPosition: "top right",
  },
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
    padding: "clamp(20px, 4vw, 35px) clamp(24px, 10vw, 132px)",
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
  textSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "clamp(24px, 4vw, 40px) clamp(24px, 10vw, 132px)",
    position: "relative",
    zIndex: 2,
  },
  textContent: {
    maxWidth: "712px",
  },
  paragraph: {
    font: "normal normal normal 16px/26px Noto Sans",
    color: "#000000",
    marginBottom: "24px",
    textAlign: "left",
  },
};
