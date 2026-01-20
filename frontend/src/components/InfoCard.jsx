import React, { useState } from "react";

/*
 * InfoCard
 * - Grey tooltip on hover for info icon
 * - Tooltip: taller + narrower
 * - Text wraps correctly (never overflows)
 */
export default function InfoCard({
  icon,
  iconWidth,
  iconHeight,
  title,
  subtitle,
  detail,
  hasInfo,
  progressBar,
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        {/* Leading icon */}
        <img
          src={icon}
          alt=""
          style={{
            width: iconWidth,
            height: iconHeight,
            marginTop: "5px",
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          {/* Title + info icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              font: "normal normal bold 20px/25px Noto Sans",
              color: "#4B4B4B",
              marginBottom: "5px",
              whiteSpace: "nowrap",
            }}
          >
            <span>{title}</span>

            {hasInfo && (
              <div
                style={{ position: "relative", flexShrink: 0 }}
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              >
                <img
                  src="/img/menuLateral/Information.png"
                  alt="Info"
                  style={{
                    width: "11px",
                    height: "11px",
                    cursor: "default",
                    display: "block",
                  }}
                />

                {/* TOOLTIP */}
                {showInfo && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translate(-50%, -100%)",

                      background: "#E2E2E2",
                      color: "#4B4B4B",

                      // ✅ més prim, però adaptable
                      width: "170px",
                      maxWidth: "170px",
                      boxSizing: "border-box",

                      // ✅ més alt
                      padding: "12px 10px",
                      font: "normal normal normal 13px/18px Noto Sans",

                      // ✅ CLAU: wrap correcte
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",

                      boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                      zIndex: 50,
                      textAlign: "left",
                    }}
                  >
                    {subtitle}

                    {/* Triangle */}
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid #E2E2E2",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subtitle */}
          <div
            style={{
              textAlign: "left",
              font: "normal normal normal 16px/25px Noto Sans",
              color: "#4B4B4B",
              marginBottom: "3px",
            }}
          >
            {subtitle}
          </div>

          {/* Detail */}
          <div
            style={{
              textAlign: "left",
              font: "normal normal normal 16px/25px Noto Sans",
              color: "#939393",
            }}
          >
            {detail}
          </div>

          {/* Progress bar */}
          {progressBar && (
            <div
              style={{
                width: "100%",
                height: "8px",
                background: "#E0E0E0",
                borderRadius: "4px",
                overflow: "hidden",
                marginTop: "10px",
                display: "flex",
              }}
            >
              {progressBar.colors.map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${progressBar.widths[idx]}%`,
                    height: "100%",
                    background: color,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
