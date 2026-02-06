import React, { useMemo, useState } from "react";
import LibrarySectionCard from "./LibrarySectionCard";

/* =====================
 * Shared InfoIconWithTooltip component
 * ===================== */
function InfoIconWithTooltip({ text }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center", flexShrink: 0 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img
        src="/img/menuLateral/Information.png"
        alt="info"
        style={{
          width: "0.69rem",
          height: "0.69rem",
          cursor: "default",
          opacity: 0.85,
        }}
      />

      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "0.5rem",
            background: "#E2E2E2",
            color: "#4B4B4B",
            padding: "0.5rem 0.625rem",
            font: "normal normal normal 0.75rem/1rem Noto Sans",
            whiteSpace: "normal",
            width: "10rem",
            maxWidth: "10rem",
            boxSizing: "border-box",
            boxShadow: "0 0.125rem 0.625rem rgba(0,0,0,0.12)",
            zIndex: 100,
            textAlign: "left",
          }}
        >
          {text}
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
  );
}

/* =====================
 * NOT CONNECT MODE Component
 * ===================== */
const NOT_CONNECT_REASON_COLS = [
  {
    key: "infrastructure",
    label: "Infrastructure limitations",
    col: "Infrastructure limitations:Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
  },
  {
    key: "high_cost",
    label: "High cost",
    col: "High cost:Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
  },
  {
    key: "electrical",
    label: "Electrical supply issues",
    col: "Electrical supply issues:Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
  },
  {
    key: "digital_literacy",
    label: "Digital literacy gaps",
    col: "Digital literacy gaps (library staff lacks basic digital skills so there would be underutilization of connectivity resources):Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
  },
  {
    key: "policy",
    label: "Policy/Regulatory barriers",
    col: "Policy/Regulatory barriers (national regulations limit Internet access):Kindly provide a brief explanation for your previous answer below (multiple answers are possible)",
  },
];

const SERVICES_AFFECTED_COLS = [
  {
    key: "online_databases",
    label: "Access to online databases and research resources",
    col: "Access to online databases and research resources (e.g. academic journals, e-books, online educational materials):Which of the following library services has been mostly affected by the lack of Internet connectivity?",
  },
  {
    key: "digital_literacy",
    label: "Digital literacy programs",
    col: "Digital literacy programs (impossible to implement due to lack of connectivity):Which of the following library services has been mostly affected by the lack of Internet connectivity?",
  },
  {
    key: "job_search",
    label: "Job search and employment services",
    col: "Job search and employment services:Which of the following library services has been mostly affected by the lack of Internet connectivity?",
  },
  {
    key: "virtual_learning",
    label: "Virtual learning and education",
    col: "Virtual learning and education:Which of the following library services has been mostly affected by the lack of Internet connectivity?",
  },
  {
    key: "communication",
    label: "Communication services",
    col: "Communication services (e.g. email, social media, video conferencing platforms):Which of the following library services has been mostly affected by the lack of Internet connectivity?",
  },
  {
    key: "digital_archives",
    label: "Digital archives and local history access",
    col: "Digital archives and local history access:Which of the following library services has been mostly affected by the lack of Internet connectivity?",
  },
  {
    key: "other",
    label: "Other",
    col: "Other:Which of the following library services has been mostly affected by the lack of Internet connectivity?",
  },
];

