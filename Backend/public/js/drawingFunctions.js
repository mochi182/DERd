// Function to draw a rectangle
function drawRectangle(ctx, x1, y1, x2, y2, color = "black") {
    ctx.fillStyle = 'lightGrey';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
}

// Function to draw a rhomboid (diamond shape)
function drawRhomboid(ctx, x, y, width, height, color = "black") {
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
function drawEllipse(ctx, x, y, width, height, color = "black") {
    ctx.fillStyle = 'lightGrey';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
}

// Function to draw a line between two points
function drawLine(ctx, x1, y1, x2, y2, color = "black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Function to draw text within a shape with an optional underline
function drawLabel(ctx, x1, y1, x2, y2, label = "", color = "grey", underline = false) {
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
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ----- Redraw stack ----- */

/* // Create an empty stack to store the elements that need to be redrawn
var redrawStack = {};

// Redraw the elements in the redraw stack
function redraw() {
    // Clear the canvas
    clearCanvas(ctx);
    // Redraw all the elements in the redraw stack
    for (const thing in redrawStack) {
        redrawStack[thing]();
    }
}

// Clear the redraw stack
function clear_redraw_stack() {
    redrawStack = {};
}
 */