// Initialize your canvas and context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Function to draw a rectangle
function drawRectangle(x1, y1, x2, y2, color = "black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
}

// Function to draw a rhomboid (diamond shape)
function drawRhomboid(x, y, width, height, color = "black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height / 2);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x, y + height / 2);
    ctx.lineTo(x + width / 2, y);
    ctx.stroke();
}

// Function to draw an ellipse
function drawEllipse(x, y, width, height, color = "black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
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
const canvasWidth = 550;
const canvasHeight = 550;

// Set up the canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Function to draw the tables as rectangles, attributes as ellipses, and relationships as rhomboids
function drawElements() {
    // Create an array to store the positions of elements
    const elementPositions = [];

    // Calculate the spacing between elements
    const spacingX = 120; // Horizontal spacing
    const spacingY = 60; // Vertical spacing

    let currentX = 30; // Initial X position
    let currentY = 30; // Initial Y position

    // Loop through the tables in queryObject
    for (const [tableName, _] of Object.entries(queryObject.tables)) {
        // Draw the table as a rectangle
        const tableWidth = 100; // Width of the table rectangle
        const tableHeight = 50; // Height of the table rectangle
        drawRectangle(currentX, currentY, currentX + tableWidth, currentY + tableHeight, "blue");

        // Draw the table name as text within the table rectangle
        drawLabel(currentX, currentY, currentX + tableWidth, currentY + tableHeight, tableName, "black");

        // Store the position of the table
        elementPositions[tableName] = { x: currentX, y: currentY };

        // Move to the next position
        currentY += spacingY
        if (currentY > (canvasHeight - 100)) {
            currentY = 30
            currentX += spacingX
        }
    }

    // Loop through the tables and their attributes
    for (const tableName in queryObject.tables) {
        const table = queryObject.tables[tableName];

        // Loop through the attributes of the table
        for (const attributeName in table.attributes) {

            // Draw the attribute as an ellipse
            const attributeWidth = 80; // Width of the ellipse
            const attributeHeight = 40; // Height of the ellipse
            const centerX = currentX + attributeWidth / 2;
            const centerY = currentY + attributeHeight / 2;
            drawEllipse(currentX, currentY, attributeWidth, attributeHeight, "green");

            // Draw the attribute name as text within the ellipse
            drawLabel(currentX, currentY, currentX + attributeWidth, currentY + attributeHeight, attributeName, "black");

            // Store the position of the attribute
            elementPositions[`${tableName}.${attributeName}`] = { x: centerX, y: centerY };

            // Move to the next position
            currentY += spacingY
            if (currentY > (canvasHeight - 100)) {
                currentY = 30
                currentX += spacingX
            }
        }
    }

    // Loop through the relationships in queryObject
    for (const relationshipName in queryObject.relationships) {
        // Draw the relationship as a rhomboid
        const relationshipWidth = 80; // Width of the rhomboid
        const relationshipHeight = 80; // Height of the rhomboid
        const centerX = currentX + relationshipWidth / 2;
        const centerY = currentY + relationshipHeight / 2;
        drawRhomboid(currentX, currentY, relationshipWidth, relationshipHeight, "red");

        // Draw the relationship name as text within the rhomboid
        drawLabel(currentX, currentY, currentX + relationshipWidth, currentY + relationshipHeight, relationshipName, "black");

        // Store the position of the relationship
        elementPositions[relationshipName] = { x: centerX, y: centerY };

        // Move to the next position
        currentY += spacingY + 40
        if (currentY > (canvasHeight - 100)) {
            currentY = 30
            currentX += spacingX
        }
    }
}