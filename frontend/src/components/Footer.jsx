// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.mainContent}>
        {/* Left side - Logos */}
        <div style={styles.logosSection}>
          {/* IFLA Logo */}
          <img 
            src="/img/ifla-logo.png" 
            alt="IFLA Logo" 
            style={styles.iflaImage}
          />

          {/* LBC Logo */}
          <div style={styles.lbcLogo}>
            <div style={styles.lbcBox}>
              <span style={styles.lbcText}>LBC</span>
            </div>
            <div style={styles.lbcSubtext}>
              <span style={styles.lbcBold}>Libraries</span>
              <span style={styles.lbcBold}>Boosting Connectivity</span>
            </div>
          </div>
        </div>

        {/* Right side - Navigation */}
        <nav style={styles.navSection}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
          <Link to="/country-profiles" style={styles.navLink}>Country profiles</Link>
          <Link to="/map" style={styles.exploreButton}>
            <span style={styles.exploreButtonText}>Explore LBC Map</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.exploreButtonIcon}>
              <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2"/>
              <path d="M10 8L14 12L10 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </nav>
      </div>

      {/* White separator line */}
      <div style={styles.separatorLineWrapper}>
        <div style={styles.separatorLine}></div>
      </div>

      {/* Copyright section */}
      <div style={styles.copyrightSection}>
        <span style={styles.copyrightText}>
          © International Federation of Library Associations and Institutions
        </span>
        <span style={styles.designedBy}>
          Designed by <a href="https://latempesta.cc" target="_blank" rel="noopener noreferrer" style={styles.designedByLink}>La Tempesta</a>
        </span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    width: "100%",
    backgroundColor: "#0F6641",
    padding: "0",
    marginTop: "60px",
  },
  mainContent: {
    maxWidth: "1440px",
    margin: "0 auto",
    padding: "32px clamp(24px, 5vw, 80px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
  },
  logosSection: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap",
  },
  iflaLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iflaImage: {
    height: "56px",
    width: "auto",
    filter: "brightness(0) invert(1)",
  },
  iflaText: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  },
  iflaTextBold: {
    font: "normal normal bold 10px/13px Noto Sans",
    color: "white",
  },
  iflaTextNormal: {
    font: "normal normal normal 10px/13px Noto Sans",
    color: "white",
  },
  lbcLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  lbcBox: {
    width: "44px",
    height: "44px",
    borderRadius: "2px",
    backgroundColor: "white",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  lbcText: {
    font: "normal normal bold 16px/16px Noto Sans",
    color: "#0F6641",
    letterSpacing: "0.5px",
  },
  lbcSubtext: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.05,
    textAlign: "left",
  },
  lbcNormal: {
    font: "normal normal normal 12px/15px Noto Sans",
    color: "white",
  },
  lbcBold: {
    font: "normal normal bold 16px/18px Noto Sans",
    color: "white",
    whiteSpace: "nowrap",
  },
  navSection: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    flexWrap: "wrap",
  },
  navLink: {
    font: "normal normal normal 14px/19px Noto Sans",
    color: "white",
    textDecoration: "none",
  },
  exploreButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#C90030",
    borderRadius: "0",
    textDecoration: "none",
  },
  exploreButtonText: {
    font: "normal normal medium 14px/16px Noto Sans",
    color: "white",
  },
  exploreButtonIcon: {
    width: "20px",
    height: "20px",
  },
  separatorLineWrapper: {
    maxWidth: "1440px",
    margin: "0 auto",
    padding: "0 clamp(24px, 5vw, 80px)",
  },
  separatorLine: {
    width: "100%",
    height: "1px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  copyrightSection: {
    maxWidth: "1440px",
    margin: "0 auto",
    padding: "16px clamp(24px, 5vw, 80px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  copyrightText: {
    font: "normal normal normal 12px/16px Noto Sans",
    color: "white",
  },
  designedBy: {
    font: "normal normal normal 12px/16px Noto Sans",
    color: "white",
  },
  designedByLink: {
    color: "white",
    textDecoration: "underline",
  },
};
