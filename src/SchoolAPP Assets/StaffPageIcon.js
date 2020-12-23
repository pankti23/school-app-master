import React from "react";

// stroke is none in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
  <svg
    width={width}
    height={height}
    style={style}
    className="svg-hover-class"
    viewBox="0 0 20 18"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g
      id="Symbols"
      stroke={stroke}
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="nav/main/staff/on"
        transform="translate(-11.000000, -12.000000)"
        fillRule="nonzero"
      >
        <g id="Group-6" transform="translate(9.000000, 9.000000)">
          <g id="people">
            <rect
              id="Rectangle"
              fill={fill}
              opacity="0"
              x="0"
              y="0"
              width="24"
              height="24"
            ></rect>
            <path
              d="M6.31922658,13.5431344 C8.93070952,12.4604844 11.9370772,13.0549375 13.94,15.05 C15.447913,13.8831105 17.4882168,13.6753964 19.2003476,14.514468 C20.9124784,15.3535395 21.9983651,17.0933196 22,19 C22,19.5522847 21.5522847,20 21,20 L21,20 L16,20 C16,20.5522847 15.5522847,21 15,21 L15,21 L3,21 C2.44771525,21 2,20.5522847 2,20 C2.0038243,17.1729946 3.70774363,14.6257844 6.31922658,13.5431344 Z M17,7 C18.6568542,7 20,8.34314575 20,10 C20,11.6568542 18.6568542,13 17,13 C15.3431458,13 14,11.6568542 14,10 C14,8.34314575 15.3431458,7 17,7 Z M9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 Z"
              id="Combined-Shape"
              fill={fill}
            ></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default SVG;
