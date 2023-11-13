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

// Function to draw text within a shape
function drawLabel(x1, y1, x2, y2, label = "", color = "grey") {
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    const xc = x1 + Math.round((x2 - x1) / 2);
    const yc = y1 + Math.round((y2 - y1) / 2);
    ctx.font = "12px Arial";
    ctx.fillText(label, xc, yc);
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
const canvasWidth = 1000;
const canvasHeight = 1000;

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

        // Draw nodes based on their type (Table or Attribute)
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
        } else if (nodeName.includes("(Attribute)")) {
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
                "black"
            );
        }
    });
}


document.getElementById("drawButton").addEventListener("click", () => {
    drawLines()
    drawElements();
})