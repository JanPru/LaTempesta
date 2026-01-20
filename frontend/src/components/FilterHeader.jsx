import React from "react";

/*
 * FilterHeader displays the top row of the side menu containing the
 * filter icon together with the currently active filter categories.
 * Header is perfectly centered with symmetric padding (33px).
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          whiteSpace: "nowrap",
        }}
      >
        {/* Filter icon */}
        <img
          src="/img/menuLateral/Icon material-sharp-filter-alt.png"
          alt="Filter"
          style={{
            width: "17px",
            height: "15px",
            flexShrink: 0,
          }}
        />

        <span
          style={{
            font: "normal normal normal 14px/25px Noto Sans",
            color: "#606060",
            flexShrink: 0,
          }}
        >
          Filter
        </span>

        {/* Country filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginLeft: "16px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              font: "normal normal 600 16px/25px Noto Sans",
              color: "#000000",
            }}
          >
            Country
          </span>

          <img
            src="/img/menuLateral/arrowDropDown.png"
            alt="Toggle country filter"
            style={{
              width: "11px",
              height: "11px",
              marginTop: "2px",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Type of library filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginLeft: "10px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              font: "normal normal 600 16px/25px Noto Sans",
              color: "#000000",
            }}
          >
            Type of library
          </span>

          <img
            src="/img/menuLateral/arrowDropDown.png"
            alt="Toggle library type filter"
            style={{
              width: "11px",
              height: "11px",
              marginTop: "2px",
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
