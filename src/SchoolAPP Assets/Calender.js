import React from "react";

// stroke is not in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
  <svg
    width={width}
    height={height}
    style={style}
    className="svg-hover-class"
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <title>Calendar</title>
    <g
      id="Symbols"
      stroke={stroke}
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="nav/main/calendar/on"
        transform="translate(-11.000000, -11.000000)"
        fill={fill}
        fillRule="nonzero"
      >
        <g id="Calendar" transform="translate(11.000000, 11.000000)">
          <path
            d="M15.8335938,10.8333333 L10.8335938,10.8333333 L10.8335938,15.8333333 L15.8335938,15.8333333 L15.8335938,10.8333333 Z M14.1669271,0 L14.1669271,1.66666667 L5.83359375,1.66666667 L5.83359375,0 L3.33359375,0 L3.33359375,1.66666667 L2.08307292,1.66666667 C0.937135417,1.66666667 -0.000260416667,2.6040625 -0.000260416667,3.75 L-0.000260416667,17.9166667 C-0.000260416667,19.0626042 0.937135417,20 2.08307292,20 L17.9169271,20 C19.0628646,20 20.0002604,19.0626042 20.0002604,17.9166667 L20.0002604,3.75 C20.0002604,2.6040625 19.0628646,1.66666667 17.9169271,1.66666667 L16.6669271,1.66666667 L16.6669271,0 L14.1669271,0 Z M17.9169271,17.9166667 L2.08307292,17.9166667 L2.08307292,6.875 L17.9169271,6.875 L17.9169271,17.9166667 Z"
            id="Shape"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

export default SVG;
