import React from "react";

/*
 * FilterHeader displays the top row of the side menu containing the
 * filter icon together with the currently active filter categories.
 * The user can click on the dropdown arrows to eventually adjust
 * filters (not yet implemented).  Icons are loaded from the
 * `/img/menuLateral` directory as referenced in the provided assets.
 */
export default function FilterHeader({ filters }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "23px",
        left: "0px",
        width: "100%",
        paddingLeft: "33px",
        paddingRight: "33px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        {/* Filter icon */}
        <img
          src="/img/menuLateral/Icon material-sharp-filter-alt.png"
          alt="Filter"
          style={{ width: "17px", height: "15px" }}
        />
        <span
          style={{
            textAlign: "left",
            font: "normal normal normal 14px/25px Noto Sans",
            color: "#606060",
          }}
        >
          Filter
        </span>
        {/* Country filter */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "16px" }}
        >
          <span
            style={{
              textAlign: "left",
              font: "normal normal 600 16px/25px Noto Sans",
              color: "#000000",
            }}
          >
            Country
          </span>
          <img
            src="/img/menuLateral/Icon ion-ios-arrow-drop-left.png"
            alt="Toggle country filter"
            style={{ width: "11px", height: "11px", transform: "rotate(-90deg)" }}
          />
        </div>
        {/* Type of library filter */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "10px" }}
        >
          <span
            style={{
              textAlign: "left",
              font: "normal normal 600 16px/25px Noto Sans",
              color: "#000000",
            }}
          >
            Type of library
          </span>
          <img
            src="/img/menuLateral/Icon ion-ios-arrow-drop-left.png"
            alt="Toggle library type filter"
            style={{ width: "11px", height: "11px", transform: "rotate(-90deg)" }}
          />
        </div>
      </div>
    </div>
  );
}
