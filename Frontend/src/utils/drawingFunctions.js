import { generateId } from "./helperFunctions"

import {
    createSvgLine,
    createSvgRectangle,
    createSvgEllipse,
    createSvgRhombus,
    svgTemplate
} from "./svgComponents.js"

import {
    createXmlLine,
    createXmlRectangle,
    createXmlEllipse,
    createXmlRhombus,
    createDrawioXmlTemplate
} from "./xmlComponents.js"

// Function to draw the lines that connect the nodes

async function addLinesToDrawStack($globalState) {

    const nodes = $globalState.graph.getAllNodesWithData();
    
    // Loop through the nodes
    nodes.forEach((node) => {
        const nodeName = node.name;
        const nodeData = node.data;

        // Check if the node has any neighbors (connected nodes)
        if (nodeData.neighbors) {
            // Loop through the neighbors
            nodeData.neighbors.forEach((neighbor) => {

                // Generate a unique id that will be used when drawing the Xml
                const lineId = generateId() // `${nodeData.label}-${neighbor.label}-line`

                // Get the position of the current node
                const startX = nodeData.position.x;
                const startY = nodeData.position.y;

                // Get the position of the neighbor node
                const neighborData = $globalState.graph.getNodeData(neighbor)
                const endX = neighborData.position.x;
                const endY = neighborData.position.y;

                // Add line draw to stack
                $globalState.redrawStack[lineId] = {
                    Svg: createSvgLine,
                    Xml: createXmlLine,
                    params: [startX, startY, endX, endY, "", nodeData.id, neighborData.id]
                }
            });
        }
    });
}

// Function to draw the tables as rectangles, attributes as ellipses, and relationships as Rhombus

async function addNodesToDrawStack($globalState) {

    // Get all nodes from the graph
    const nodes = $globalState.graph.getAllNodesWithData();

    // Loop through the nodes
    nodes.forEach((node) => {
        const nodeName = node.name;
        const nodeData = node.data;

        // Draw nodes based on their type (Table, Attribute, or Relationship)
        if (nodeName.includes("(Table)")) {
            // Add rectangle component to stack
            $globalState.redrawStack[nodeData.id] = {
                Svg: createSvgRectangle,
                Xml: createXmlRectangle,
                params: [
                    nodeData.position.x,
                    nodeData.position.y,
                    90,
                    40,
                    nodeData.label
                ]
            }
        } else if (nodeName.includes("Attribute of")) {
            // Add ellipse draw to stack
            $globalState.redrawStack[nodeData.id] = {
                Svg: createSvgEllipse,
                Xml: createXmlEllipse,
                params: [
                    nodeData.position.x,
                    nodeData.position.y,
                    38,
                    25,
                    nodeData.label,
                    nodeData.isPK
                ]
            }
        } else if (nodeName.includes("(Relationship)")) {
            // Add Rhombus to draw stack
            $globalState.redrawStack[nodeData.id] = {
                Svg: createSvgRhombus,
                Xml: createXmlRhombus,
                params: [
                    nodeData.position.x,
                    nodeData.position.y,
                    70,
                    70,
                    nodeData.label
                ]
            }
        }
    });
}

/* ----- Redraw the elements in the redraw stack ----- */

export function draw($globalState) {
    addLinesToDrawStack($globalState);
    addNodesToDrawStack($globalState);

    let svgContent = ''
    let xmlContent = ''

    // Iterate through the redrawStack and concatenate SVG components
    for (const id in $globalState.redrawStack) {
        if ($globalState.redrawStack.hasOwnProperty(id)) {
            var parameters = $globalState.redrawStack[id].params
            svgContent += $globalState.redrawStack[id].Svg(...parameters)
            xmlContent += $globalState.redrawStack[id].Xml(...parameters, id)
        }
    }

    let drawioXMLCode = createDrawioXmlTemplate(xmlContent)

    // Wrap content with SVG template
    const svgImage = svgTemplate($globalState, svgContent, drawioXMLCode);

    // Encode SVG image to base64
    const encodedSvg = btoa(unescape(encodeURIComponent(svgImage)));

    // Return the src attribute of the image
    return `data:image/svg+xml;base64,${encodedSvg}`;
}

// Clear the redraw stack
function clear_redraw_stack($globalState) {
    $globalState.redrawStack = {};
}