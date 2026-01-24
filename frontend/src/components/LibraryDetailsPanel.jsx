import React, { useMemo } from "react";
import LibrarySectionCard from "./LibrarySectionCard";

export default function LibraryDetailsPanel({ library }) {
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
  const isOtherType = rawType.toLowerCase() === "other";

  let type = rawType;
  if (isOtherType) {
    const otherRaw = getStr(OTHER_TYPE_KEY);
    type = otherRaw || "OTHER";
  }
  if (!type) type = "PUBLIC LIBRARY";

  /* =====================
   * BASIC INFORMATION
   * ===================== */
  const STAFF_KEY =
    "How many staff members work at your library (full-time equivalent)?";

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

    // ✅ cas exactament "More than 20 (specify)"
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

  // 1) Type (multi-column like devices used)
  const DIGITAL_TYPE_COLUMNS = [
    "Educational websites:What types of digital resources are used at the library?",
    "Online journals:What types of digital resources are used at the library?",
    "Online courses:What types of digital resources are used at the library?",
    "E-books:What types of digital resources are used at the library?",
    "Educational videos:What types of digital resources are used at the library?",
    "Interactive software:What types of digital resources are used at the library?",
    // 👇 other specify (quan omplen amb text: "Audio books", etc.)
    "Other (specify):What types of digital resources are used at the library?",
  ];

  const digitalTypesValue = useMemo(() => {
    const types = [];

    DIGITAL_TYPE_COLUMNS.forEach((col) => {
      if (!hasValue(col)) return;

      const label = beforeColon(col);

      if (label.toLowerCase().includes("other")) {
        // per Other (specify): agafem el valor escrit (ex: Audio books)
        const otherText = getStr(col);
        if (otherText) types.push(otherText);
      } else {
        // normal: agafem el label abans dels :
        types.push(label);
      }
    });

    return types.length ? types.join(", ") : "N/A";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  // 2) Digital resources available (nombre aproximat)
  const DIGITAL_AVAILABLE_KEY =
    "Provide an approximate estimate of the number digital resources that are available in your collection";

  const digitalAvailableValue = hasValue(DIGITAL_AVAILABLE_KEY)
    ? String(p[DIGITAL_AVAILABLE_KEY])
    : "N/A";

  // 3) Remote access
  const REMOTE_ACCESS_KEY =
    "Are your digital resources accessible remotely? (outside of library premises)";

  const remoteAccessValue = useMemo(() => {
    const v = getStr(REMOTE_ACCESS_KEY);
    return v || "N/A";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const rowsDigital = [
    { label: "Type", value: digitalTypesValue },
    { label: "Digital resources available", value: digitalAvailableValue },
    { label: "Remote access", value: remoteAccessValue },
  ];

  /* =====================
   * CAPABILITIES (placeholder ara)
   * ===================== */
  const rowsCapabilities = [];

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

      {/* SECTIONS */}
      <div style={{ marginTop: "0.25rem" }}>
        <LibrarySectionCard title="Basic information" rows={rowsBasic} defaultOpen />
        <LibrarySectionCard title="Internet access" rows={rowsInternet} defaultOpen={false} />
        <LibrarySectionCard title="Digital resources" rows={rowsDigital} defaultOpen={false} />
        <LibrarySectionCard title="Library capabilities" rows={rowsCapabilities} defaultOpen={false} />
      </div>
    </div>
  );
}