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
