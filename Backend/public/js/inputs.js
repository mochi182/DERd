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
    optimizeNodePositions()
    console.log("Optimized forces")
})

// Draw button
document.getElementById("drawButton").addEventListener("click", () => {
    centerGraph()
    addLinesToDrawStack()
    addNodesToDrawStack()
    //console.log(redrawStack)
    redraw()
    console.log("Diagram drawn")
})