import React, { useMemo } from "react";
import LibrarySectionCard from "./LibrarySectionCard";

export default function LibraryDetailsPanel({ library, mode = "library_status" }) {
  const p = library?.properties || {};

  /* =====================
   * Helpers
   * ===================== */
  const getStr = (key) => String(p?.[key] ?? "").trim();

  const hasValue = (key) => {
    const v = p?.[key];
    return v !== null && v !== undefined && String(v).trim() !== "";
  };

  const firstWordFromColumnName = (colName) =>
    String(colName || "")
      .split(":")[0]
      .trim()
      .split(/\s+/)[0];

  const beforeColon = (colName) => String(colName || "").split(":")[0].trim();

  /* =====================
   * NAME
   * ===================== */
  const name =
    String(
      p?.name ??
        p?.Name ??
        p?.["Library name"] ??
        p?.["Library Name"] ??
        p?.["Name of library"] ??
        ""
    ).trim() || "Unknown library";

  /* =====================
   * TYPE (CSV)
   * ===================== */
  const TYPE_KEY = "Select the library type";
  const OTHER_TYPE_KEY = "Other (specify):Select the library type";

  const rawType = getStr(TYPE_KEY);
  const isOtherType = rawType.toLowerCase() === "other (specify)";

  let type = rawType;
  if (isOtherType) {
    const otherRaw = getStr(OTHER_TYPE_KEY);
    type = otherRaw || "OTHER";
  }
  if (!type) type = "PUBLIC LIBRARY";

  /* =========================================================
   * ✅ NOT CONNECT MODE: només nom + tipus i ja està
   * ========================================================= */
  if (mode === "not_connect") {
    return (
      <div style={{ width: "100%" }}>
        {/* NAME */}
        <div
          style={{
            font: "normal normal bold 20px/24px Noto Sans",
            color: "#000000",
            whiteSpace: "pre-line",
          }}
        >
          {name}
        </div>

        {/* TYPE */}
        <div
          style={{
            marginTop: "0.4rem",
            font: "normal normal 600 12px/16px Noto Sans",
            color: "#0F6641",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {type}
        </div>
      </div>
    );
  }

  /* =========================================================
   * TYPE OF CONNECTION (for type_connect mode)
   * ========================================================= */
  const CONNECTION_COL = "What type of internet connection does your library have?";
  const SEPARATE_NETWORKS_COL = "Is there a separate network access for users and library staff?";

  const splitMulti = (raw) =>
    String(raw ?? "")
      .split(/[,;/|]+/g)
      .map((s) => s.trim())
      .filter(Boolean);

  const bucketConnectionType = (token) => {
    const t = String(token ?? "").toLowerCase().trim();
    if (!t) return "unknown";

    if (t.includes("optic") || t.includes("fiber") || t.includes("fibre")) return "optic_fiber";
    if (t.includes("dsl") || t.includes("adsl") || t.includes("vdsl")) return "dsl";
    if (t.includes("satellite") || t.includes("sat")) return "satellite";
    if (t.includes("cable") || t.includes("coax")) return "cable";

    if (
      t.includes("mobile") ||
      t.includes("cell") ||
      t.includes("3g") ||
      t.includes("4g") ||
      t.includes("5g") ||
      t.includes("lte")
    ) {
      return "mobile_data";
    }

    if (t.includes("other")) return "other";
    if (t === "unknown" || t === "n/a" || t === "na" || t === "none") return "unknown";

    return "other";
  };

  const CONNECTION_META = {
    optic_fiber: { label: "Fiber optic", color: "#FF2AAE" },
    dsl: { label: "DSL", color: "#FF8A00" },
    satellite: { label: "Satellite", color: "#5CFF7A" },
    cable: { label: "Cable", color: "#D5E600" },
    mobile_data: { label: "Mobile data", color: "#1E5BFF" },
    other: { label: "Other", color: "#7A1FFF" },
    unknown: { label: "Unknown", color: "#27C7D8" },
  };

  const CONNECTION_PRIORITY = [
    "optic_fiber",
    "cable",
    "dsl",
    "mobile_data",
    "satellite",
    "other",
    "unknown",
  ];

  const primaryConnectionBucketFromProps = (props) => {
    if (props?.__connBucket) return String(props.__connBucket);

    const rawConn = props?.[CONNECTION_COL];
    const tokens = splitMulti(rawConn);
    if (!tokens.length) return "unknown";

    const buckets = Array.from(new Set(tokens.map(bucketConnectionType)));
    for (const prio of CONNECTION_PRIORITY) {
      if (buckets.includes(prio)) return prio;
    }
    return buckets[0] || "unknown";
  };

  const connectionBucket = useMemo(() => primaryConnectionBucketFromProps(p), [p]);
  const connectionMeta = CONNECTION_META[connectionBucket] || CONNECTION_META.unknown;

  const separateNetworksValue = useMemo(() => {
    const v = getStr(SEPARATE_NETWORKS_COL);
    if (!v) return "N/A";
    const low = v.toLowerCase();
    if (low === "yes" || low === "y") return "Yes";
    if (low === "no" || low === "n") return "No";
    return v;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const Dot = ({ color }) => (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
        marginRight: 8,
      }}
    />
  );

  const InfoIcon = ({ text }) => (
    <img
      src="/img/menuLateral/Information.png"
      alt="info"
      title={text}
      style={{
        width: "0.69rem",
        height: "0.69rem",
        marginLeft: "0.375rem",
        cursor: "default",
        flexShrink: 0,
        opacity: 0.85,
      }}
    />
  );

  const LabelWithInfo = ({ label, infoText }) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.375rem",
        maxWidth: "14rem",
      }}
    >
      <div
        style={{
          font: "normal normal 700 14px/16px Noto Sans",
          color: "#4B4B4B",
          lineHeight: "16px",
          whiteSpace: "pre-line",
        }}
      >
        {label}
      </div>
      {infoText ? <InfoIcon text={infoText} /> : null}
    </div>
  );

  const InlineRow = ({ label, value, dotColor, infoText }) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.7rem 0",
      }}
    >
      <LabelWithInfo label={label} infoText={infoText} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0,
          minWidth: 0,
          flex: 1,
        }}
      >
        {dotColor ? <Dot color={dotColor} /> : null}

        <div
          style={{
            font: "normal normal normal 14px/16px Noto Sans",
            color: "#4B4B4B",
            textAlign: "right",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            minWidth: 0,
          }}
        >
          {String(value ?? "").trim() || "N/A"}
        </div>
      </div>
    </div>
  );

  /* =====================
   * BASIC INFORMATION
   * ===================== */
  const STAFF_KEY = "How many staff members work at your library (full-time equivalent)?";
  const staffValue = hasValue(STAFF_KEY) ? String(p[STAFF_KEY]) : "N/A";

  const MAIN_TARGET_COLUMNS = [
    "Children (0-12 years):Select multiple options to specify the approximate target audience of your library",
    "Teenagers (13-17 years):Select multiple options to specify the approximate target audience of your library",
    "Adults (18-60 years):Select multiple options to specify the approximate target audience of your library",
    "Seniors (65+ years):Select multiple options to specify the approximate target audience of your library",
    "Students:Select multiple options to specify the approximate target audience of your library",
    "Entrepreneurs:Select multiple options to specify the approximate target audience of your library",
    "Educators / Teachers:Select multiple options to specify the approximate target audience of your library",
    "Researchers / Academics:Select multiple options to specify the approximate target audience of your library",
  ];

  const mainTargetValue = useMemo(() => {
    const targets = [];
    MAIN_TARGET_COLUMNS.forEach((col) => {
      if (hasValue(col)) targets.push(firstWordFromColumnName(col));
    });
    return targets.length ? targets.join(", ") : "N/A";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const rowsBasic = [
    { label: "Staff members", value: staffValue },
    { label: "Main target", value: mainTargetValue },
  ];

  /* =====================
   * INTERNET ACCESS
   * ===================== */
  const AVAIL_KEY = "How many hours per day is the Internet available to users?";
  const availabilityValue = useMemo(() => {
    const v = getStr(AVAIL_KEY);
    if (!v) return "N/A";
    const low = v.toLowerCase();
    if (low.includes("all day") && low.includes("all times")) return "All day";
    return v;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const DEV_AVAIL_KEY =
    "How many computers or devices with Internet access are available for users in your library?";
  const DEV_AVAIL_MORE_KEY =
    "More than 20 (specify):How many computers or devices with Internet access are available for users in your library?";

  const devicesAvailableValue = useMemo(() => {
    const v = getStr(DEV_AVAIL_KEY);
    if (!v) return "N/A";
    if (v === "More than 20 (specify)") {
      const spec = getStr(DEV_AVAIL_MORE_KEY);
      return spec || "More than 20";
    }
    return v;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const DEV_USED_COLUMNS = [
    "Desktop computers:What devices are primarily used to access the Internet?",
    "Laptops:What devices are primarily used to access the Internet?",
    "Smartphones:What devices are primarily used to access the Internet?",
    "Tablets:What devices are primarily used to access the Internet?",
    "Other:What devices are primarily used to access the Internet?",
  ];

  const devicesUsedValue = useMemo(() => {
    const devices = [];
    DEV_USED_COLUMNS.forEach((col) => {
      if (!hasValue(col)) return;

      const label = beforeColon(col);
      if (label.toLowerCase() === "other") {
        const otherText = getStr(col);
        if (otherText) devices.push(otherText);
      } else {
        devices.push(label);
      }
    });

    return devices.length ? devices.join(", ") : "N/A";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const USERS_KEY =
    "Please provide an approximate number for the amount of users that access the library Internet on a daily basis.";
  const usersValue = hasValue(USERS_KEY) ? String(p[USERS_KEY]) : "N/A";

  const rowsInternet = [
    { label: "Availability", value: availabilityValue },
    { label: "Devices available", value: devicesAvailableValue },
    { label: "Devices used", value: devicesUsedValue },
    { label: "Users", value: usersValue },
  ];

  /* =====================
   * DIGITAL RESOURCES
   * ===================== */
  const DIGITAL_TYPE_COLUMNS = [
    "Educational websites:What types of digital resources are used at the library?",
    "Online journals:What types of digital resources are used at the library?",
    "Online courses:What types of digital resources are used at the library?",
    "E-books:What types of digital resources are used at the library?",
    "Educational videos:What types of digital resources are used at the library?",
    "Interactive software:What types of digital resources are used at the library?",
    "Other (specify):What types of digital resources are used at the library?",
  ];

  const digitalTypesValue = useMemo(() => {
    const types = [];
    DIGITAL_TYPE_COLUMNS.forEach((col) => {
      if (!hasValue(col)) return;

      const label = beforeColon(col);
      if (label.toLowerCase().includes("other")) {
        const otherText = getStr(col);
        if (otherText) types.push(otherText);
      } else {
        types.push(label);
      }
    });

    return types.length ? types.join(", ") : "N/A";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const DIGITAL_AVAILABLE_KEY =
    "Provide an approximate estimate of the number digital resources that are available in your collection";

  const digitalAvailableValue = hasValue(DIGITAL_AVAILABLE_KEY)
    ? String(p[DIGITAL_AVAILABLE_KEY])
    : "N/A";

  const REMOTE_ACCESS_KEY =
    "Are your digital resources accessible remotely? (outside of library premises)";

  const remoteAccessValue = useMemo(() => getStr(REMOTE_ACCESS_KEY) || "N/A", [p]);

  const rowsDigital = [
    { label: "Type", value: digitalTypesValue },
    { label: "Digital resources available", value: digitalAvailableValue },
    { label: "Remote access", value: remoteAccessValue },
  ];

  const rowsCapabilities = [];

  /* =====================
   * RENDER
   * ===================== */
  const isTypeConnectionMode = mode === "type_connect";

  return (
    <div style={{ width: "100%" }}>
      {/* NAME */}
      <div
        style={{
          font: "normal normal bold 20px/24px Noto Sans",
          color: "#000000",
          whiteSpace: "pre-line",
        }}
      >
        {name}
      </div>

      {/* TYPE */}
      <div
        style={{
          marginTop: "0.4rem",
          font: "normal normal 600 12px/16px Noto Sans",
          color: "#0F6641",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {type}
      </div>

      {/* DIVIDER */}
      <div style={{ borderTop: "1px solid #DBDBDB", marginTop: "0.9rem" }} />

      {/* ✅ TYPE OF CONNECTION MODE */}
      {isTypeConnectionMode ? (
        <div style={{ marginTop: "0.8rem" }}>
          <InlineRow
            label={"Type of internet\nconnection"}
            value={connectionMeta.label}
            dotColor={connectionMeta.color}
            infoText="What kind of internet access the library uses (main connection)."
          />

          <InlineRow
            label={"Separate networks\nfor users and library"}
            value={separateNetworksValue}
            infoText="Whether users and staff have separate network access."
          />
        </div>
      ) : (
        /* ✅ DEFAULT MODE (library_status, etc.) */
        <div style={{ marginTop: "0.25rem" }}>
          <LibrarySectionCard title="Basic information" rows={rowsBasic} defaultOpen />
          <LibrarySectionCard title="Internet access" rows={rowsInternet} defaultOpen={false} />
          <LibrarySectionCard title="Digital resources" rows={rowsDigital} defaultOpen={false} />
          <LibrarySectionCard
            title="Library capabilities"
            rows={rowsCapabilities}
            defaultOpen={false}
          />
        </div>
      )}
    </div>
  );
}