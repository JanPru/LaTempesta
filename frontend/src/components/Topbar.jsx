// src/components/Topbar.jsx
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

  // Bloquejar/desbloquejar scroll del body quan s'obre/tanca el menú
  useEffect(() => {
    if (menuOpen && isMobile) {
      // Guardar la posició actual del scroll
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // Cleanup al desmuntar
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [menuOpen, isMobile]);

  // Toggle the mobile menu. Clicking the hamburger icon calls this.
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Render links. For mobile we combine the red map link and arrow
  // together into a single anchor for simplicity. For desktop the
  // arrow remains separate so the layout stays unchanged.
  const NavLinks = ({ mobile = false }) => (
    <>
      <a
        href="#about"
        style={mobile ? styles.mobileNavLink : styles.navLink}
        onClick={mobile ? toggleMenu : undefined}
      >
        About
      </a>
      <a
        href="#impact"
        style={mobile ? styles.mobileNavLink : styles.navLink}
        onClick={mobile ? toggleMenu : undefined}
      >
        Impact
      </a>
      <a
        href="#resources"
        style={mobile ? styles.mobileNavLink : styles.navLink}
        onClick={mobile ? toggleMenu : undefined}
      >
        Resources
      </a>
      <a
        href="#faqs"
        style={mobile ? styles.mobileNavLink : styles.navLink}
        onClick={mobile ? toggleMenu : undefined}
      >
        FAQs
      </a>

      {/* The map link is styled separately to keep the brand colour. */}
      {mobile ? (
        <a
          href="/map"
          style={{
            ...styles.mobileNavLink,
            ...styles.navLinkRed,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={toggleMenu}
        >
          Explore LBC Map
          <img
            src="/img/Icon core-arrow-circle-right.png"
            alt="Arrow"
            style={styles.arrowIcon}
          />
        </a>
      ) : (
        <>
          <a href="/map" style={styles.navLinkRed}>
            Explore LBC Map
          </a>
          <a href="/map" style={styles.arrowButton}>
            <img
              src="/img/Icon core-arrow-circle-right.png"
              alt="Arrow"
              style={styles.arrowIcon}
            />
          </a>
        </>
      )}
    </>
  );

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* ✅ BRAND (igual que TopBrand d'abans) */}
        <a
          href="/"
          aria-label="Go to home"
          style={styles.brandLink}
        >
          {/* Quadrat verd LBC */}
          <div style={styles.brandSquare}>
            <span style={styles.brandSquareText}>LBC</span>
          </div>

          {/* Text en 2 línies */}
          <div style={styles.brandTextBlock}>
            <div style={styles.brandLine}>Libraries</div>
            <div style={styles.brandLine}>Boosting Connectivity</div>
          </div>
        </a>

        {/* Navigation */}
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
    overflowX: "hidden",
  },
  container: {
    maxWidth: "1280px",
    width: "100%",
    margin: "0 auto",
    padding: "20px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* ✅ Brand igual que TopBrand d'abans */
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "none",
    flexShrink: 0,
  },
  brandSquare: {
    width: 44,
    height: 44,
    borderRadius: 2,
    background: "#0F6641",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  brandSquareText: {
    font: "normal normal bold 16px/16px Noto Sans",
    color: "#FFFFFF",
    letterSpacing: "0.5px",
    transform: "translateY(1px)",
  },
  brandTextBlock: {
    lineHeight: 1.05,
    textAlign: "left",
    alignItems: "flex-start",
  },
  brandLine: {
    font: "normal normal bold 16px/18px Noto Sans",
    color: "#0F6641",
    whiteSpace: "nowrap",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
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
    position: "fixed",
    top: "78px", // Ajusta segons l'alçada real del header
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 999,
    maxHeight: "calc(100vh - 78px)",
    overflowY: "auto",
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