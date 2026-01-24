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

export default function TopBrand({ menuOpen, onToggleMenu }) {
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  // 👉 sempre posició de "menú tancat"
  const left = isMdUp ? 18 : 18;

  const goHome = () => {
    navigate("/");
  };

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
        onClick={onToggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
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