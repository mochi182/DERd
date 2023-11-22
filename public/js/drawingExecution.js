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
                redrawStack[lineName] = createSvgLineWithLabel(startX, startY, endX, endY)
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
            // Add ellipse draw to stack
            redrawStack[nodeName] = createSvgEllipseWithLabel(
                nodeData.position.x,
                nodeData.position.y,
                38,
                25,
                nodeData.label,
                nodeData.isPK
            )
        } else if (nodeName.includes("(Relationship)")) {
            // Add rhomboid to draw stack
            redrawStack[nodeName] = createSvgRhomboidWithLabel(
                nodeData.position.x,
                nodeData.position.y,
                70,
                70,
                nodeData.label
            )
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