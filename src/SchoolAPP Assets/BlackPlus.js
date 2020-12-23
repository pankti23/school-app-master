import React from "react";

// stroke is not in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
    <svg 
    width={width} 
    height={height}
    style={style} 
    viewBox="0 0 10 10" 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Admin" stroke={stroke} strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Configure-School" 
            transform="translate(-774.000000, -284.000000)" 
            fill={fill}>
                <g id="Group" transform="translate(335.000000, 147.000000)">
                    <g id="Group-12" transform="translate(30.000000, 22.000000)">
                        <g id="Group-6" transform="translate(0.000000, 102.000000)">
                            <g id="Group-14">
                                <g id="Group-9" transform="translate(409.000000, 6.000000)">
                                    <g id="plus" transform="translate(0.000000, 7.000000)">
                                        <polygon id="Path" points="5.38461538 3.84615385 9.23076923 3.84615385 9.23076923 5.38461538 5.38461538 5.38461538 5.38461538 9.23076923 3.84615385 9.23076923 3.84615385 5.38461538 0 5.38461538 0 3.84615385 3.84615385 3.84615385 3.84615385 0 5.38461538 0"></polygon>
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
