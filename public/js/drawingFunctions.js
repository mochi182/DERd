// Initialize your canvas and context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Function to draw a rectangle
function drawRectangle(x1, y1, x2, y2, color = "black") {
    ctx.fillStyle = 'lightGrey';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
}

// Function to draw a rhomboid (diamond shape)
function drawRhomboid(x, y, width, height, color = "black") {
    ctx.fillStyle = 'lightGrey';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height / 2);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x, y + height / 2);
    ctx.lineTo(x + width / 2, y);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
}

// Function to draw an ellipse
function drawEllipse(x, y, width, height, color = "black") {
    ctx.fillStyle = 'lightGrey';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
}

// Function to draw a line between two points
function drawLine(x1, y1, x2, y2, color = "black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Function to draw text within a shape with an optional underline
function drawLabel(x1, y1, x2, y2, label = "", color = "grey", underline = false) {
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    const xc = x1 + Math.round((x2 - x1) / 2);
    const yc = y1 + Math.round((y2 - y1) / 2);
    ctx.font = "12px Arial";
    ctx.fillText(label, xc, yc);

    if (underline) {
        const textWidth = ctx.measureText(label).width;
        const lineHeight = 2; 
        const lineY = yc + 3; 
        ctx.beginPath();
        ctx.moveTo(xc - textWidth / 2, lineY);
        ctx.lineTo(xc + textWidth / 2, lineY);
        ctx.lineWidth = lineHeight;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ----- Redraw stack ----- */

// Create an empty stack to store the elements that need to be redrawn
var redrawStack = {};

// Redraw the elements in the redraw stack
function redraw() {
    // Clear the canvas
    clearCanvas();
    // Redraw all the elements in the redraw stack
    for (const room in redrawStack) {
        redrawStack[room]();
    }
}

// Clear the redraw stack
function clear_redraw_stack() {
    redrawStack = {};
}

/* ----- Drawwww -----*/

// Define canvas dimensions
var canvasWidth = 1000;
var canvasHeight = 1000;

// Set up the canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Function to draw the tables as rectangles, attributes as ellipses, and relationships as rhomboids
function drawLines() {
    const nodes = diagramGraph.getAllNodesWithData();
    
    // Loop through the nodes
    nodes.forEach((node) => {
        const nodeName = node.name;
        const nodeData = node.data;

        // Check if the node has any neighbors (connected nodes)
        if (nodeData.neighbors) {
            // Loop through the neighbors
            nodeData.neighbors.forEach((neighbor) => {
                // Get the position of the current node
                const startX = nodeData.position.x;
                const startY = nodeData.position.y;

                // Get the position of the neighbor node
                const endX = diagramGraph.getNodeData(neighbor).position.x;
                const endY = diagramGraph.getNodeData(neighbor).position.y;

                // Draw a line between the nodes
                drawLine(startX, startY, endX, endY, "black");
            });
        }
    });
}

function drawElements() {
    // Clear the canvas
    clearCanvas();

    // Draw lines between connected nodes
    drawLines();

    // Get all nodes from the graph
    const nodes = diagramGraph.getAllNodesWithData();

    // Loop through the nodes
    nodes.forEach((node) => {
        const nodeName = node.name;
        const nodeData = node.data;

        // Draw nodes based on their type (Table, Attribute, or Relationship)
        if (nodeName.includes("(Table)")) {
            // Draw tables as rectangles
            const tableWidth = 100; // Width of the table rectangle
            const tableHeight = 50; // Height of the table rectangle
            drawRectangle(
                nodeData.position.x - tableWidth / 2,
                nodeData.position.y - tableHeight / 2,
                nodeData.position.x + tableWidth / 2,
                nodeData.position.y + tableHeight / 2,
                "blue"
            );

            // Draw the table name as text within the table rectangle
            drawLabel(
                nodeData.position.x - tableWidth / 2,
                nodeData.position.y - tableHeight / 2,
                nodeData.position.x + tableWidth / 2,
                nodeData.position.y + tableHeight / 2,
                nodeData.label,
                "black"
            );
        } else if (nodeName.includes("Attribute of")) {
            // Draw attributes as ellipses
            const attributeWidth = 80; // Width of the ellipse
            const attributeHeight = 40; // Height of the ellipse
            drawEllipse(
                nodeData.position.x - attributeWidth / 2,
                nodeData.position.y - attributeHeight / 2,
                attributeWidth,
                attributeHeight,
                "green"
            );

            // Draw the attribute name as text within the ellipse
            drawLabel(
                nodeData.position.x - attributeWidth / 2,
                nodeData.position.y - attributeHeight / 2,
                nodeData.position.x + attributeWidth / 2,
                nodeData.position.y + attributeHeight / 2,
                nodeData.label,
                "black",
                nodeData.isPK
            );
        } else if (nodeName.includes("(Relationship)")) {
            // Draw relationship nodes as rhomboids
            const relationshipWidth = 80; // Width of the rhomboid
            const relationshipHeight = 80; // Height of the rhomboid
            drawRhomboid(
                nodeData.position.x - relationshipWidth / 2,
                nodeData.position.y - relationshipHeight / 2,
                relationshipWidth,
                relationshipHeight,
                "red"
            );

            // Draw the relationship name as text within the rhomboid
            drawLabel(
                nodeData.position.x - relationshipWidth / 2,
                nodeData.position.y - relationshipHeight / 2,
                nodeData.position.x + relationshipWidth / 2,
                nodeData.position.y + relationshipHeight / 2,
                nodeData.label,
                "black"
            );
        }
    });
}

function optimizeNodePositions() {
    let maxIterations = 10000;
    let threshold = 0.00001;
    let count = 1;
    let globalForce = Infinity;
    let coolingFactor = getCoolingFactor(maxIterations, count);
    let gravityConstant = 0.01; // A small gravitational constant
    let centerOfGravity = { x: canvasWidth/2, y: canvasHeight/2 }; // This could be the center of your graph area

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
}

function getCoolingFactor(maxIterations, count) {
    const inflection = 2.2 // The larger, the more bent downwards
    return Math.max(Math.exp((-inflection/maxIterations)*count), 1e-5);
}

document.getElementById("drawButton").addEventListener("click", () => {
    console.log("Diagram drawn")
    clearCanvas()
    drawLines()
    drawElements()
})

document.getElementById("optimizeButton").addEventListener("click", () => {
    console.log("Optimized forces")
    optimizeNodePositions()
})

document.getElementById("logButton").addEventListener("click", () => {
    console.log(diagramGraph)
})

document.getElementById("centerButton").addEventListener("click", () => {
    console.log("Diagram centered and redrawn")
    centerGraph()
    clearCanvas()
    drawLines()
    drawElements()
})

function centerGraph() {
    // Calculate the current centroid among all points
    let centerX = 0;
    let centerY = 0;
    const nodes = diagramGraph.getAllNodesWithData();

    for (const node of nodes) {
        const position = node.data.position;
        centerX += position.x;
        centerY += position.y;
    }

    if (nodes.length > 0) {
        centerX /= nodes.length;
        centerY /= nodes.length;
    }

    // Calculate the displacement to the current center of the canvas
    const displacementX = canvasWidth / 2 - centerX;
    const displacementY = canvasHeight / 2 - centerY;

    // Add the displacement to every point in the graph
    for (const node of nodes) {
        const nodeName = node.name
        diagramGraph.getNodeData(nodeName).position.x += displacementX;
        diagramGraph.getNodeData(nodeName).position.y += displacementY;
    }
}
