import React, { useState } from "react";
import FilterHeader from "./FilterHeader";
import InfoCard from "./InfoCard";
import BottomFilters from "./BottomFilters";

/*
 * MenuLateral
 * - BottomFilters no longer uses bottom positioning
 * - It is placed "just below the last InfoCard" using TOP calc
 * - So on resize, it doesn't float up/down with panel height
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
  };

  // ===========
  // ✅ LAYOUT CONSTANTS (only touch these if needed)
  // ===========
  const INFOCARDS_TOP = "35.64%";     // same as your current cards container top
  const INFOCARDS_GAP_REM = 1.25;     // gap: 1.25rem
  const INFOCARD_HEIGHT_REM = 6.2;    // approx height of one InfoCard block
  const INFOCARDS_COUNT = 3;
  const AFTER_CARDS_MARGIN_REM = 8.0; // margin between last card and filters

  // Top for BottomFilters = INFOCARDS_TOP + height of 3 cards + gaps + margin
  const bottomFiltersTop = `calc(
    ${INFOCARDS_TOP} +
    (${INFOCARDS_COUNT} * ${INFOCARD_HEIGHT_REM}rem) +
    (${INFOCARDS_COUNT - 1} * ${INFOCARDS_GAP_REM}rem) +
    ${AFTER_CARDS_MARGIN_REM}rem
  )`;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: isOpen ? "0.875rem" : "-22.5rem",
        width: "22.5rem",
        height: "78vh",
        maxHeight: "78vh",
        background: "#FFFFFF",
        opacity: 0.9,
        zIndex: 10,
        transition: "left 0.3s ease",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Pestanya de tancar */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: "14.1%",
          right: "0",
          width: "1.125rem",
          height: "7.05%",
          background: "#0F6641",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <img
          src="/img/menuLateral/arrowDropDown.png"
          alt="Close menu"
          style={{
            width: "0.875rem",
            height: "0.875rem",
            filter: "invert(1)",
            transform: "rotate(90deg)",
          }}
        />
      </div>

      {/* Header */}
      <FilterHeader
        filters={filters}
        countries={countries}
        selectedCountry={selectedCountry}
        onSelectCountry={onSelectCountry}
      />

      {/* Línia separadora (header → worldwide) */}
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

      {/* Línia separadora (worldwide → title) */}
      <div
        style={{
          position: "absolute",
          top: "14.1%",
          left: "9.17%",
          right: "9.17%",
          border: "1px solid #DBDBDB",
        }}
      />

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
          detail={selectedCountry === "Worldwide" ? "Worldwide view" : `in ${selectedCountry}`}
        />

        <InfoCard
          icon="/img/menuLateral/Icon akar-wifi (1).png"
          iconWidth="1.25rem"
          iconHeight="1.06rem"
          title={`${s.connectivityMapped.toLocaleString()}`}
          subtitle="Libraries connectivity status mapped"
          detail={
            s.totalPoints
              ? `${Math.round((s.connectivityMapped / s.totalPoints) * 100)}% of mapped libraries`
              : "N/A"
          }
          hasInfo={true}
          progressBar={
            s.totalPoints
              ? {
                  colors: ["#0F6641", "#E0E0E0"],
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
                  colors: ["#0F6641", "#E0E0E0"],
                  widths: [
                    (s.goodDownload / s.downloadMeasured) * 100,
                    100 - (s.goodDownload / s.downloadMeasured) * 100,
                  ],
                }
              : null
          }
        />
      </div>

      {/* ✅ Bottom filters: placed under last InfoCard, NOT bottom-based */}
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

      {/* ✅ Optional: give scroll room so the last filters aren't cut */}
      <div style={{ position: "absolute", top: `calc(${bottomFiltersTop} + 6rem)`, height: "1px" }} />
    </div>
  );
}
