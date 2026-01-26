import React, { useMemo, useState } from "react";
import FilterHeader from "./FilterHeader";
import InfoCard from "./InfoCard";
import BottomFilters from "./BottomFilters";
import LibraryDetailsPanel from "./LibraryDetailsPanel";

function formatK(n) {
  const v = Number(n) || 0;
  if (v >= 1000) return { value: Math.round(v / 1000), unit: "k" };
  return { value: v, unit: "" };
}

/* ===========================
   NOT CONNECT: Pie helpers
=========================== */

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function NotConnectedReasonsPie({ counts }) {
  const palette = ["#36A2EB", "#FF7A00", "#2ECC71", "#8E44AD", "#F1C40F", "#16A085"];

  const TITLE_STYLE = {
    textAlign: "left",
    font: "normal normal normal 20px/25px Noto Sans",
    letterSpacing: "0px",
    color: "#4B4B4B",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const items = useMemo(() => {
    const c = counts || {};
    const defs = [
      { key: "infrastructure", label: "Infrastructure limitations" },
      { key: "high_cost", label: "High cost" },
      { key: "electrical", label: "Electrical supply issues" },
      { key: "digital_literacy", label: "Digital literacy gaps" },
      { key: "policy", label: "Policy/Regulatory barriers" },
    ];

    const raw = defs.map((d, i) => ({
      ...d,
      value: Number(c[d.key] || 0),
      color: palette[i % palette.length],
    }));

    const filtered = raw.filter((x) => x.value > 0);
    const total = filtered.reduce((a, b) => a + b.value, 0);

    return {
      total,
      data: filtered.map((x) => ({
        ...x,
        pct: total ? (x.value / total) * 100 : 0,
      })),
    };
  }, [counts]);

  // 🔥 més gran
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 84;

  if (!items.total) {
    return (
      <div style={{ marginTop: "0.75rem" }}>
        <div
          style={{
            font: "normal normal normal 0.95rem/1.4rem Noto Sans",
            color: "#939393",
          }}
        >
          No reasons data detected
        </div>
      </div>
    );
  }

  let angle = 0;

  return (
    <div style={{ marginTop: "0.5rem" }}>
      {/* ✅ Nou títol amb icona */}
      <div style={TITLE_STYLE}>
        <img
          src="/img/menuLateral/Icon akar-triangle-alert.png"
          alt=""
          style={{ width: "1.05rem", height: "1.05rem", flexShrink: 0, marginTop: "-1.5rem",}}
        />
        <span>Reasons for the lack of connection</span>
      </div>

      {/* ✅ Pie centrat i sense llegenda */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "0.85rem" }}>
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    {items.data.map((s) => {
      // ✅ cas 100% (un sol slice) -> amb arc SVG no es pinta, fem circle
      const isFull = s.pct >= 99.999;

      if (isFull) {
        const tx = cx;
        const ty = cy;

        return (
          <g key={s.key}>
            <circle cx={cx} cy={cy} r={r} fill={s.color} />
            <text
              x={tx}
              y={ty}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: "Noto Sans",
                fontSize: "13px",
                fill: "#FFFFFF",
                fontWeight: 600,
              }}
            >
              100%
            </text>
          </g>
        );
      }

      // ✅ cas normal (més d’un slice)
      const start = angle;
      const end = angle + (s.pct / 100) * 360;
      angle = end;

      const mid = (start + end) / 2;
      const tx = polarToCartesian(cx, cy, r * 0.58, mid).x;
      const ty = polarToCartesian(cx, cy, r * 0.58, mid).y;

      const pctText =
        s.pct >= 10
          ? `${Math.round(s.pct)}%`
          : `${(Math.round(s.pct * 10) / 10).toString().replace(".", ",")}%`;

      return (
        <g key={s.key}>
          <path d={describeArc(cx, cy, r, start, end)} fill={s.color} stroke="none" />
          <text
            x={tx}
            y={ty}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontFamily: "Noto Sans",
              fontSize: "13px",
              fill: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            {pctText}
          </text>
        </g>
      );
    })}
  </svg>
