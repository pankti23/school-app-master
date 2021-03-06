import React from "react";

// stroke is not in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
<svg style={style} width={width} height={height} viewBox="0 0 20 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <g id="Admin" stroke={stroke} strokeWidth="1" fill={fill} fillRule="evenodd">
        <g id="Invite-New-Students-Step-1" transform="translate(-101.000000, -266.000000)" fillRule="nonzero">
            <g id="Group-22" transform="translate(52.000000, 62.000000)">
                <g id="Group-14" transform="translate(30.000000, 182.000000)">
                    <g id="email" transform="translate(17.000000, 18.000000)">
                        <rect id="Rectangle" fill="#000000" opacity="0" x="0" y="0" width="24" height="24"></rect>
                        <path d="M19,4 L5,4 C3.34314575,4 2,5.34314575 2,7 L2,17 C2,18.6568542 3.34314575,20 5,20 L19,20 C20.6568542,20 22,18.6568542 22,17 L22,7 C22,5.34314575 20.6568542,4 19,4 Z M19,6 L12.5,10.47 C12.1905989,10.6486328 11.8094011,10.6486328 11.5,10.47 L5,6 L19,6 Z" id="Shape" fill="#0037F6"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
);

export default SVG;