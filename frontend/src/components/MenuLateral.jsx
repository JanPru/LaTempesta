import React, { useState } from "react";
import FilterHeader from "./FilterHeader";
import InfoCard from "./InfoCard";
import BottomFilters from "./BottomFilters";

/*
 * MenuLateral implements the sliding panel on the left hand side of MapPage.
 * - Vertically centered using % (responsive on resize)
 * - Height uses vh so it scales with screen height
 * - Slightly taller for better content balance
 */
export default function MenuLateral({ stats, isLoading, isOpen, onClose }) {
  const [filters] = useState({
    country: "Worldwide",
    typeOfLibrary: "142 countries",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)", // centre vertical real
        left: isOpen ? "14px" : "-325px",
        width: "325px",

        // ⬇️ ALÇADA RESPONSIVE (una mica més llarga)
        height: "88vh",
        maxHeight: "88vh",

        background: "#FFFFFF",
        opacity: 0.9,
        zIndex: 10,
        transition: "left 0.3s ease",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Botó de tancar menú (centrat verticalment) */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: "0px",
          width: "35px",
          height: "55px",
          background: "#0F6641",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/img/menuLateral/Icon ion-ios-arrow-drop-left.png"
          alt="Close menu"
          style={{
            width: "14px",
            height: "14px",
            filter: "invert(1)",
          }}
        />
      </div>

      {/* Header de filtres */}
      <FilterHeader filters={filters} />

      {/* Línia separadora */}
      <div
        style={{
          position: "absolute",
          top: "58px",
          left: "33px",
          width: "291px",
          border: "1px solid #DBDBDB",
        }}
      />

      {/* Country + type + share */}
      <div
        style={{
          position: "absolute",
          top: "74px",
          left: "33px",
          right: "33px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            font: "normal normal normal 16px/25px Noto Sans",
            color: "#000000",
          }}
        >
          {filters.country}
          <span style={{ marginLeft: "20px" }}>
            {filters.typeOfLibrary}
          </span>
        </div>

        <img
          src="/img/menuLateral/Icon ion-share-social-outline.png"
          alt="Share"
          style={{
            width: "14px",
            height: "15px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Títol */}
      <div
        style={{
          position: "absolute",
          top: "130px",
          left: "33px",
          width: "220px",
          font: "normal normal bold 20px/25px Noto Sans",
          color: "#000000",
        }}
      >
        Libraries
        <br />
        Boosting Connectivity
      </div>

      {/* Descripció */}
      <div
        style={{
          position: "absolute",
          top: "198px",
          left: "33px",
          width: "281px",
          font: "normal normal normal 16px/25px Noto Sans",
          color: "#4B4B4B",
        }}
      >
        An open & live global map of libraries and their connectivity
      </div>

      {/* Info cards */}
      <div
        style={{
          position: "absolute",
          top: "278px",
          left: "33px",
          right: "33px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <InfoCard
          icon="/img/menuLateral/Icon core-location-pin.png"
          iconWidth="15px"
          iconHeight="21px"
          title="1.2 M / 2.8 M"
          subtitle="Libraries location mapped"
          detail="across 142 countries"
        />

        <InfoCard
          icon="/img/menuLateral/Icon akar-wifi (1).png"
          iconWidth="20px"
          iconHeight="17px"
          title="430 k"
          subtitle="Libraries connectivity status mapped"
          detail="across 36 countries"
          hasInfo={true}
          progressBar={{
            colors: ["#0F6641", "#E74C3C", "#3B5998"],
            widths: [40, 30, 30],
          }}
        />

        <InfoCard
          icon="/img/menuLateral/Icon core-cloud-download.png"
          iconWidth="20px"
          iconHeight="17px"
          title="121 k"
          subtitle="Libraries with good download speed"
          detail="of 311 K libraries inspected"
          hasInfo={true}
          progressBar={{
            colors: ["#0F6641", "#FFA500", "#E74C3C"],
            widths: [50, 30, 20],
          }}
        />
      </div>

      {/* Filtres inferiors */}
      <BottomFilters isLoading={isLoading} />
    </div>
  );
}