</div>
    </div>
  );
}
function NotConnectedOverview({ internetNo, totalPoints }) {
  const fk = formatK(internetNo || 0);
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <img
          src="/img/menuLateral/Icon akar-wifi (1).png"
          alt=""
          style={{
            width: "1.5rem",
            height: "1.06rem",
            marginTop: "0.25rem",
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              font: "normal normal bold 1.25rem/1.56rem Noto Sans",
              color: "#4B4B4B",
              marginBottom: "0.2rem",
              whiteSpace: "nowrap",
            }}
          >
            {fk.value} {fk.unit}
          </div>

          <div
            style={{
              textAlign: "left",
              font: "normal normal normal 20px/25px Noto Sans",
              letterSpacing: "0px",
              color: "#4B4B4B",
              marginTop: "0.25rem",
            }}
          >
            Libraries not connected to the internet
          </div>

          <div
            style={{
              font: "normal normal normal 1rem/1.56rem Noto Sans",
              color: "#939393",
            }}
          >
            {totalPoints ? `of ${formatK(totalPoints).value} ${formatK(totalPoints).unit} libraries mapped` : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   TYPE CONNECT card (igual)
=========================== */

function TypeOfConnectionCard({ counts }) {
  const c = counts || {};

  const data = [
    { key: "optic_fiber", label: "Optic\nfiber", color: "#FF2AAE" },
    { key: "dsl", label: "DSL", color: "#FF8A00" },
    { key: "satellite", label: "Satellite", color: "#5CFF7A" },
    { key: "cable", label: "Cable", color: "#D5E600" },
    { key: "mobile_data", label: "Mobile\ndata", color: "#1E5BFF" },
    { key: "other", label: "Other", color: "#7A1FFF" },
    { key: "unknown", label: "Unknown", color: "#27C7D8" },
  ].map((d) => ({ ...d, rawValue: Number(c[d.key] || 0) }));

  const max = Math.max(...data.map((d) => d.rawValue), 1);

  const MAX_BAR_PCT = 85;
  const CHART_SHIFT_LEFT = 0.85;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <img
          src="/img/menuLateral/Icon akar-wifi (1).png"
          alt=""
          style={{
            width: "1.5rem",
            height: "1.3rem",
            marginTop: "0.22rem",
            flexShrink: 0,
            objectFit: "contain",
          }}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              font: "normal normal bold 1.25rem/1.56rem Noto Sans",
              color: "#4B4B4B",
              marginBottom: "0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            Type of internet connection
          </div>

          <div style={{ marginLeft: `-${CHART_SHIFT_LEFT}rem` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {data.map((d) => {
                const pct = (d.rawValue / max) * MAX_BAR_PCT;
                const fk = formatK(d.rawValue);

                return (
                  <div
                    key={d.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3.7rem 1fr",
                      alignItems: "center",
                      gap: "0.55rem",
                    }}
                  >
                    <div
                      style={{
                        font: "normal normal normal 0.875rem/1.05rem Noto Sans",
                        color: "#8A8A8A",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {d.label}
                    </div>

                    <div style={{ position: "relative", height: "0.38rem" }}>
                      <div
                        style={{
                          height: "0.38rem",
                          width: `${pct}%`,
                          background: d.color,
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          left: `${pct}%`,
                          top: "50%",
                          transform: "translate(0.35rem, -50%)",
                          font: "normal normal normal 0.875rem/1rem Noto Sans",
                          color: "#8A8A8A",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                        }}
                      >
                        {fk.value} {fk.unit}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   MenuLateral
=========================== */

export default function MenuLateral({
  isLoading,
  isOpen,
  onClose,

  countries = [],
  selectedCountry = "Worldwide",
  onSelectCountry,

  countriesCount = 0,
  stats,

  selectedLibrary,

  activeBottomFilter = "library_status",
  onChangeBottomFilter,
}) {
  const [filters] = useState({
    country: "Country",
    typeOfLibrary: "Type of library",
  });

  const showCountriesCount = selectedCountry === "Worldwide";

  const s = stats || {
    totalPoints: 0,
    connectivityMapped: 0,
    downloadMeasured: 0,
    goodDownload: 0,
    dlRed: 0,
    dlOrange: 0,
    dlGreen: 0,
    internetYes: 0,
    internetNo: 0,
    connectionTypeCounts: null,

    // ✅ NEW
    notConnectReasonsCounts: null,
  };

  const PANEL_WIDTH_REM = 22.5;
  const TAB_WIDTH_REM = 1.125;

  const INFOCARDS_TOP = "35.64%";
  const INFOCARDS_GAP_REM = 1.25;
  const INFOCARD_HEIGHT_REM = 6.2;
  const INFOCARDS_COUNT = 3;
  const AFTER_CARDS_MARGIN_REM = 8.0;

  const LIB_DETAILS_TOP = "16.2%";

  const bottomFiltersTop = `calc(
    ${INFOCARDS_TOP} +
    (${INFOCARDS_COUNT} * ${INFOCARD_HEIGHT_REM}rem) +
    (${INFOCARDS_COUNT - 1} * ${INFOCARDS_GAP_REM}rem) +
    ${AFTER_CARDS_MARGIN_REM}rem
  )`;

  const panelLeft = isOpen ? "0rem" : `-${PANEL_WIDTH_REM}rem`;
  const tabLeft = isOpen ? `calc(${PANEL_WIDTH_REM}rem - 0.01rem)` : "0rem";
  const arrowRotate = isOpen ? "rotate(90deg)" : "rotate(-90deg)";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: "0.875rem",
        width: `calc(${PANEL_WIDTH_REM}rem + ${TAB_WIDTH_REM}rem)`,
        height: "78vh",
        maxHeight: "78vh",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      {/* TAB ALWAYS VISIBLE */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: "14.1%",
          left: tabLeft,
          width: `${TAB_WIDTH_REM}rem`,
          height: "7.05%",
          background: "#0F6641",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 60,
        }}
      >
        <img
          src="/img/menuLateral/arrowDropDown.png"
          alt={isOpen ? "Close menu" : "Open menu"}
          style={{
            width: "0.875rem",
            height: "0.875rem",
            filter: "invert(1)",
            transform: arrowRotate,
            display: "block",
          }}
        />
      </div>

      {/* WHITE PANEL */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: panelLeft,
          width: `${PANEL_WIDTH_REM}rem`,
          height: "100%",
          maxHeight: "100%",
          background: "#FFFFFF",
          opacity: 0.9,
          transition: "left 0.3s ease",
          overflowY: "auto",
          overflowX: "visible",
        }}
      >
        <FilterHeader
          filters={filters}
          countries={countries}
          selectedCountry={selectedCountry}
          onSelectCountry={onSelectCountry}
        />

        {/* Separator line */}
        <div
          style={{
            position: "absolute",
            top: "7.44%",
            left: "9.17%",
            right: "9.17%",
            border: "1px solid #DBDBDB",
          }}
        />

        {/* Country selected + share */}
        <div
          style={{
            position: "absolute",
            top: "9.49%",
            left: "9.17%",
            right: "9.17%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              font: "normal normal normal 1rem/1.56rem Noto Sans",
              color: "#000000",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedCountry}
            {showCountriesCount && (
              <span style={{ marginLeft: "1.25rem" }}>{countriesCount} countries</span>
            )}
          </div>

          <img
            src="/img/menuLateral/Share.png"
            alt="Share"
            style={{
              width: "0.875rem",
              height: "0.94rem",
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Separator line (under header section) */}
        <div
          style={{
            position: "absolute",
            top: "14.1%",
            left: "9.17%",
            right: "9.17%",
            border: "1px solid #DBDBDB",
          }}
        />

        {selectedLibrary ? (
          // ===== Selected library mode =====
          <div
            style={{
              position: "absolute",
              top: LIB_DETAILS_TOP,
              left: "9.17%",
              right: "9.17%",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              paddingBottom: "1.5rem",
              minHeight: `calc(100% - ${LIB_DETAILS_TOP})`,
            }}
          >
            <LibraryDetailsPanel library={selectedLibrary} mode={activeBottomFilter} />

            <div style={{ flexGrow: 1 }} />

            <div style={{ marginLeft: "-9.17%", marginRight: "-9.17%" }}>
              <BottomFilters
                isLoading={isLoading}
                embedded
                activeId={activeBottomFilter}
                onChange={(id) => onChangeBottomFilter?.(id)}
              />
            </div>

            <div style={{ height: "1rem" }} />
          </div>
        ) : (
          // ===== Default mode =====
          <>
            <div
              style={{
                position: "absolute",
                top: "16.67%",
                left: "9.17%",
                width: "66.67%",
                font: "normal normal bold 1.25rem/1.56rem Noto Sans",
                color: "#000000",
              }}
            >
              Libraries
              <br />
              Boosting Connectivity
            </div>

            <div
              style={{
                position: "absolute",
                top: "25.38%",
                left: "9.17%",
                right: "9.17%",
                font: "normal normal normal 1rem/1.56rem Noto Sans",
                color: "#4B4B4B",
              }}
            >
              An open & live global map of libraries and their connectivity
            </div>

            <div
              style={{
                position: "absolute",
                top: INFOCARDS_TOP,
                left: "9.17%",
                right: "9.17%",
                display: "flex",
                flexDirection: "column",
                gap: `${INFOCARDS_GAP_REM}rem`,
              }}
            >
              {activeBottomFilter === "type_connect" ? (
                <>
                  <InfoCard
                    icon="/img/menuLateral/Icon akar-wifi (1).png"
                    iconWidth="1.25rem"
                    iconHeight="1.06rem"
                    title={`${(s.internetYes || 0).toLocaleString()}`}
                    subtitle="Libraries connected to the internet"
                    detail={
                      s.totalPoints
                        ? `${Math.round(((s.internetYes || 0) / s.totalPoints) * 100)}% of mapped libraries`
                        : "N/A"
                    }
                    hasInfo={true}
                    progressBar={
                      s.totalPoints
                        ? {
                            colors: ["#3ED896", "#E0E0E0"],
                            widths: [
                              ((s.internetYes || 0) / s.totalPoints) * 100,
                              100 - ((s.internetYes || 0) / s.totalPoints) * 100,
                            ],
                          }
                        : null
                    }
                  />

                  <TypeOfConnectionCard counts={s.connectionTypeCounts} />
                </>
              ) : activeBottomFilter === "not_connect" ? (
                <>
                  <NotConnectedOverview internetNo={s.internetNo} totalPoints={s.totalPoints} />
                  <NotConnectedReasonsPie counts={s.notConnectReasonsCounts} />
                </>
              ) : (
                <>
                  <InfoCard
                    icon="/img/menuLateral/Icon core-location-pin.png"
                    iconWidth="0.94rem"
                    iconHeight="1.31rem"
                    title={`${(s.totalPoints || 0).toLocaleString()}`}
                    subtitle="Libraries location mapped"
                    detail={selectedCountry === "Worldwide" ? "Worldwide view" : `in ${selectedCountry}`}
                  />

                  <InfoCard
                    icon="/img/menuLateral/Icon akar-wifi (1).png"
                    iconWidth="1.25rem"
                    iconHeight="1.06rem"
                    title={`${(s.connectivityMapped || 0).toLocaleString()}`}
                    subtitle="Libraries connectivity status mapped"
                    detail={
                      s.totalPoints
                        ? `${Math.round(((s.connectivityMapped || 0) / s.totalPoints) * 100)}% of mapped libraries`
                        : "N/A"
                    }
                    hasInfo={true}
                    progressBar={
                      s.totalPoints
                        ? {
                            colors: ["#3ED896", "#E0E0E0"],
                            widths: [
                              ((s.connectivityMapped || 0) / s.totalPoints) * 100,
                              100 - ((s.connectivityMapped || 0) / s.totalPoints) * 100,
                            ],
                          }
                        : null
                    }
                  />

                  <InfoCard
                    icon="/img/menuLateral/Icon core-cloud-download.png"
                    iconWidth="1.25rem"
                    iconHeight="1.06rem"
                    title={`${(s.goodDownload || 0).toLocaleString()}`}
                    subtitle="Libraries with good download speed"
                    detail={
                      s.downloadMeasured
                        ? `of ${s.downloadMeasured.toLocaleString()} libraries inspected`
                        : "No download data detected"
                    }
                    hasInfo={true}
                    progressBar={
                      s.downloadMeasured
                        ? {
                            colors: ["#F82055", "#F9A825", "#3ED896"],
                            widths: [
                              (s.dlRed / s.downloadMeasured) * 100,
                              (s.dlOrange / s.downloadMeasured) * 100,
                              (s.dlGreen / s.downloadMeasured) * 100,
                            ],
                          }
                        : null
                    }
                  />
                </>
              )}
            </div>

            {/* Bottom filters ALWAYS */}
            <div
              style={{
                position: "absolute",
                top: bottomFiltersTop,
                left: 0,
                right: 0,
              }}
            >
              <BottomFilters
                isLoading={isLoading}
                activeId={activeBottomFilter}
                onChange={(id) => onChangeBottomFilter?.(id)}
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: `calc(${bottomFiltersTop} + 6rem)`,
                height: "1px",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}