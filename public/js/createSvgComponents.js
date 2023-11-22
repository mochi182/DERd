function createSvgRectangleWithLabel(centerX, centerY, width = 90, height= 40, label) {
    const x = centerX - (width/2)
    const y = centerY - (height/2)
    
    const rect = `
        <rect 
            x="${x}" y="${y}"
            width="${width}"
            height="${height}"
            fill="#dae8fc"
            stroke="#6c8ebf"
            pointer-events="all"
        />`;

    const labelX = centerX
    const labelY = centerY + 4
    const paddingTop = centerY
    const marginLeft = x + 1

    const labelSvg = `
        <g transform="translate(-0.5 -0.5)">
            <switch>
            <foreignObject pointer-events="none" width="100%" height="100%"
                requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                style="overflow: visible; text-align: left;">
                <div xmlns="http://www.w3.org/1999/xhtml"
                    style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: ${width - 2}px; height: 1px; padding-top: ${paddingTop}px; margin-left: ${marginLeft}px;">
                    <div data-drawio-colors="color: rgb(0, 0, 0); "
                        style="box-sizing: border-box; font-size: 0px; text-align: center;">
                        <div
                            style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">
                            ${label}
                        </div>
                    </div>
                </div>
            </foreignObject>
                <text x="${labelX}" y="${labelY}" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">${label}</text>
            </switch>
        </g>`;

    return rect + labelSvg;
}
