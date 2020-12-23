import React from "react";

// stroke is not in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
    <svg style={style} width={width} height={height} viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <g id="Admin" stroke={stroke} strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Invite-New-Students-CSV-Step-2" transform="translate(-97.000000, -204.000000)" fillRule="nonzero">
            <g id="Group-22" transform="translate(52.000000, 62.000000)">
                <g id="Group-25" transform="translate(30.000000, 103.000000)">
                    <g id="Group-21" transform="translate(0.000000, 26.000000)">
                        <g id="external-link-outline" transform="translate(13.000000, 11.000000)">
                            <rect id="Rectangle" fill={fill} opacity="0" x="0" y="0" width="16" height="16"></rect>
                            <path d="M8,2 C8.36818983,2 8.66666667,2.29847683 8.66666667,2.66666667 C8.66666667,3.0348565 8.36818983,3.33333333 8,3.33333333 L8,3.33333333 L4,3.33333333 C3.63181017,3.33333333 3.33333333,3.63181017 3.33333333,4 L3.33333333,4 L3.33333333,12 C3.33333333,12.3681898 3.63181017,12.6666667 4,12.6666667 L4,12.6666667 L12,12.6666667 C12.3681898,12.6666667 12.6666667,12.3681898 12.6666667,12 L12.6666667,12 L12.6666667,8 C12.6666667,7.63181017 12.9651435,7.33333333 13.3333333,7.33333333 C13.7015232,7.33333333 14,7.63181017 14,8 L14,8 L14,12 C14,13.1045695 13.1045695,14 12,14 L12,14 L4,14 C2.8954305,14 2,13.1045695 2,12 L2,12 L2,4 C2,2.8954305 2.8954305,2 4,2 L4,2 Z M13.3333333,2 C13.7015232,2 14,2.29847683 14,2.66666667 L14,2.66666667 L14,5.33333333 C14,5.70152317 13.7015232,6 13.3333333,6 C12.9651435,6 12.6666667,5.70152317 12.6666667,5.33333333 L12.6666667,5.33333333 L12.6666667,4.28 L8.47333333,8.46666667 C8.3481556,8.5928751 8.17775836,8.66386555 8,8.66386555 C7.82224164,8.66386555 7.6518444,8.5928751 7.52666667,8.46666667 C7.40045823,8.34148893 7.32946778,8.17109169 7.32946778,7.99333333 C7.32946778,7.81557498 7.40045823,7.64517773 7.52666667,7.52 L7.52666667,7.52 L11.72,3.33333333 L10.6666667,3.33333333 C10.2984768,3.33333333 10,3.0348565 10,2.66666667 C10,2.29847683 10.2984768,2 10.6666667,2 L10.6666667,2 Z" id="Combined-Shape" fill="#373737"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
)

export default SVG;