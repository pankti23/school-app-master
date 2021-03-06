import React from 'react';

// you must pass fill, stroke, style, width, and height for the SVG. Viewbox is hard coded

const SVG = ({ style = {}, fill, stroke, width, height }) => (
    <svg style={style} width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Admin" stroke={stroke} strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Configure-Teachers" transform="translate(-1207.000000, -152.000000)" fill={fill} fillRule="nonzero">
                <g id="Group-6" transform="translate(335.000000, 147.000000)">
                    <g id="Group-9">
                        <g id="Group-16" transform="translate(872.000000, 2.000000)">
                            <g id="search" transform="translate(0.000000, 3.000000)">
                                <path d="M11.4558859,10.3245151 L15.7656854,14.6343146 L14.6343146,15.7656854 L10.3245151,11.4558859 C9.24076808,12.2983347 7.8789692,12.8 6.4,12.8 C2.8653776,12.8 0,9.9346224 0,6.4 C0,2.8653776 2.8653776,0 6.4,0 C9.9346224,0 12.8,2.8653776 12.8,6.4 C12.8,7.8789692 12.2983347,9.24076808 11.4558859,10.3245151 Z M6.4,11.2 C9.0509668,11.2 11.2,9.0509668 11.2,6.4 C11.2,3.7490332 9.0509668,1.6 6.4,1.6 C3.7490332,1.6 1.6,3.7490332 1.6,6.4 C1.6,9.0509668 3.7490332,11.2 6.4,11.2 Z" id="Shape"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);

export default SVG;    