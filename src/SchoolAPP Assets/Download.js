import React from "react";

// stroke is none in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
<svg style={style} width={width} height={height} viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <g id="Admin" stroke={stroke} strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Invite-New-Students-CSV-Step-2" transform="translate(-632.000000, -90.000000)" fill={fill} fillRule="nonzero">
            <g id="Group-22" transform="translate(52.000000, 62.000000)">
                <g id="Group-2" transform="translate(578.000000, 26.000000)">
                    <g id="data-download-5" transform="translate(0.000000, 2.000000)">
                        <g id="Download" transform="translate(2.000000, 0.000000)">
                            <path d="M16,0 L2,0 C0.897,0 0,0.897 0,2 L0,16 C0,17.103 0.897,18 2,18 L16,18 C17.103,18 18,17.103 18,16 L18,2 C18,0.897 17.103,0 16,0 Z M9,14.414 L4.293,9.706 L5.707,8.292 L8,10.586 L8,4 L10,4 L10,10.586 L12.293,8.293 L13.707,9.707 L9,14.414 Z" id="Shape"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
)

export default SVG;