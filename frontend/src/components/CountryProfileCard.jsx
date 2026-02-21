// src/components/CountryProfileCard.jsx

export default function CountryProfileCard({ name, description, onMoreInfo }) {
  return (
    <div style={styles.card}>
      {/* Info icon */}
      <div style={styles.iconBox}>
        <span style={styles.iconText}>i</span>
      </div>

      {/* Country name */}
      <h2 style={styles.title}>{name}</h2>

      {/* Description */}
      <p style={styles.description}>{description}</p>

      {/* More information link */}
      <button
        style={styles.moreInfo}
        onClick={onMoreInfo}
        type="button"
      >
        More information
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginLeft: 8, flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" stroke="#C90030" strokeWidth="2" />
          <path
            d="M10 8l4 4-4 4"
            stroke="#C90030"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    minHeight: 320,
    background: "#F2F2F2",
    borderRadius: 21,
    padding: "32px 30px 32px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    boxSizing: "border-box",
  },
  iconBox: {
    width: 42,
    height: 46,
    background: "#0F6641",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    font: "normal normal bold 35px/98px Noto Sans",
    color: "#E9F4F0",
    lineHeight: "46px",
    userSelect: "none",
  },
  title: {
    textAlign: "left",
    font: "normal normal bold 32px/40px Noto Sans",
    letterSpacing: 0,
    color: "#4B4B4B",
    margin: "0 0 12px 0",
  },
  description: {
    textAlign: "left",
    font: "normal normal normal 16px/22px Noto Sans",
    letterSpacing: 0,
    color: "#000000",
    margin: "0 0 20px 0",
    flex: 1,
  },
  moreInfo: {
    textAlign: "left",
    textDecoration: "underline",
    font: "normal normal 500 14px/14px Noto Sans",
    letterSpacing: 0,
    color: "#C90030",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
};
