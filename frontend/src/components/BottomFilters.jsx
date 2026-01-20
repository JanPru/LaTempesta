import React, { useState } from "react";

/*
 * BottomFilters - Resize Proof
 * - Info icon shows a grey tooltip on hover (like screenshot)
 * - Tooltip is wider & less tall
 * - Pointer is a real triangle (not a rotated square)
 */
export default function BottomFilters({ isLoading }) {
  const [hoverInfoIdx, setHoverInfoIdx] = useState(null);

  const filters = [
    {
      icon: "/img/menuLateral/Icon akar-wifi (1).png",
      label: "Library status",
      active: true,
      iconStyle: { width: "1.5rem", height: "1.06rem" },
      infoText: "Library status of the library",
    },
    {
      icon: "/img/menuLateral/Grupo 9.png",
      label: "Type of\nconnect.",
      active: false,
      iconStyle: { width: "1.25rem", height: "1.06rem" },
      infoText: "Type of internet connection of the library",
    },
    {
      icon: "/img/menuLateral/Icon akar-triangle-alert.png",
      label: "Not\nconnect.",
      active: false,
      iconStyle: { width: "1.25rem", height: "1.06rem" },
      infoText: "Library reported as not connected",
    },
    {
      icon: "/img/menuLateral/Icon akar-star.png",
      label: "Perceived\nquality",
      active: false,
      iconStyle: { width: "1.25rem", height: "1.06rem" },
      infoText: "Perceived quality of the library connection",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "1.3%",
        left: "0",
        right: "0",
        display: "flex",
        justifyContent: "center",
        gap: "0.5rem",
        flexWrap: "wrap",
        padding: "0 4.17%",
      }}
    >
      {isLoading ? (
        <div
          style={{
            textAlign: "center",
            font: "normal normal normal 0.8125rem/1rem Noto Sans",
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
              width: "4.375rem",
              height: "4.375rem",
              background: filter.active ? "#0F6641" : "#E2E2E2",
              borderRadius: "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "background 0.2s",
              padding: "0.5rem",
              boxSizing: "border-box",
              position: "relative",
              overflow: "visible",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = filter.active ? "#0C5737" : "#D0D0D0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = filter.active ? "#0F6641" : "#E2E2E2";
            }}
          >
            {/* Top row */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <img
                src={filter.icon}
                alt={filter.label}
                style={{
                  ...filter.iconStyle,
                  flexShrink: 0,
                  filter: filter.active ? "invert(1)" : "none",
                }}
              />

              {/* INFO ICON + TOOLTIP */}
              <div
                style={{
                  position: "relative",
                  width: "0.69rem",
                  height: "0.69rem",
                  flexShrink: 0,
                }}
                onMouseEnter={() => setHoverInfoIdx(idx)}
                onMouseLeave={() => setHoverInfoIdx(null)}
              >
                <img
                  src="/img/menuLateral/Information.png"
                  alt="Info"
                  style={{
                    width: "0.69rem",
                    height: "0.69rem",
                    opacity: filter.active ? 0.9 : 0.7,
                    filter: filter.active ? "invert(1)" : "none",
                    display: "block",
                  }}
                />

                {hoverInfoIdx === idx && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "145%",
                      left: "50%",
                      transform: "translateX(-50%)",

                      // ✅ estil gris com la imatge
                      background: "#E2E2E2",
                      color: "#4B4B4B",

                      // ✅ més ample i menys alt
                      width: "6.25rem",
                      padding: "0.5rem 0.625rem",
                      font: "normal normal normal 0.8125rem/1rem Noto Sans",

                      // ✅ suau, sense "caixa dura"
                      border: "0",
                      boxShadow: "0 0.125rem 0.625rem rgba(0,0,0,0.12)",

                      zIndex: 50,
                      textAlign: "left",
                    }}
                  >
                    {filter.infoText}

                    {/* ✅ triangle real */}
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",

                        width: 0,
                        height: 0,
                        borderLeft: "0.4375rem solid transparent",
                        borderRight: "0.4375rem solid transparent",
                        borderTop: "0.4375rem solid #E2E2E2",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Label below */}
            <div
              style={{
                textAlign: "left",
                font: "normal normal normal 0.8125rem/1rem Noto Sans",
                color: filter.active ? "#FFFFFF" : "#4B4B4B",
                whiteSpace: "pre-line",
                lineHeight: "1rem",
                marginTop: "0.375rem",
              }}
            >
              {filter.label}
            </div>
          </div>
        ))
      )}
    </div>
  );
}