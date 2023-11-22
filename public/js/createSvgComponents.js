/* ----- SVG image ----- */

function createSvgRectangle(centerX, centerY, width = 90, height= 40, label) {
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

function createSvgEllipse(centerX, centerY, rx = 38, ry = 25, label, isPK = false) {
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

function createSvgRhombus(centerX, centerY, width = 70, height = 70, label) {
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

function createSvgLine(startX, startY, endX, endY, label = "") {
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

function svgTemplate(content, xmlContent = ""){
    return `<?xml version="1.0" encoding="UTF-8"?>
    <!-- Do not edit this file with editors other than draw.io -->
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
        width="${drawingWidth}px" height="${drawingHeight}px" viewBox="-0.5 -0.5 ${drawingWidth} ${drawingHeight}"
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

/* ----- XML template ---- */

function createXmlRectangle(centerX, centerY, width = 90, height = 40, label, uniqueId) {
    const x = centerX - (width / 2);
    const y = centerY - (height / 2);

    const xmlRectangle = `
        <mxCell id="${uniqueId}" value="${label}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;

    return xmlRectangle;
}

function createXmlEllipse(centerX, centerY, rx = 38, ry = 25, label, isPK = false, uniqueId) {
    // Calculate the actual position and size based on the radius
    const x = centerX - rx;
    const y = centerY - ry;
    const width = rx * 2;
    const height = ry * 2;

    // Escape the label if it needs to be underlined (isPK)
    const escapedLabel = isPK ? `&lt;u&gt;${label}&lt;/u&gt;` : label;

    // Generate the XML string
    const xmlEllipse = `
        <mxCell id="${uniqueId}" value="${escapedLabel}" style="ellipse;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;" vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;

    return xmlEllipse;
}

function createXmlRhombus(centerX, centerY, width = 70, height = 70, label, uniqueId) {
    const x = centerX - (width / 2);
    const y = centerY - (height / 2);

    return `
        <mxCell id="${uniqueId}" value="${label}" style="rhombus;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;
}

function createXmlLine(startX, startY, endX, endY, label = "", sourceId, targetId, uniqueId1) {
    const uniqueId2 = generateId(); // For the label

    // Edge XML
    const lineXml = `
        <mxCell id="${uniqueId1}" style="edgeStyle=rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=0;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;endArrow=none;endFill=0;" edge="1" parent="1" source="${sourceId}" target="${targetId}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>`;

    // Label XML
    const labelXml = label != "" ? `
        <mxCell id="${uniqueId2}" value="${label}" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" vertex="1" connectable="0" parent="${uniqueId1}">
          <mxGeometry x="-0.4" y="-2" relative="1" as="geometry">
            <mxPoint as="offset" />
          </mxGeometry>
        </mxCell>` : "";

    return lineXml + labelXml;
}

function createDrawioXmlTemplate(content) {
    // Generate unique strings from diagram name and id
    const diagramId = generateId()
    const diagramName = generateId()

    // Current timestamp for the modified attribute
    const currentTimestamp = new Date().toISOString();

    // Escaping the diagram name for XML
    //const escapedDiagramName = escapeForXML(diagramName)

    // Base structure of the draw.io XML
    const xmlTemplate = `
        <mxfile host="app.diagrams.net" modified="${currentTimestamp}" agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36" version="22.1.3" type="device">
        <diagram name="${diagramName}" id="${diagramId}">
            <mxGraphModel dx="538" dy="478" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
                <mxCell id="0" />
                <mxCell id="1" parent="0" />
                ${content}
            </root>
            </mxGraphModel>
        </diagram>
        </mxfile>`;

    return xmlTemplate;
}

function escapeForXML(text) {
    return text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\t\n\r]/gm,'')
    .replaceAll(/\s+/g, ' ')
    .trim()
}

/* ----- Redraw the elements in the redraw stack ----- */

// Create an empty stack to store the elements that need to be redrawn
var redrawStack = {};

var drawingWidth = 1000
var drawingHeight = 1000

function redraw() {
    let svgContent = ''
    let xmlContent = ''

    // Iterate through the redrawStack and concatenate SVG components
    for (const id in redrawStack) {
        if (redrawStack.hasOwnProperty(id)) {
            parameters = redrawStack[id].params
            svgContent += redrawStack[id].Svg(...parameters)
            xmlContent += redrawStack[id].Xml(...parameters, id)
        }
    }

    drawioXMLCode = createDrawioXmlTemplate(xmlContent)

    // Wrap content with SVG template
    const svgImage = svgTemplate(svgContent, escapeForXML(drawioXMLCode));

    //console.log(svgImage)

    // Encode SVG image to base64
    const encodedSvg = btoa(unescape(encodeURIComponent(svgImage)));

    // Update the src attribute of the image
    const imageElement = document.getElementById("ErDiagram");
    if (imageElement) {
        imageElement.src = `data:image/svg+xml;base64,${encodedSvg}`;
    }
}

// Clear the redraw stack
function clear_redraw_stack() {
    redrawStack = {};
}