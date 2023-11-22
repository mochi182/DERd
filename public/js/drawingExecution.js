/* ----- Drawwww -----*/

// Initialize your canvas and context
/* const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Define canvas dimensions
var canvasWidth = 1000;
var canvasHeight = 1000;

// Set up the canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight; */

// Function to draw the tables as rectangles, attributes as ellipses, and relationships as rhomboids
function addLinesToDrawStack() {
    const nodes = diagramGraph.getAllNodesWithData();
    
    // Loop through the nodes
    nodes.forEach((node) => {
        const nodeName = node.name;
        const nodeData = node.data;

        // Check if the node has any neighbors (connected nodes)
        if (nodeData.neighbors) {
            // Loop through the neighbors
            nodeData.neighbors.forEach((neighbor) => {

                const lineName = `[${nodeName}]-[${neighbor}] line`

                // Get the position of the current node
                const startX = nodeData.position.x;
                const startY = nodeData.position.y;

                // Get the position of the neighbor node
                const endX = diagramGraph.getNodeData(neighbor).position.x;
                const endY = diagramGraph.getNodeData(neighbor).position.y;

                // Add line draw to stack
                //redrawStack[lineName] = () => { drawLine(ctx, startX, startY, endX, endY, "black") }
            });
        }
    });
}

function addNodesToDrawStack() {

    // Get all nodes from the graph
    const nodes = diagramGraph.getAllNodesWithData();

    // Loop through the nodes
    nodes.forEach((node) => {
        const nodeName = node.name;
        const nodeData = node.data;

        // Draw nodes based on their type (Table, Attribute, or Relationship)
        if (nodeName.includes("(Table)")) {

            // Add rectangle component to stack
            redrawStack[nodeName] = createSvgRectangleWithLabel(
                nodeData.position.x,
                nodeData.position.y,
                90,
                40,
                nodeData.label
            )

        } else if (nodeName.includes("Attribute of")) {
            // Draw attributes as ellipses
            const attributeWidth = 80; // Width of the ellipse
            const attributeHeight = 40; // Height of the ellipse

            // Add ellipse draw to stack
            /* redrawStack[nodeName] = () => { createSvgEllipseWithLabel(
                nodeData.position.x - attributeWidth / 2,
                nodeData.position.y - attributeHeight / 2,
                attributeWidth,
                attributeHeight,
                nodeData.label,
                nodeData.isPK
            ) } */

        } else if (nodeName.includes("(Relationship)")) {
            // Draw relationship nodes as rhomboids
            const relationshipWidth = 80; // Width of the rhomboid
            const relationshipHeight = 80; // Height of the rhomboid

            // Add rhomboid to draw stack
            /* redrawStack[nodeName] = () => { createSvgRhomboidWithLabel(
                nodeData.position.x - relationshipWidth / 2,
                nodeData.position.y - relationshipHeight / 2,
                relationshipWidth,
                relationshipHeight,
                nodeData.label
            ) } */

        }
    });
}

function optimizeNodePositions() {
    let maxIterations = 100;
    let threshold = 0.00001;
    let count = 1;
    let globalForce = Infinity;
    let coolingFactor = getCoolingFactor(maxIterations, count);
    let gravityConstant = 0.01; // A small gravitational constant
    let centerOfGravity = { x: 1000/2, y: 1000/2 }; // This could be the center of your graph area

    while (count < maxIterations && globalForce > threshold) {
        globalForce = 0;
        let currentForces = {};

        // Calculate forces and update globalForce
        diagramGraph.getAllNodes().forEach((node) => {
            let xForce = diagramGraph.calculateForce(node, "x");
            let yForce = diagramGraph.calculateForce(node, "y");

            // Add gravity force towards the center of gravity
             let nodeData = diagramGraph.getNodeData(node);
            let distanceToCenterX = centerOfGravity.x - nodeData.position.x;
            let distanceToCenterY = centerOfGravity.y - nodeData.position.y;
            xForce += gravityConstant * distanceToCenterX;
            yForce += gravityConstant * distanceToCenterY;  

            globalForce += Math.sqrt((xForce**2) + (yForce**2));
            currentForces[node] = {"xForce": xForce, "yForce": yForce};
        });

        // Apply forces to update node positions
        diagramGraph.getAllNodes().forEach((node) => {
            if (!node.includes("(Relationship)")) {
                diagramGraph.getNodeData(node).position.x += currentForces[node].xForce * coolingFactor;
                diagramGraph.getNodeData(node).position.y += currentForces[node].yForce * coolingFactor;
            } else {
                diagramGraph.repositionRelationship(node)
            }
        });

        count += 1;
        coolingFactor = getCoolingFactor(maxIterations, count);
        //coolingFactor = 1 / Math.sqrt(count);
        //console.log(count, globalForce.toFixed(5));

    }
    console.log(count, globalForce.toFixed(5))
}

function getCoolingFactor(maxIterations, count) {
    const inflection = 2 // The larger, the more bent downwards
    return Math.max(Math.exp((-inflection/maxIterations)*count), 1e-5);
}

// Create an empty stack to store the elements that need to be redrawn
var redrawStack = {};

var drawingWidth = 1000
var drawingHeight = 1000

var svgTemplate = (content) => { return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Do not edit this file with editors other than draw.io -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
    width="${drawingWidth}px" height="${drawingHeight}px" viewBox="-0.5 -0.5 ${drawingWidth} ${drawingHeight}">
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
</svg>` }

// Redraw the elements in the redraw stack
function redraw() {
    let content = '';

    // Iterate through the redrawStack and concatenate SVG components
    for (const key in redrawStack) {
        if (redrawStack.hasOwnProperty(key)) {
            content += redrawStack[key];
        }
    }

    // Wrap content with SVG template
    const svgImage = svgTemplate(content);

    console.log(svgImage)

    // Encode SVG image to base64
    const encodedSvg = btoa(unescape(encodeURIComponent(svgImage)));

    console.log()

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