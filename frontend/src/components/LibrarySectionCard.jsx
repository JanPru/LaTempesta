import React, { useState } from "react";

/*
 * LibrarySectionCard (WRAP SAFE)
 * - El value mostra SEMPRE tot el text
 * - Fa salts de línia correctes
 * - Totalment a prova de resizes
 * - Info icons amb tooltips als labels
 */

function Chevron({ open }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      style={{
        display: "block",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path
        d="M3 4.5 L6 7.5 L9 4.5"
        fill="none"
        stroke="#4B4B4B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function ValueWrap({ value }) {
  const text = String(value ?? "").trim() || "N/A";

  return (
    <div
      style={{
        // 🔑 CLAU perquè el text pugui wrappear dins flex
        flex: 1,
        minWidth: 0,

        font: "normal normal normal 14px/16px Noto Sans",
        color: "#4B4B4B",
        textAlign: "right",

        // ✅ wrap correcte
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      {text}
    </div>
  );
}

export default function LibrarySectionCard({ title, rows = [], defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "0.75rem 0",
        }}
      >
        <div
          style={{
            font: "normal normal normal 16px/16px Noto Sans",
            color: "#4B4B4B",
          }}
        >
          {title}
        </div>
        <Chevron open={open} />
      </div>

      {/* Content with slide transition */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.25s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ paddingBottom: "0.5rem" }}>
            {rows.map((r, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "0.5rem 0",
                }}
              >
                {/* Label with optional info icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    flexShrink: 0,
                    maxWidth: "14rem",
                  }}
                >
                  <div
                    style={{
                      font: "normal normal 600 14px/16px Noto Sans",
                      color: "#4B4B4B",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {r.label}
                  </div>
                  {r.infoText && <InfoIconWithTooltip text={r.infoText} />}
                </div>

                {/* Value (wrap safe) */}
                <ValueWrap value={r.value} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #DBDBDB" }} />
    </div>
  );
}