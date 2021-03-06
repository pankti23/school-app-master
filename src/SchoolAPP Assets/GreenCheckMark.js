import React from 'react';


// stroke and fill is not set in this SVG

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
<svg style={style} width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <g id="Admin" stroke={stroke} strokeWidth="1" fill={fill} fillRule="evenodd">
        <g id="Configure-Permissions" transform="translate(-379.000000, -1461.000000)">
            <g id="Group-4" transform="translate(335.000000, 1435.000000)">
                <g id="Group-3" transform="translate(20.000000, 21.000000)">
                    <g id="Group">
                        <g id="Group-7" transform="translate(0.000000, 3.000000)">
                            <g id="Group-6" transform="translate(24.000000, 2.000000)">
                                <rect id="Rectangle" fill="#5CC26B" x="0" y="0" width={width} height={height} rx="3"></rect>
                                <g id="check" transform="translate(4.000000, 4.000000)" fill="#ffffff" fill-rule="nonzero">
                                    <path d="M3.02514286,7.99885714 C2.77657143,7.99885714 2.54114286,7.88285714 2.39028571,7.68285714 L0.348571429,4.98514286 C0.0828571429,4.63485714 0.152,4.136 0.502857143,3.87028571 C0.854285714,3.60342857 1.35314286,3.67371429 1.61885714,4.02457143 L2.96228571,5.79828571 L6.34,0.374285714 C6.57257143,0.00171428571 7.064,-0.112571429 7.43771429,0.12 C7.81085714,0.352 7.92571429,0.843428571 7.69257143,1.21714286 L3.70171429,7.62285714 C3.56342857,7.84628571 3.324,7.98571429 3.06171429,7.99771429 C3.04914286,7.99885714 3.03771429,7.99885714 3.02514286,7.99885714 Z" id="Path"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
)

export default SVG;