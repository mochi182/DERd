/* ----- Input ----- */

// Get all nodes and their data button
document.getElementById("calculateGraphButton").addEventListener("click", () => {
    console.log("Created graph")
    calculateGraph()
});

// Log graph button
document.getElementById("logButton").addEventListener("click", () => {
    console.log(diagramGraph)
})

// Optimize forces button
document.getElementById("optimizeButton").addEventListener("click", () => {
    console.log("Optimized forces")
    optimizeNodePositions()
})

// Draw button
document.getElementById("drawButton").addEventListener("click", () => {
    centerGraph()
    addLinesToDrawStack()
    addNodesToDrawStack()
    redraw()
    console.log("Diagram drawn")
})