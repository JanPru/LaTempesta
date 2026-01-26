import React, { useState } from "react";

/*
 * InfoCard - Resize Proof
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
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        {/* Leading icon */}
        <img
          src={icon}
          alt=""
          style={{
            width: iconWidth,
            height: iconHeight,
            marginTop: "0.31rem",
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          {/* Title + info icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              font: "normal normal bold 1.25rem/1.56rem Noto Sans",
              color: "#4B4B4B",
              marginBottom: "0.31rem",
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
                    width: "0.69rem",
                    height: "0.69rem",
                    cursor: "default",
                    display: "block",
                  }}
                />

                {/* TOOLTIP */}
                {showInfo && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.75rem",
                      left: "50%",
                      transform: "translate(-50%, -100%)",

                      background: "#E2E2E2",
                      color: "#4B4B4B",

                      width: "10.625rem",
                      maxWidth: "10.625rem",
                      boxSizing: "border-box",

                      padding: "0.75rem 0.625rem",
                      font: "normal normal normal 0.8125rem/1.125rem Noto Sans",

                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",

                      boxShadow: "0 0.125rem 0.625rem rgba(0,0,0,0.12)",
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
                        borderLeft: "0.375rem solid transparent",
                        borderRight: "0.375rem solid transparent",
                        borderTop: "0.375rem solid #E2E2E2",
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
              font: "normal normal normal 1rem/1.56rem Noto Sans",
              color: "#4B4B4B",
              marginBottom: "0.19rem",
            }}
          >
            {subtitle}
          </div>

          {/* Detail */}
          <div
            style={{
              textAlign: "left",
              font: "normal normal normal 1rem/1.56rem Noto Sans",
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
                height: "0.5rem",
                background: "#E0E0E0",
                borderRadius: "0.25rem",
                overflow: "hidden",
                marginTop: "0.625rem",
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