function NotConnectModeContent({ name, type, DataSourceRow, p }) {
  const [reasonsExpanded, setReasonsExpanded] = useState(false);

  // Obtenir raons de no-connexió
  const nonConnectionReasons = NOT_CONNECT_REASON_COLS.filter(({ col }) => {
    const val = String(p?.[col] ?? "").trim().toLowerCase();
    return val && val !== "" && val !== "0" && val !== "false" && val !== "no" && val !== "n/a";
  }).map(({ label }) => label);

  // Obtenir serveis afectats
  const servicesAffected = SERVICES_AFFECTED_COLS.filter(({ col }) => {
    const val = String(p?.[col] ?? "").trim().toLowerCase();
    return val && val !== "" && val !== "0" && val !== "false" && val !== "no" && val !== "n/a";
  }).map(({ label }) => label);

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

  // Row per Non-connection reason amb desplegable
  const ExpandableReasonRow = ({ label, items, expanded, onToggle, infoText }) => {
    const hasMultiple = items.length > 1;
    // Color #D83A8F per "more than one reason" (mateix que al mapa)
    const dotColor = hasMultiple ? "#D83A8F" : "#C90030";
    const displayValue = hasMultiple ? "More than one reason" : (items[0] || "Unknown");

    return (
      <div style={{ padding: "0.7rem 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          {/* Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              maxWidth: "7rem",
              flexShrink: 0,
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
            {infoText ? <InfoIconWithTooltip text={infoText} /> : null}
          </div>

          {/* Value + toggle - fixe, no canvia */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 0,
              cursor: hasMultiple ? "pointer" : "default",
            }}
            onClick={hasMultiple ? onToggle : undefined}
          >
            <Dot color={dotColor} />
            <div
              style={{
                font: "normal normal normal 14px/16px Noto Sans",
                color: "#4B4B4B",
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              {displayValue}
            </div>
            {hasMultiple && (
              <span
                style={{
                  marginLeft: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "transform 0.2s",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  color: "#0F6641",
                  fontSize: "10px",
                  width: "12px",
                  justifyContent: "center",
                }}
              >
                ▼
              </span>
            )}
          </div>
        </div>

        {/* Expanded list - línia contínua a la dreta sota la fletxa */}
        {hasMultiple && expanded && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "0.25rem",
              paddingRight: "5px",
            }}
          >
            <div
              style={{
                borderRight: "2px solid #0F6641",
                paddingRight: "0.5rem",
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    font: "normal normal normal 13px/18px Noto Sans",
                    color: "#4B4B4B",
                    textAlign: "right",
                    padding: "0.2rem 0",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Row simple per Services most affected (mostra tots directament)
  const ServicesRow = ({ label, items, infoText }) => {
    if (!items.length) return null;
    
    return (
      <div style={{ padding: "0.7rem 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          {/* Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              maxWidth: "7rem",
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
            {infoText ? <InfoIconWithTooltip text={infoText} /> : null}
          </div>

          {/* Values - tots directament */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.25rem",
              minWidth: 0,
              flex: 1,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  font: "normal normal normal 14px/18px Noto Sans",
                  color: "#4B4B4B",
                  textAlign: "right",
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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

      {/* DATA SOURCE */}
      <DataSourceRow />

      {/* DIVIDER */}
      <div style={{ borderTop: "1px solid #DBDBDB", marginTop: "0.9rem" }} />

      {/* NON-CONNECTION REASONS */}
      {nonConnectionReasons.length > 0 && (
        <ExpandableReasonRow
          label={"Non-\nconnection\nreason"}
          items={nonConnectionReasons}
          expanded={reasonsExpanded}
          onToggle={() => setReasonsExpanded(!reasonsExpanded)}
          infoText="Reasons why the library is not connected to the Internet."
        />
      )}

      {/* SERVICES MOST AFFECTED */}
      {servicesAffected.length > 0 && (
        <ServicesRow
          label={"Services most\naffected"}
          items={servicesAffected}
          infoText="Library services that have been mostly affected by the lack of Internet connectivity."
        />
      )}
    </div>
  );
}

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

  /* =====================
   * ✅ DATA SOURCE (year from Date Submitted)
   * ===================== */
  const DATE_SUBMITTED_COL = "Date Submitted";

  const extractYear = (v) => {
    const s = String(v ?? "").trim();
    if (!s) return "";

    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return String(d.getFullYear());

    const m = s.match(/\b(19|20)\d{2}\b/);
    return m ? m[0] : "";
  };

  const submittedYear = extractYear(p?.[DATE_SUBMITTED_COL]) || "Unknown";
  const dataSourceText = `LBM, ${submittedYear}`;

  const DataSourceRow = () => (
    <div
      style={{
        marginTop: "0.35rem",
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
      }}
    >
      <div
        style={{
          textAlign: "left",
          font: "normal normal 600 12px/16px Noto Sans",
          letterSpacing: "0px",
          color: "#717171",
          opacity: 1,
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Data source
        <InfoIconWithTooltip text="Survey data source and submission year." />
      </div>

      <div
        style={{
          textAlign: "left",
          font: "normal normal normal 12px/16px Noto Sans",
          letterSpacing: "0px",
          color: "#717171",
          opacity: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
          flex: 1,
        }}
      >
        {dataSourceText}
      </div>
    </div>
  );

  /* =========================================================
   * ✅ NOT CONNECT MODE: nom + tipus + reasons + services affected
   * ========================================================= */
  if (mode === "not_connect") {
    return (
      <NotConnectModeContent
        name={name}
        type={type}
        DataSourceRow={DataSourceRow}
        p={p}
      />
    );
  }

  /* =========================================================
   * ✅ PERCEIVED QUALITY MODE: nom + tipus + data source + 3 rows
   * ========================================================= */
  if (mode === "perceived_quality") {
    // --- Columns ---
    const PQ_COL =
      "How would you rate the current state of digital infrastructure and devices in your library?\u00A0";

    const IMPACT_COL =
      "How has the unavailability of Internet connectivity affected your library's ability to provide services to users?";

    const STABILITY_COL = "How stable is the Internet connection?";

    // --- Helpers ---
    const norm = (v) => String(v ?? "").trim();
    const toUnknown = (v) => (norm(v) ? norm(v) : "Unknown");

    // --- Perceived quality bucket from numeric 0-100 (same logic as MapPage) ---
    const toNumberOrNull = (v) => {
      if (v == null) return null;
      const s = String(v).trim().replace(",", ".");
      if (!s) return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    };

    const pqBucket = (() => {
      const pre = String(p?.__pqBucket ?? "").trim();
      if (pre) return pre;

      const n = toNumberOrNull(p?.[PQ_COL]);
      if (n == null) return "unknown";

      if (n >= 0 && n <= 19) return "very_poor";
      if (n >= 20 && n <= 49) return "poor";
      if (n >= 50 && n <= 59) return "fair";
      if (n >= 60 && n <= 79) return "good";
      if (n >= 80 && n <= 100) return "excellent";
      return "unknown";
    })();

    const PQ_META = {
      very_poor: { label: "Very poor", color: "#F82055" },
      poor: { label: "Poor", color: "#FF7A00" },
      fair: { label: "Fair", color: "#FFD400" },
      good: { label: "Good", color: "#8BE04E" },
      excellent: { label: "Excellent", color: "#2EAD27" },
      unknown: { label: "Unknown", color: "#20BBCE" },
    };

    const pqMeta = PQ_META[pqBucket] || PQ_META.unknown;

    // --- Values ---
    const impactValue = toUnknown(p?.[IMPACT_COL]);
    const stabilityValue = toUnknown(p?.[STABILITY_COL]);

    // --- UI bits (reuse same pattern as type_connect) ---
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

    const LabelWithInfo = ({ label, infoText }) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
        {infoText ? <InfoIconWithTooltip text={infoText} /> : null}
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
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              minWidth: 0,
            }}
          >
            {String(value ?? "").trim() || "Unknown"}
          </div>
        </div>
      </div>
    );

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

        {/* ✅ DATA SOURCE */}
        <DataSourceRow />

        {/* DIVIDER */}
        <div style={{ borderTop: "1px solid #DBDBDB", marginTop: "0.9rem" }} />

        {/* 3 ROWS like screenshot */}
        <div style={{ marginTop: "0.8rem" }}>
          <InlineRow
            label={"Perceived quality\nof digital\ninfrastructure"}
            value={pqMeta.label}
            dotColor={pqMeta.color}
            infoText="Self-reported quality of digital infrastructure and devices in the library."
          />

          <InlineRow
            label={"Impact of no\ninternet connectivity"}
            value={impactValue}
            infoText="How lack of internet affects the library’s ability to provide services."
          />

          <InlineRow
            label={"Internet connection\nstability"}
            value={stabilityValue}
            infoText="How stable the library’s internet connection is."
          />
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
    dsl: { label: "DSL", color: "#FF7A00" }, // keep your existing if you had different
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

  const LabelWithInfo = ({ label, infoText }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
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
      {infoText ? <InfoIconWithTooltip text={infoText} /> : null}
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
    { label: "Staff members", value: staffValue, infoText: "Number of full-time equivalent staff working at the library." },
    { label: "Main target", value: mainTargetValue, infoText: "Primary audience groups that the library serves." },
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
    { label: "Availability", value: availabilityValue, infoText: "Hours per day that internet is available to users." },
    { label: "Devices available", value: devicesAvailableValue, infoText: "Number of computers/devices with internet access for users." },
    { label: "Devices used", value: devicesUsedValue, infoText: "Types of devices primarily used to access the internet." },
    { label: "Users", value: usersValue, infoText: "Approximate daily users accessing library internet." },
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
    { label: "Type", value: digitalTypesValue, infoText: "Types of digital resources available at the library." },
    { label: "Digital resources available", value: digitalAvailableValue, infoText: "Approximate number of digital resources in the collection." },
    { label: "Remote access", value: remoteAccessValue, infoText: "Whether digital resources can be accessed outside library premises." },
  ];

  /* =====================
   * LIBRARY CAPABILITIES
   * ===================== */
  const STAFF_DIGITAL_TRAINING_KEY =
    "Has the library staff received any wider digital skills/literacy training (other than technical training)?";

  const staffDigitalTrainingValue = useMemo(() => getStr(STAFF_DIGITAL_TRAINING_KEY) || "N/A", [p]);

  const TRAINING_TYPE_COLUMNS = [
    "Basic computer skills (e.g. Microsoft office, email, Internet browsing):What are the types of trainings offered?",
    "Advanced skills (e.g. digitization, data analysis):What are the types of trainings offered?",
    "Online safety and cybersecurity:What are the types of trainings offered?",
    "Use of library resources:What are the types of trainings offered?",
    "Other (specify):What are the types of trainings offered?",
  ];

  const trainingTypesValue = useMemo(() => {
    const types = [];
    TRAINING_TYPE_COLUMNS.forEach((col) => {
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

  const DIGITAL_TRAINING_USERS_KEY =
    "Does your library provide digital skills/digital literacy trainings to library users and community members?";

  const digitalTrainingUsersValue = useMemo(() => getStr(DIGITAL_TRAINING_USERS_KEY) || "N/A", [p]);

  const rowsCapabilities = [
    { label: "Staff digital skills training", value: staffDigitalTrainingValue, infoText: "Whether the library staff has received wider digital skills/literacy training." },
    { label: "Types of digital\ntraining offered", value: trainingTypesValue, infoText: "Types of digital skills trainings offered to staff." },
    { label: "Digital training for users", value: digitalTrainingUsersValue, infoText: "Whether the library provides digital literacy trainings to users and community members." },
  ];

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

      {/* ✅ DATA SOURCE (applies to all modes except not_connect) */}
      <DataSourceRow />

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