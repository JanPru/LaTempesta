import React, { useState } from "react";
import FilterHeader from "./FilterHeader";
import InfoCard from "./InfoCard";
import BottomFilters from "./BottomFilters";

/*
 * MenuLateral implements the sliding panel on the left hand side of MapPage.
 * - Vertically centered using % (responsive on resize)
 * - Height uses vh so it scales with screen height
 * - Slightly wider so header fits symmetrically
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
        transform: "translateY(-50%)",
        left: isOpen ? "14px" : "-360px",
        width: "360px",
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
      {/* Pestanya de tancar (fora del blanc, més amunt, més prima) */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",

          // ✅ a l'alçada de la segona línia separadora
          top: "110px",

          // ✅ fora del panell blanc
          right: "0px",

          // ✅ més prima
          width: "18px",
          height: "55px",

          background: "#0F6641",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/img/menuLateral/arrowDropDown.png"
          alt="Close menu"
          style={{
            width: "14px",
            height: "14px",
            filter: "invert(1)",
            transform: "rotate(90deg)",

          }}
        />
      </div>

      {/* Header */}
      <FilterHeader filters={filters} />

      {/* Línia separadora (header → worldwide) */}
      <div
        style={{
          position: "absolute",
          top: "58px",
          left: "33px",
          right: "33px",
          border: "1px solid #DBDBDB",
        }}
      />

      {/* Worldwide + type + share */}
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
          <span style={{ marginLeft: "20px" }}>{filters.typeOfLibrary}</span>
        </div>

        <img
          src="/img/menuLateral/Share.png"
          alt="Share"
          style={{
            width: "14px",
            height: "15px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* 🔽 LÍNIA SEPARADORA (worldwide → title) */}
      <div
        style={{
          position: "absolute",
          top: "110px",
          left: "33px",
          right: "33px",
          border: "1px solid #DBDBDB",
        }}
      />

      {/* Títol */}
      <div
        style={{
          position: "absolute",
          top: "130px",
          left: "33px",
          width: "240px",
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
          right: "33px",
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
