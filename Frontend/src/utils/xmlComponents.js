import { generateId } from "./helperFunctions"

/* ----- XML template ---- */

export function createXmlRectangle(centerX, centerY, width = 90, height = 40, label, uniqueId) {
    const x = centerX - (width / 2);
    const y = centerY - (height / 2);

    const xmlRectangle = `
        <mxCell id="${uniqueId}" value="${label}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;

    return xmlRectangle;
}

export function createXmlEllipse(centerX, centerY, rx = 38, ry = 25, label, isPK = false, uniqueId) {
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

export function createXmlRhombus(centerX, centerY, width = 70, height = 70, label, uniqueId) {
    const x = centerX - (width / 2);
    const y = centerY - (height / 2);

    return `
        <mxCell id="${uniqueId}" value="${label}" style="rhombus;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;
}

export function createXmlLine(startX, startY, endX, endY, label = "", sourceId, targetId, uniqueId1) {
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

export function createDrawioXmlTemplate(content) {
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

    return escapeForXML(xmlTemplate);
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