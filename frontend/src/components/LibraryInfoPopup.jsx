import React, { useMemo } from "react";
import { Marker, Popup } from "react-map-gl/mapbox";

const STATUS_COLORS = {
  Connected: "#3ED896",
  NotConnected: "#F82055",
  Unknown: "#20BBCE",
};

export default function LibraryInfoPopup({
  feature,
  onClose,
  pinSrc = "/img/GreenPin.png",
}) {
  const view = useMemo(() => {
    if (!feature) return null;

    const [lon, lat] = feature.geometry?.coordinates || [];
    const props = feature.properties || {};

    const name =
      props.name ||
      props["Library name"] ||
      props["library_name"] ||
      "Library";

    const coordText =
      Number.isFinite(lat) && Number.isFinite(lon)
        ? `(${lat.toFixed(6)}, ${lon.toFixed(6)})`
        : "not known";

    const status = getStatus(props);
    const statusColor = STATUS_COLORS[status];

    const downloadLabel = getDownloadCategory(props);

    return {
      lon,
      lat,
      name,
      coordText,
      status,
      statusColor,
      downloadLabel,
    };
  }, [feature]);

  if (!view) return null;

  const { lon, lat, name, coordText, status, statusColor, downloadLabel } = view;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;

  return (
    <>
      <Marker longitude={lon} latitude={lat} anchor="bottom">
        <img
          src={pinSrc}
          alt=""
          style={{
            width: "28px",
            height: "28px",
            transform: "translateY(-6px)",
            cursor: "pointer",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </Marker>

      <Popup
        longitude={lon}
        latitude={lat}
        anchor="left"
        closeButton={false}
        closeOnClick={false}
        offset={[14, -10]}
        onClose={onClose}
      >
        <div style={{ minWidth: "260px", padding: "10px 12px" }}>
          {/* NAME */}
          <div
            style={{
              font: "normal normal bold 15px/16px Noto Sans",
              color: "#000000",
              marginBottom: "12px",
            }}
          >
            {name}
          </div>

          <div
            style={{
              font: "normal normal normal 12px/16px Noto Sans",
              color: "#4B4B4B",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <IconRow
              icon="/img/menuLateral/Icon core-location-pin.png"
              value={coordText}
            />

            <IconRow
              icon="/img/menuLateral/Icon akar-wifi (1).png"
              value={status}
              valueStyle={{ color: statusColor, fontWeight: 700 }}
            />

            <IconRow
              icon="/img/menuLateral/Icon core-cloud-download.png"
              value={downloadLabel}
            />
          </div>
        </div>
      </Popup>
    </>
  );
}

function IconRow({ icon, value, valueStyle }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* ICON BOX */}
      <div
        style={{
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={icon}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* TEXT */}
      <span
        style={{
          lineHeight: "16px",
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  );
}


function getStatus(props) {
  const v = String(
    props?.["Does the library currently have Internet access?"] ?? ""
  )
    .trim()
    .toLowerCase();

  if (v === "yes") return "Connected";
  if (v === "no") return "NotConnected";
  return "Unknown";
}

function getDownloadCategory(props) {
  const v = String(
    props?.[
      "What is the average Internet/download speed available at the library?"
    ] ?? ""
  )
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .trim();

  if (v.includes("less than 1")) return "Less than 1 Mbps";
  if (v.includes("1-5")) return "Between 1-5 Mbps";
  if (v.includes("5-20")) return "Between 5-20 Mbps";
  if (v.includes("20-40")) return "Between 20-40 Mbps";
  if (v.includes("40-100")) return "Between 40-100 Mbps";
  if (v.includes("more than 100")) return "More than 100 Mbps";

  return "not known";
}
