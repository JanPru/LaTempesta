import React from "react";

/*
 * InfoCard is used within the side menu to summarise a particular
 * statistic about the library dataset.  Each card accepts an icon,
 * title, subtitle, detail text and optionally displays an info
 * indicator and a segmented progress bar.  Icons must be passed in
 * via props so the parent component can decide which asset to use.
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
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        {/* Leading icon */}
        <img
          src={icon}
          alt=""
          style={{ width: iconWidth, height: iconHeight, marginTop: "5px" }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              textAlign: "left",
              font: "normal normal bold 20px/25px Noto Sans",
              color: "#4B4B4B",
              marginBottom: "5px",
            }}
          >
            {title}
            {hasInfo && (
              <img
                src="/img/menuLateral/Icon ion-ios-information-circle.png"
                alt="Info"
                style={{ width: "11px", height: "11px", marginLeft: "8px" }}
              />
            )}
          </div>
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
          <div
            style={{
              textAlign: "left",
              font: "normal normal normal 16px/25px Noto Sans",
              color: "#939393",
            }}
          >
            {detail}
          </div>
          {/* Optional progress bar with multiple colours */}
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
