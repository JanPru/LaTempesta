// src/components/TopBrand.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- Hook media query (mateix patró que Home) ---------- */
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

export default function TopBrand() {
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  // 👉 sempre posició de "menú tancat"
  const left = isMdUp ? 18 : 18;

  const goHome = () => {
    navigate("/");
  };

  const toggleNavMenu = () => setNavMenuOpen((prev) => !prev);

  // Bloquejar/desbloquejar scroll del body quan s'obre/tanca el menú
  useEffect(() => {
    if (navMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [navMenuOpen]);

  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        left,
        zIndex: 60,

        display: "flex",
        alignItems: "center",
        gap: 10,

        background: "transparent",
        padding: 0,
        borderRadius: 0,
        boxShadow: "none",

        pointerEvents: "auto",
      }}
    >
      {/* Botó menú (hamburger) */}
      <button
        type="button"
        onClick={toggleNavMenu}
        aria-label={navMenuOpen ? "Close menu" : "Open menu"}
        style={{
          width: 34,
          height: 34,
          display: "grid",
          placeItems: "center",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7H20M4 12H20M4 17H20"
            stroke="#0F6641"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Navigation Menu Dropdown */}
      {navMenuOpen && (
        <>
          {/* Overlay per tancar el menú quan es clica fora */}
          <div
            onClick={() => setNavMenuOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
          />
          <nav
            style={{
              position: "fixed",
              top: 70,
              left: 18,
              width: "22.5rem",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "16px 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 999,
              maxHeight: "calc(100vh - 70px)",
              overflowY: "auto",
              borderRadius: 4,
            }}
          >
            <a
              href="/"
              style={styles.mobileNavLink}
              onClick={() => setNavMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 12L12 3L21 12M5 10V20C5 20.55 5.45 21 6 21H10V15H14V21H18C18.55 21 19 20.55 19 20V10" stroke="#0F6641" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
            </a>
            <a
              href="/about"
              style={styles.mobileNavLink}
              onClick={() => setNavMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#0F6641" strokeWidth="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="#0F6641" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              About
            </a>
            <a
              href="/country-profiles"
              style={styles.mobileNavLink}
              onClick={() => setNavMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#0F6641" strokeWidth="2"/>
                <path d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22" stroke="#0F6641" strokeWidth="2"/>
              </svg>
              Country Profiles
            </a>
          </nav>
        </>
      )}

      {/* ✅ BRAND CLICABLE → HOME */}
      <button
        type="button"
        onClick={goHome}
        aria-label="Go to home"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {/* Quadrat verd LBC */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 2,
            background: "#0F6641",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              font: "normal normal bold 16px/16px Noto Sans",
              color: "#FFFFFF",
              letterSpacing: "0.5px",
              transform: "translateY(1px)",
            }}
          >
            LBC
          </span>
        </div>

        {/* 🔹 TEXT ALINEAT A L'ESQUERRA (FIX) */}
        <div
          style={{
            lineHeight: 1.05,
            textAlign: "left",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              font: "normal normal bold 16px/18px Noto Sans",
              color: "#0F6641",
              whiteSpace: "nowrap",
            }}
          >
            Libraries
          </div>
          <div
            style={{
              font: "normal normal bold 16px/18px Noto Sans",
              color: "#0F6641",
              whiteSpace: "nowrap",
            }}
          >
            Boosting Connectivity
          </div>
        </div>
      </button>
    </div>
  );
}

const styles = {
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
    gap: 12,
    justifyContent: "flex-start",
  },
};