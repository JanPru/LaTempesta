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

  // ✅ type of internet connection
  connection: {
    "Fiber optic": "#FF2AAE",
    DSL: "#FF8A00",
    Satellite: "#5CFF7A",
    Cable: "#D5E600",
    "Mobile data (3G, 4G, 5G)": "#1E5BFF",
    Other: "#7A1FFF",
    Unknown: "#27C7D8",
  },

  // ✅ not-connection reasons (colors from screenshot)
  notConnect: {
    infrastructure: "#36A6D8",
    high_cost: "#FF6C00",
    electrical: "#0EAD27",
    digital_literacy: "#B3BE39",
    policy: "#9E65AC",
    multi: "#D83A8F",
  },
};

function Dot({ color }) {
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

function Row({ label, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {icon}
      <span
        style={{
          textAlign: "left",
          font: "normal normal normal 14px/25px Noto Sans",
          letterSpacing: "0px",
          color: "#000000",
          opacity: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function MapLegend({ mode = "library_status" }) {
  const isTypeConnection = mode === "type_connect";

  const isNotConnect =
    mode === "not_connect" || mode === "not_connected" || mode === "notconnect";

  if (isNotConnect) {
    return (
      <div
        style={{
          position: "absolute",
          right: "18px",
          bottom: "18px",
          zIndex: 20,
          background: "#FFFFFF",
          borderRadius: 0,
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          padding: "12px 14px",
          fontFamily: "Noto Sans, sans-serif",
          userSelect: "none",
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "left",
            font: "normal normal bold 14px/25px Noto Sans",
            letterSpacing: "0px",
            color: "#000000",
            opacity: 1,
            marginBottom: "6px",
          }}
        >
          Not-connection reason
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "22px",
            rowGap: "20px",
            alignItems: "start",
            minWidth: "360px",
          }}
        >
          <Row
            label="Infrastructure limitations"
            icon={<Dot color={COLORS.notConnect.infrastructure} />}
          />
          <Row
            label="Digital literacy gaps"
            icon={<Dot color={COLORS.notConnect.digital_literacy} />}
          />

          <Row
            label="High cost"
            icon={<Dot color={COLORS.notConnect.high_cost} />}
          />
          <Row
            label="Policy/Regulatory barriers"
            icon={<Dot color={COLORS.notConnect.policy} />}
          />

          <Row
            label="Electrical supply issues"
            icon={<Dot color={COLORS.notConnect.electrical} />}
          />
          <Row
            label="More than one reason"
            icon={<Dot color={COLORS.notConnect.multi} />}
          />
        </div>
      </div>
    );
  }

  // ✅ Type of connection legend (la captura)
  if (isTypeConnection) {
    return (
      <div
        style={{
          position: "absolute",
          right: "18px",
          bottom: "18px",
          zIndex: 20,
          background: "#FFFFFF",
          borderRadius: 0,
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          padding: "12px 14px",
          fontFamily: "Noto Sans, sans-serif",
          userSelect: "none",
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "left",
            font: "normal normal bold 14px/25px Noto Sans",
            letterSpacing: "0px",
            color: "#000000",
            opacity: 1,
            marginBottom: "6px",
          }}
        >
          Type of internet connection
        </div>

        {/* Two columns like screenshot */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "18px",
            rowGap: "6px",
            alignItems: "start",
            minWidth: "340px",
          }}
        >
          <Row label="Fiber optic" icon={<Dot color={COLORS.connection["Fiber optic"]} />} />
          <Row
            label="Mobile data (3G, 4G, 5G)"
            icon={<Dot color={COLORS.connection["Mobile data (3G, 4G, 5G)"]} />}
          />

          <Row label="DSL" icon={<Dot color={COLORS.connection.DSL} />} />
          <Row label="Other" icon={<Dot color={COLORS.connection.Other} />} />

          <Row label="Satellite" icon={<Dot color={COLORS.connection.Satellite} />} />
          <Row label="Unknown" icon={<Dot color={COLORS.connection.Unknown} />} />

          <Row label="Cable" icon={<Dot color={COLORS.connection.Cable} />} />
        </div>
      </div>
    );
  }

  // ✅ Default legend (status + download)
  return (
    <div
      style={{
        position: "absolute",
        right: "18px",
        bottom: "18px",
        zIndex: 20,

        background: "#FFFFFF",
        borderRadius: 0,
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
            <Row label="Connected" icon={<Dot color={COLORS.status.Connected} />} />
            <Row label="Not connected" icon={<Dot color={COLORS.status["Not connected"]} />} />
            <Row label="Unknown" icon={<Dot color={COLORS.status.Unknown} />} />
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
            <Row label="Good" icon={<DownloadDot haloColor={COLORS.download.Good} />} />
            <Row label="Moderate" icon={<DownloadDot haloColor={COLORS.download.Moderate} />} />
            <Row label="Bad" icon={<DownloadDot haloColor={COLORS.download.Bad} />} />
            <Row label="Unknown" icon={<DownloadDot haloColor={COLORS.download.Unknown} />} />
          </div>
        </div>
      </div>
    </div>
  );
}