import { useState, useEffect } from "react";

// The Topbar component renders a responsive header and navigation menu.
// On larger screens it displays a horizontal navigation bar. On smaller
// screens (<=768px) it collapses into a hamburger menu that toggles a
// vertical menu. Links remain accessible and retain the original
// styling where possible. Inline styles are used for simplicity and
// because the existing codebase employs them throughout.
export default function Topbar() {
  // Track whether the viewport should be considered mobile. A mobile
  // breakpoint of 768px is used. When the window resizes the state is
  // updated accordingly.
  const [isMobile, setIsMobile] = useState(false);
  // Track whether the mobile menu is open. Only relevant when
  // `isMobile` is true.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Determine if the current viewport width is considered mobile.
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    // Run once on mount to set the initial state.
    handleResize();
    // Register listener for subsequent resize events.
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle the mobile menu. Clicking the hamburger icon calls this.
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Render links. For mobile we combine the red map link and arrow
  // together into a single anchor for simplicity. For desktop the
  // arrow remains separate so the layout stays unchanged.
  const NavLinks = ({ mobile = false }) => (
    <>
      <a href="#about" style={mobile ? styles.mobileNavLink : styles.navLink}>About</a>
      <a href="#impact" style={mobile ? styles.mobileNavLink : styles.navLink}>Impact</a>
      <a href="#resources" style={mobile ? styles.mobileNavLink : styles.navLink}>Resources</a>
      <a href="#faqs" style={mobile ? styles.mobileNavLink : styles.navLink}>FAQs</a>
      {/* The map link is styled separately to keep the brand colour. */}
      {mobile ? (
        <a href="/map" style={{ ...styles.mobileNavLink, ...styles.navLinkRed, display: "flex", alignItems: "center", gap: "8px" }}>
          Explore LBC Map
          <img src="/img/Icon core-arrow-circle-right.png" alt="Arrow" style={styles.arrowIcon} />
        </a>
      ) : (
        <>
          <a href="/map" style={styles.navLinkRed}>Explore LBC Map</a>
          <a href="/map" style={styles.arrowButton}>
            <img src="/img/Icon core-arrow-circle-right.png" alt="Arrow" style={styles.arrowIcon} />
          </a>
        </>
      )}
    </>
  );

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          {/* Rectangle logo */}
          <div style={styles.logoBox}>
            <svg width="38" height="38" viewBox="0 0 38 38">
              <rect width="38" height="38" fill="#0F6641" rx="2" />
              <text
                x="19"
                y="24"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="16"
                fontWeight="bold"
                fontFamily="Noto Sans, Arial, sans-serif"
              >
                LBC
              </text>
            </svg>
          </div>

          {/* Logo text image */}
          <div style={styles.logoTextImage}>
            <img
              src="/img/Libraries Boosting Connectivity.png"
              alt="Libraries Boosting Connectivity"
              style={styles.logoImage}
            />
          </div>
        </div>

        {/* Navigation */}
        {/* Mobile view: show hamburger icon and conditional menu */}
        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Hamburger button */}
            <button
              style={styles.hamburgerButton}
              aria-label="Toggle navigation menu"
              onClick={toggleMenu}
            >
              <span style={styles.hamburgerLine}></span>
              <span style={styles.hamburgerLine}></span>
              <span style={styles.hamburgerLine}></span>
            </button>
            {/* Conditionally rendered mobile nav */}
            {menuOpen && (
              <nav style={styles.mobileNav}>
                <NavLinks mobile />
              </nav>
            )}
          </div>
        ) : (
          // Desktop view: render horizontal nav
          <nav style={styles.nav}>
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
}

// Define styles used by the Topbar component. Inline styles are
// maintained for consistency with the rest of the codebase.
const styles = {
  header: {
    backgroundColor: "#FFFFFF",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    overflowX: "hidden", // prevent horizontal scroll
  },
  container: {
    maxWidth: "1280px",
    width: "100%",
    margin: "0 auto",
    padding: "20px 16px", // reduce fixed side padding for smaller screens
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    height: "38px",
  },
  logoBox: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoTextImage: {
    width: "200px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  logoImage: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    opacity: 1,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px", // reduce gap for better fit on medium screens
    flexShrink: 0,
  },
  navLink: {
    textAlign: "left",
    font: "normal normal medium 16px/16px Noto Sans",
    letterSpacing: "0px",
    color: "#000000",
    opacity: 1,
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
  },
  navLinkRed: {
    textAlign: "left",
    textDecoration: "underline",
    font: "normal normal medium 16px/16px Noto Sans",
    letterSpacing: "0px",
    color: "#C90030",
    opacity: 1,
    cursor: "pointer",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
  },
  arrowButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    width: "16px",
    height: "16px",
  },
  arrowIcon: {
    width: "16px",
    height: "16px",
    opacity: 1,
  },
  // Mobile-specific styles
  hamburgerButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "24px",
    height: "18px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginLeft: "auto",
  },
  hamburgerLine: {
    width: "100%",
    height: "3px",
    backgroundColor: "#000000",
    borderRadius: "2px",
  },
  mobileNav: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 999,
  },
  mobileNavLink: {
    textAlign: "left",
    font: "normal normal medium 16px/24px Noto Sans",
    letterSpacing: "0px",
    color: "#000000",
    opacity: 1,
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
};
