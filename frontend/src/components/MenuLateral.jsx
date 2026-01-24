import React, { useState } from "react";
import FilterHeader from "./FilterHeader";
import InfoCard from "./InfoCard";
import BottomFilters from "./BottomFilters";
import LibraryDetailsPanel from "./LibraryDetailsPanel";

/*
 * MenuLateral (FIXED + BottomFilters always at very bottom in selectedLibrary mode)
 * - Default mode (Worldwide/Country): EXACTLY as you had it (absolute layout + calc top)  ✅ NO TOCAR
 * - Selected library mode:
 *   - Content flows (no overlap)
 *   - Spacer pushes BottomFilters to the END of the panel (end of scroll)
 * - Tab always visible; only white panel slides
 */
export default function MenuLateral({
  isLoading,
  isOpen,
  onClose,

  countries = [],
  selectedCountry = "Worldwide",
  onSelectCountry,

  countriesCount = 0,
  stats,

  // biblioteca seleccionada (objecte amb properties)
  selectedLibrary,
}) {
  const [filters] = useState({
    country: "Country",
    typeOfLibrary: "Type of library",
  });

  const showCountriesCount = selectedCountry === "Worldwide";

  const s = stats || {
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
    dlRed: 0,
    dlOrange: 0,
    dlGreen: 0,
  };

  // ===========
  // LAYOUT CONSTANTS
  // ===========
  const PANEL_WIDTH_REM = 22.5; // 22.5rem
  const TAB_WIDTH_REM = 1.125; // 1.125rem

  // Default cards layout (NO TOCAR)
  const INFOCARDS_TOP = "35.64%";
  const INFOCARDS_GAP_REM = 1.25;
  const INFOCARD_HEIGHT_REM = 6.2;
  const INFOCARDS_COUNT = 3;
  const AFTER_CARDS_MARGIN_REM = 8.0;

  // Selected library top (NO TOCAR el top)
  const LIB_DETAILS_TOP = "16.2%";

  // Bottom filters top depends on mode (DEFAULT mode only; library mode won't use this)
  const bottomFiltersTop = `calc(
    ${INFOCARDS_TOP} +
    (${INFOCARDS_COUNT} * ${INFOCARD_HEIGHT_REM}rem) +
    (${INFOCARDS_COUNT - 1} * ${INFOCARDS_GAP_REM}rem) +
    ${AFTER_CARDS_MARGIN_REM}rem
  )`;

  // Panel slides in/out inside wrapper
  const panelLeft = isOpen ? "0rem" : `-${PANEL_WIDTH_REM}rem`;

  // Tab position depends on open/closed
  const tabLeft = isOpen ? `calc(${PANEL_WIDTH_REM}rem - 0.01rem)` : "0rem";

  // Arrow direction
  const arrowRotate = isOpen ? "rotate(90deg)" : "rotate(-90deg)";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: "0.875rem",
        width: `calc(${PANEL_WIDTH_REM}rem + ${TAB_WIDTH_REM}rem)`,
        height: "78vh",
        maxHeight: "78vh",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      {/* TAB ALWAYS VISIBLE */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: "14.1%",
          left: tabLeft,
          width: `${TAB_WIDTH_REM}rem`,
          height: "7.05%",
          background: "#0F6641",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 60,
        }}
      >
        <img
          src="/img/menuLateral/arrowDropDown.png"
          alt={isOpen ? "Close menu" : "Open menu"}
          style={{
            width: "0.875rem",
            height: "0.875rem",
            filter: "invert(1)",
            transform: arrowRotate,
            display: "block",
          }}
        />
      </div>

      {/* WHITE PANEL */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: panelLeft,
          width: `${PANEL_WIDTH_REM}rem`,
          height: "100%",
          maxHeight: "100%",
          background: "#FFFFFF",
          opacity: 0.9,
          transition: "left 0.3s ease",
          overflowY: "auto",
          overflowX: "visible",
        }}
      >
        {/* Header */}
        <FilterHeader
          filters={filters}
          countries={countries}
          selectedCountry={selectedCountry}
          onSelectCountry={onSelectCountry}
        />

        {/* Separator line */}
        <div
          style={{
            position: "absolute",
            top: "7.44%",
            left: "9.17%",
            right: "9.17%",
            border: "1px solid #DBDBDB",
          }}
        />

        {/* Country selected + share */}
        <div
          style={{
            position: "absolute",
            top: "9.49%",
            left: "9.17%",
            right: "9.17%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              font: "normal normal normal 1rem/1.56rem Noto Sans",
              color: "#000000",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedCountry}
            {showCountriesCount && (
              <span style={{ marginLeft: "1.25rem" }}>
                {countriesCount} countries
              </span>
            )}
          </div>

          <img
            src="/img/menuLateral/Share.png"
            alt="Share"
            style={{
              width: "0.875rem",
              height: "0.94rem",
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Separator line (under header section) */}
        <div
          style={{
            position: "absolute",
            top: "14.1%",
            left: "9.17%",
            right: "9.17%",
            border: "1px solid #DBDBDB",
          }}
        />

        {/* DYNAMIC CONTENT */}
        {selectedLibrary ? (
          // ===== Selected library mode (NO overlap + filters at end) =====
          <div
            style={{
              position: "absolute",
              top: LIB_DETAILS_TOP,
              left: "9.17%",
              right: "9.17%",

              // ✅ vertical flow
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              paddingBottom: "1.5rem",

              // ✅ make this area at least fill the panel height below the top offset,
              // so the spacer can push filters to the bottom when content is short
              minHeight: `calc(100% - ${LIB_DETAILS_TOP})`,
            }}
          >
            <LibraryDetailsPanel library={selectedLibrary} />

            {/* 🔑 SPACER: pushes BottomFilters to the very bottom */}
            <div style={{ flexGrow: 1 }} />

            {/* BottomFilters at the END (full width) */}
            <div style={{ marginLeft: "-9.17%", marginRight: "-9.17%" }}>
              <BottomFilters isLoading={isLoading} embedded />
            </div>

            {/* extra scroll room */}
            <div style={{ height: "1rem" }} />
          </div>
        ) : (
          // ===== Default mode (NO TOCAR) =====
          <>
            {/* Title */}
            <div
              style={{
                position: "absolute",
                top: "16.67%",
                left: "9.17%",
                width: "66.67%",
                font: "normal normal bold 1.25rem/1.56rem Noto Sans",
                color: "#000000",
              }}
            >
              Libraries
              <br />
              Boosting Connectivity
            </div>

            {/* Description */}
            <div
              style={{
                position: "absolute",
                top: "25.38%",
                left: "9.17%",
                right: "9.17%",
                font: "normal normal normal 1rem/1.56rem Noto Sans",
                color: "#4B4B4B",
              }}
            >
              An open & live global map of libraries and their connectivity
            </div>

            {/* Info cards */}
            <div
              style={{
                position: "absolute",
                top: INFOCARDS_TOP,
                left: "9.17%",
                right: "9.17%",
                display: "flex",
                flexDirection: "column",
                gap: `${INFOCARDS_GAP_REM}rem`,
              }}
            >
              <InfoCard
                icon="/img/menuLateral/Icon core-location-pin.png"
                iconWidth="0.94rem"
                iconHeight="1.31rem"
                title={`${s.totalPoints.toLocaleString()}`}
                subtitle="Libraries location mapped"
                detail={
                  selectedCountry === "Worldwide"
                    ? "Worldwide view"
                    : `in ${selectedCountry}`
                }
              />

              <InfoCard
                icon="/img/menuLateral/Icon akar-wifi (1).png"
                iconWidth="1.25rem"
                iconHeight="1.06rem"
                title={`${s.connectivityMapped.toLocaleString()}`}
                subtitle="Libraries connectivity status mapped"
                detail={
                  s.totalPoints
                    ? `${Math.round(
                        (s.connectivityMapped / s.totalPoints) * 100
                      )}% of mapped libraries`
                    : "N/A"
                }
                hasInfo={true}
                progressBar={
                  s.totalPoints
                    ? {
                        colors: ["#3ED896", "#E0E0E0"],
                        widths: [
                          (s.connectivityMapped / s.totalPoints) * 100,
                          100 - (s.connectivityMapped / s.totalPoints) * 100,
                        ],
                      }
                    : null
                }
              />

              <InfoCard
                icon="/img/menuLateral/Icon core-cloud-download.png"
                iconWidth="1.25rem"
                iconHeight="1.06rem"
                title={`${s.goodDownload.toLocaleString()}`}
                subtitle="Libraries with good download speed"
                detail={
                  s.downloadMeasured
                    ? `of ${s.downloadMeasured.toLocaleString()} libraries inspected`
                    : "No download data detected"
                }
                hasInfo={true}
                progressBar={
                  s.downloadMeasured
                    ? {
                        colors: ["#F82055", "#F9A825", "#3ED896"],
                        widths: [
                          (s.dlRed / s.downloadMeasured) * 100,
                          (s.dlOrange / s.downloadMeasured) * 100,
                          (s.dlGreen / s.downloadMeasured) * 100,
                        ],
                      }
                    : null
                }
              />
            </div>

            {/* Bottom filters ALWAYS (DEFAULT MODE) */}
            <div
              style={{
                position: "absolute",
                top: bottomFiltersTop,
                left: 0,
                right: 0,
              }}
            >
              <BottomFilters isLoading={isLoading} />
            </div>

            {/* Scroll room ALWAYS */}
            <div
              style={{
                position: "absolute",
                top: `calc(${bottomFiltersTop} + 6rem)`,
                height: "1px",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}