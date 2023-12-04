/* ----- SVG image ----- */

export function createSvgRectangle(centerX, centerY, width = 90, height= 40, label) {
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

export function createSvgEllipse(centerX, centerY, rx = 38, ry = 25, label, isPK = false) {
    const ellipseSvg = `
        <ellipse 
            cx="${centerX}" cy="${centerY}" 
            rx="${rx}" ry="${ry}" 
            fill="#f5f5f5" 
            stroke="#666666"
            pointer-events="all"
        />`;

    const labelX = centerX;
    const labelY = centerY + 4; // Adjust for vertical alignment
    const paddingTop = centerY;
    const marginLeft = centerX - rx + 1; // Adjust based on ellipse's radius

    const labelSvg = `
        <g transform="translate(-0.5 -0.5)">
            <switch>
                <foreignObject pointer-events="none" width="100%" height="100%"
                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                    style="overflow: visible; text-align: left;">
                    <div xmlns="http://www.w3.org/1999/xhtml"
                        style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: ${2 * rx - 2}px; height: 1px; padding-top: ${paddingTop}px; margin-left: ${marginLeft}px;">
                        <div data-drawio-colors="color: #333333; "
                            style="box-sizing: border-box; font-size: 0px; text-align: center;">
                            <div
                                style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(51, 51, 51); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">
                                ${isPK ? `<u>${label}</u>` : label}
                            </div>
                        </div>
                    </div>
                </foreignObject>
                <text x="${labelX}" y="${labelY}" fill="#333333" font-family="Helvetica" font-size="12px"
                    text-anchor="middle">${label}</text>
            </switch>
        </g>`;

    return ellipseSvg + labelSvg;
}

export function createSvgRhombus(centerX, centerY, width = 70, height = 70, label) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const points = [
        [centerX, centerY - halfHeight], // Top
        [centerX + halfWidth, centerY], // Right
        [centerX, centerY + halfHeight], // Bottom
        [centerX - halfWidth, centerY]  // Left
    ];

    const pathData = `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]} L ${points[2][0]} ${points[2][1]} L ${points[3][0]} ${points[3][1]} Z`;

    const RhombusSvg = `
        <path 
            d="${pathData}" 
            fill="#e1d5e7" 
            stroke="#9673a6"
            stroke-miterlimit="10" 
            pointer-events="all" 
        />`;

    const labelX = centerX;
    const labelY = centerY + 4; // Adjust for vertical alignment
    const paddingTop = centerY;
    const marginLeft = centerX - halfWidth + 1; // Adjust based on Rhombus's width

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
                <text x="${labelX}" y="${labelY}" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px"
                    text-anchor="middle">${label}</text>
            </switch>
        </g>`;

    return RhombusSvg + labelSvg;
}

export function createSvgLine(startX, startY, endX, endY, label = "") {
    const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;

    const lineSvg = `
        <path 
            d="${pathData}" 
            fill="none" 
            stroke="rgb(0, 0, 0)" 
            stroke-miterlimit="10"
            pointer-events="stroke" 
        />`;

    const labelX = (startX + endX) / 2;
    const labelY = (startY + endY) / 2 + 3; // Slight adjustment for better visual alignment
    const paddingTop = labelY - 3;
    const marginLeft = labelX;

    const labelSvg = label != "" ? `
        <g transform="translate(-0.5 -0.5)">
            <switch>
                <foreignObject pointer-events="none" width="100%" height="100%"
                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                    style="overflow: visible; text-align: left;">
                    <div xmlns="http://www.w3.org/1999/xhtml"
                        style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: ${paddingTop}px; margin-left: ${marginLeft}px;">
                        <div
                            data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);"
                            style="box-sizing: border-box; font-size: 0px; text-align: center;">
                            <div
                                style="display: inline-block; font-size: 11px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">
                                ${label}
                            </div>
                        </div>
                    </div>
                </foreignObject>
                <text x="${labelX}" y="${labelY}" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="11px"
                    text-anchor="middle">${label}</text>
            </switch>
        </g>` : "";

    return lineSvg + labelSvg;
}

export function svgTemplate($globalState, content, xmlContent = ""){
    return `<?xml version="1.0" encoding="UTF-8"?>
    <!-- Do not edit this file with editors other than draw.io -->
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
        width="${$globalState.drawingWidth}px" height="${$globalState.drawingHeight}px" viewBox="-0.5 -0.5 ${$globalState.drawingWidth} ${$globalState.drawingHeight}"
        content="${xmlContent}">
        <defs />
        <g>
            ${content}
        </g>
        <switch>
            <g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" />
            <a transform="translate(0,-5)"
                xlink:href="https://www.drawio.com/doc/faq/svg-export-text-problems" target="_blank">
                <text text-anchor="middle" font-size="10px" x="50%" y="100%">Text is not SVG - cannot
                    display</text>
            </a>
        </switch>
    </svg>`
}
