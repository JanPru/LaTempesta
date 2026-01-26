import React, { useMemo, useState } from "react";

/*
 * BottomFilters - Click selectable
 * - Now supports CONTROLLED mode:
 *    - pass activeId + onChange
 * - If activeId is NOT passed, it behaves as before (internal state)
 */
export default function BottomFilters({
  isLoading,
  embedded = false,
  onChange,
  activeId: controlledActiveId, // ✅ NEW (optional)
}) {
  const [hoverInfoIdx, setHoverInfoIdx] = useState(null);

  // ✅ Uncontrolled fallback
  const [localActiveId, setLocalActiveId] = useState("library_status");

  const activeId = controlledActiveId ?? localActiveId; // ✅ source of truth

  const filters = useMemo(
    () => [
      {
        id: "library_status",
        icon: "/img/menuLateral/Icon akar-wifi (1).png",
        label: "Library status",
        iconStyle: { width: "1.5rem", height: "1.06rem" },
        infoText: "Library status of the library",
      },
      {
        id: "type_connect",
        icon: "/img/menuLateral/Grupo 9.png",
        label: "Type of\nconnect.",
        iconStyle: { width: "1.25rem", height: "1.06rem" },
        infoText: "Type of internet connection of the library",
      },
      {
        id: "not_connect",
        icon: "/img/menuLateral/Icon akar-triangle-alert.png",
        label: "Not\nconnect.",
        iconStyle: { width: "1.25rem", height: "1.06rem" },
        infoText: "Library reported as not connected",
      },
      {
        id: "perceived_quality",
        icon: "/img/menuLateral/Icon akar-star.png",
        label: "Perceived\nquality",
        iconStyle: { width: "1.25rem", height: "1.06rem" },
        infoText: "Perceived quality of the library connection",
      },
    ],
    []
  );

  const handleSelect = (id) => {
    // ✅ If uncontrolled, update local
    if (controlledActiveId == null) setLocalActiveId(id);

    // ✅ Always notify parent if provided
    if (typeof onChange === "function") onChange(id);
  };

  return (
    <div
      style={{
        position: embedded ? "relative" : "absolute",
        bottom: embedded ? "auto" : "1.3%",
        left: embedded ? "0" : "0",
        right: embedded ? "0" : "0",

        display: "flex",
        justifyContent: "center",
        gap: "0.5rem",
        flexWrap: "wrap",
        padding: embedded ? "0 0" : "0 4.17%",
        marginTop: embedded ? "1.25rem" : 0,
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
        filters.map((filter, idx) => {
          const isActive = filter.id === activeId;

          return (
            <div
              key={filter.id}
              style={{
                width: "4.375rem",
                height: "4.375rem",
                background: isActive ? "#0F6641" : "#E2E2E2",
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
                userSelect: "none",
              }}
              onClick={() => handleSelect(filter.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isActive ? "#0C5737" : "#D0D0D0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isActive ? "#0F6641" : "#E2E2E2";
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSelect(filter.id);
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
                    filter: isActive ? "invert(1)" : "none",
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="/img/menuLateral/Information.png"
                    alt="Info"
                    style={{
                      width: "0.69rem",
                      height: "0.69rem",
                      opacity: isActive ? 0.9 : 0.7,
                      filter: isActive ? "invert(1)" : "none",
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
                        background: "#E2E2E2",
                        color: "#4B4B4B",
                        width: "5rem",
                        padding: "0.5rem 0.625rem",
                        font: "normal normal normal 0.8125rem/1rem Noto Sans",
                        border: "0",
                        boxShadow: "0 0.125rem 0.625rem rgba(0,0,0,0.12)",
                        zIndex: 50,
                        textAlign: "left",
                      }}
                    >
                      {filter.infoText}

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
                  color: isActive ? "#FFFFFF" : "#4B4B4B",
                  whiteSpace: "pre-line",
                  lineHeight: "1rem",
                  marginTop: "0.375rem",
                }}
              >
                {filter.label}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}