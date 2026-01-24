import React, { useState } from "react";

/*
 * LibrarySectionCard (WRAP SAFE)
 * - El value mostra SEMPRE tot el text
 * - Fa salts de línia correctes
 * - Totalment a prova de resizes
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

      {/* Content */}
      {open && (
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
              {/* Label */}
              <div
                style={{
                  font: "normal normal 600 14px/16px Noto Sans",
                  color: "#4B4B4B",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  maxWidth: "14rem",
                }}
              >
                {r.label}
              </div>

              {/* Value (wrap safe) */}
              <ValueWrap value={r.value} />
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: "1px solid #DBDBDB" }} />
    </div>
  );
}