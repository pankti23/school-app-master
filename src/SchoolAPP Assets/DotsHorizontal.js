import React from "react";

// stroke is not in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
    <svg width={width} height={height} style={style} viewBox="0 0 16 4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Admin" stroke={stroke} strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Students" transform="translate(-1360.000000, -255.000000)" fill={fill} fillRule="nonzero">
                <g id="Group-15" transform="translate(105.000000, 147.000000)">
                    <g id="Group">
                        <g id="Group-4" transform="translate(0.000000, 42.000000)">
                            <g id="Group-3" transform="translate(0.000000, 56.000000)">
                                <g id="Group-19" transform="translate(1210.000000, 0.000000)">
                                    <g id="dots-horizontal" transform="translate(45.000000, 10.000000)">
                                        <path d="M12,2 C12,0.8954 12.8954,0 14,0 C15.1046,0 16,0.8954 16,2 C16,3.1046 15.1046,4 14,4 C12.8954,4 12,3.1046 12,2 Z M6,2 C6,0.8954 6.8954,0 8,0 C9.1046,0 10,0.8954 10,2 C10,3.1046 9.1046,4 8,4 C6.8954,4 6,3.1046 6,2 Z M0,2 C0,0.8954 0.89543,0 2,0 C3.10457,0 4,0.8954 4,2 C4,3.1046 3.10457,4 2,4 C0.89543,4 0,3.1046 0,2 Z" id="Shape"></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);

export default SVG;