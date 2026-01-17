import React from "react";

/*
 * BottomFilters renders a row of small filter buttons along the bottom of
 * the side menu.  Each item displays an icon and a label.  The first
 * filter (Library Status) is highlighted in green to indicate the
 * default active state, whilst the remaining filters use a neutral
 * grey background.  Hovering a button lightens its background.
 */
export default function BottomFilters({ isLoading }) {
  // Define our filters with the appropriate icons.  See the provided
  // screenshot for the exact file names.  We leave the width/height
  // attributes on each to ensure consistent sizing across the bar.
  const filters = [
    {
      icon: "/img/menuLateral/Grupo 9.png",
      label: "Library Status",
      width: "20px",
      height: "17px",
      active: true,
    },
    {
      icon: "/img/menuLateral/Icon akar-wifi (1).png",
      label: "Type of connect.",
      width: "20px",
      height: "17px",
      active: false,
    },
    {
      icon: "/img/menuLateral/Icon akar-wifi (2).png",
      label: "Not connected",
      width: "20px",
      height: "17px",
      active: false,
    },
    {
      icon: "/img/menuLateral/Icon core-cloud-download.png",
      label: "Download quality",
      width: "20px",
      height: "17px",
      active: false,
    },
    {
      icon: "/img/menuLateral/Icon akar-star.png",
      label: "Perceived quality",
      width: "18px",
      height: "17px",
      active: false,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "0px",
        right: "0px",
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        flexWrap: "wrap",
        padding: "0 15px",
      }}
    >
      {isLoading ? (
        <div
          style={{
            textAlign: "center",
            font: "normal normal normal 14px/16px Noto Sans",
            color: "#4B4B4B",
          }}
        >
          Carregant filtres...
        </div>
      ) : (
        filters.map((filter, idx) => (
          <div
            key={idx}
            style={{
              width: "70px",
              height: "70px",
              background: filter.active ? "#0F6641" : "#E2E2E2",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "background 0.2s",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = filter.active ? "#0C5737" : "#D0D0D0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = filter.active ? "#0F6641" : "#E2E2E2";
            }}
          >
            <img
              src={filter.icon}
              alt={filter.label}
              style={{ width: filter.width, height: filter.height }}
            />
            <div
              style={{
                textAlign: "center",
                font: "normal normal normal 14px/16px Noto Sans",
                color: filter.active ? "#FFFFFF" : "#4B4B4B",
                maxWidth: "57px",
                lineHeight: "16px",
              }}
            >
              {filter.label}
              {filter.label === "Type of connect." && (
                <img
                  src="/img/menuLateral/Icon ion-ios-information-circle.png"
                  alt="Info"
                  style={{ width: "11px", height: "11px", marginLeft: "4px" }}
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
