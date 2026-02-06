import React, { useMemo, useState, useEffect, useRef } from "react";

/*
 * FilterHeader - Resize Proof
 * - Dropdown simple per "Country" amb scroll
 * - Dropdown simple per "Type of library" amb scroll
 * - Mostra tots els països disponibles (countries)
 * - Mostra tots els tipus de biblioteca disponibles (libraryTypes)
 * - Selecció: crida onSelectCountry(country) / onSelectLibraryType(type)
 */
export default function FilterHeader({
  selectedCountry = "Worldwide",
  countries = [],
  onSelectCountry,
  libraryTypes = [],
  selectedLibraryType = "All",
  onSelectLibraryType,
  mobile = false,
}) {
  const [openCountry, setOpenCountry] = useState(false);
  const [openLibraryType, setOpenLibraryType] = useState(false);
  
  const containerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenCountry(false);
        setOpenLibraryType(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortedCountries = useMemo(() => {
    const arr = (countries || []).filter(Boolean);
    return arr.sort((a, b) => a.localeCompare(b));
  }, [countries]);

  const sortedLibraryTypes = useMemo(() => {
    const arr = (libraryTypes || []).filter(Boolean);
    return arr.sort((a, b) => a.localeCompare(b));
  }, [libraryTypes]);

  return (
    <div
      ref={containerRef}
      style={{
        position: mobile ? "relative" : "absolute",
        top: mobile ? "0" : "3%",
        left: "0",
        width: "100%",
        paddingLeft: mobile ? "0" : "9.17%",
        paddingRight: mobile ? "0" : "9.17%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          whiteSpace: "nowrap",
        }}
      >
        {/* Filter icon */}
        <img
          src="/img/menuLateral/Icon material-sharp-filter-alt.png"
          alt="Filter"
          style={{ width: "1.06rem", height: "0.94rem", flexShrink: 0 }}
        />

        <span
          style={{
            font: "normal normal normal 0.875rem/1.56rem Noto Sans",
            color: "#606060",
            flexShrink: 0,
          }}
        >
          Filter
        </span>

        {/* Country (dropdown) */}
        <div style={{ position: "relative", marginLeft: "1rem" }}>
          <div
            onClick={() => {
              setOpenCountry((v) => !v);
              setOpenLibraryType(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.31rem",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <span
              style={{
                font: "normal normal 600 1rem/1.56rem Noto Sans",
                color: "#000000",
              }}
            >
              Country
            </span>

            {/* icon correcte (el teu) */}
            <img
              src="/img/menuLateral/arrowDropDown.png"
              alt="Open country menu"
              style={{
                width: "0.69rem",
                height: "0.69rem",
                marginTop: "0.125rem",
                transform: openCountry ? "rotate(-90deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            />
          </div>

          {/* Dropdown */}
          {openCountry && (
            <div
              style={{
                position: "absolute",
                top: "1.75rem",
                left: "0",
                width: "13.75rem",
                maxHeight: "13.75rem",
                overflowY: "auto",
                background: "#FFFFFF",
                border: "1px solid #DBDBDB",
                boxShadow: "0 0.125rem 0.625rem rgba(0,0,0,0.12)",
                zIndex: 200,
              }}
            >
              {/* Worldwide sempre a dalt */}
              <div
                onClick={() => {
                  onSelectCountry?.("Worldwide");
                  setOpenCountry(false);
                }}
                style={{
                  padding: "0.625rem 0.75rem",
                  font: "normal normal normal 0.875rem/1.125rem Noto Sans",
                  color: selectedCountry === "Worldwide" ? "#0F6641" : "#4B4B4B",
                  background: selectedCountry === "Worldwide" ? "#F2F2F2" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                Worldwide
              </div>

              {sortedCountries.map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    onSelectCountry?.(c);
                    setOpenCountry(false);
                  }}
                  style={{
                    padding: "0.625rem 0.75rem",
                    font: "normal normal normal 0.875rem/1.125rem Noto Sans",
                    color: selectedCountry === c ? "#0F6641" : "#4B4B4B",
                    background: selectedCountry === c ? "#F2F2F2" : "#FFFFFF",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = selectedCountry === c ? "#F2F2F2" : "#FFFFFF")
                  }
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Type of library (dropdown) */}
        <div style={{ position: "relative", marginLeft: "0.625rem" }}>
          <div
            onClick={() => {
              setOpenLibraryType((v) => !v);
              setOpenCountry(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.31rem",
              cursor: "pointer",
              userSelect: "none",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                font: "normal normal 600 1rem/1.56rem Noto Sans",
                color: "#000000",
              }}
            >
              Type of library
            </span>

            <img
              src="/img/menuLateral/arrowDropDown.png"
              alt="Open library type menu"
              style={{
                width: "0.69rem",
                height: "0.69rem",
                marginTop: "0.125rem",
                transform: openLibraryType ? "rotate(-90deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            />
          </div>

          {/* Dropdown */}
          {openLibraryType && (
            <div
              style={{
                position: "absolute",
                top: "1.75rem",
                right: "0",
                width: "13.75rem",
                maxHeight: "13.75rem",
                overflowY: "auto",
                background: "#FFFFFF",
                border: "1px solid #DBDBDB",
                boxShadow: "0 0.125rem 0.625rem rgba(0,0,0,0.12)",
                zIndex: 200,
              }}
            >
              {/* All sempre a dalt */}
              <div
                onClick={() => {
                  onSelectLibraryType?.("All");
                  setOpenLibraryType(false);
                }}
                style={{
                  padding: "0.625rem 0.75rem",
                  font: "normal normal normal 0.875rem/1.125rem Noto Sans",
                  color: selectedLibraryType === "All" ? "#0F6641" : "#4B4B4B",
                  background: selectedLibraryType === "All" ? "#F2F2F2" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                All
              </div>

              {sortedLibraryTypes.map((t) => (
                <div
                  key={t}
                  onClick={() => {
                    onSelectLibraryType?.(t);
                    setOpenLibraryType(false);
                  }}
                  style={{
                    padding: "0.625rem 0.75rem",
                    font: "normal normal normal 0.875rem/1.125rem Noto Sans",
                    color: selectedLibraryType === t ? "#0F6641" : "#4B4B4B",
                    background: selectedLibraryType === t ? "#F2F2F2" : "#FFFFFF",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = selectedLibraryType === t ? "#F2F2F2" : "#FFFFFF")
                  }
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}