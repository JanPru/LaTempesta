import React from "react";

const COLORS = {
  status: {
    Connected: "#3ED896",
    "Not connected": "#F82055",
    Unknown: "#20BBCE",
  },
  download: {
    Good: "#3ED896",
    Moderate: "#FDB900",
    Bad: "#F82055",
    Unknown: "#20BBCE",
  },
};

function StatusDot({ color }) {
  return (
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

/**
 * Punt verd + halo de color (com els del mapa)
 */
function DownloadDot({ haloColor }) {
  return (
    <span
      style={{
        position: "relative",
        width: 14,
        height: 14,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* HALO */}
      <span
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: haloColor,
          opacity: 0.5,
        }}
      />

      {/* PUNT CENTRAL (sempre verd) */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: COLORS.status.Connected,
          zIndex: 1,
        }}
      />
    </span>
  );
}

export default function MapLegend() {
  return (
    <div
      style={{
        position: "absolute",
        right: "18px",
        bottom: "18px",
        zIndex: 20,

        background: "#FFFFFF",
        borderRadius: 0, // rectangular
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        padding: "12px 14px",

        fontFamily: "Noto Sans, sans-serif",
        color: "#4B4B4B",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
          alignItems: "start",
          minWidth: "320px",
        }}
      >
        {/* LEFT: status */}
        <div>
          <div
            style={{
              font: "normal normal bold 13px/16px Noto Sans",
              color: "#000000",
              marginBottom: "8px",
            }}
          >
            Library status
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Row
              label="Connected"
              icon={<StatusDot color={COLORS.status.Connected} />}
            />
            <Row
              label="Not connected"
              icon={<StatusDot color={COLORS.status["Not connected"]} />}
            />
            <Row
              label="Unknown"
              icon={<StatusDot color={COLORS.status.Unknown} />}
            />
          </div>
        </div>

        {/* RIGHT: download */}
        <div>
          <div
            style={{
              font: "normal normal bold 13px/16px Noto Sans",
              color: "#000000",
              marginBottom: "2px",
            }}
          >
            Average download speed
          </div>

          <div
            style={{
              font: "normal normal normal 11px/14px Noto Sans",
              color: "#7A7A7A",
              marginBottom: "8px",
              textDecoration: "underline",
            }}
          >
            Global benchmark 20Mbps
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Row
              label="Good"
              icon={<DownloadDot haloColor={COLORS.download.Good} />}
            />
            <Row
              label="Moderate"
              icon={<DownloadDot haloColor={COLORS.download.Moderate} />}
            />
            <Row
              label="Bad"
              icon={<DownloadDot haloColor={COLORS.download.Bad} />}
            />
            <Row
              label="Unknown"
              icon={<DownloadDot haloColor={COLORS.download.Unknown} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {icon}
      <span style={{ font: "normal normal normal 12px/16px Noto Sans" }}>
        {label}
      </span>
    </div>
  );
}
