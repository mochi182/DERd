export function optimize($globalState) {
    let maxIterations = 10000;
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
        $globalState.graph.getAllNodes().forEach((node) => {
            let xForce = $globalState.graph.calculateForce(node, "x");
            let yForce = $globalState.graph.calculateForce(node, "y");

            // Add gravity force towards the center of gravity
             let nodeData = $globalState.graph.getNodeData(node);
            let distanceToCenterX = centerOfGravity.x - nodeData.position.x;
            let distanceToCenterY = centerOfGravity.y - nodeData.position.y;
            xForce += gravityConstant * distanceToCenterX;
            yForce += gravityConstant * distanceToCenterY;  

            globalForce += Math.sqrt((xForce**2) + (yForce**2));
            currentForces[node] = {"xForce": xForce, "yForce": yForce};
        });

        // Apply forces to update node positions
        $globalState.graph.getAllNodes().forEach((node) => {
            if (!node.includes("(Relationship)")) {
                $globalState.graph.getNodeData(node).position.x += currentForces[node].xForce * coolingFactor;
                $globalState.graph.getNodeData(node).position.y += currentForces[node].yForce * coolingFactor;
            } else {
                $globalState.graph.repositionRelationship(node)
            }
        });

        count += 1;
        coolingFactor = getCoolingFactor(maxIterations, count);
        //coolingFactor = 1 / Math.sqrt(count);
        //console.log(count, globalForce.toFixed(5));

    }
    //console.log(count, globalForce.toFixed(5))
}

function getCoolingFactor(maxIterations, count) {
    const inflection = 2 // The larger, the more bent downwards
    return Math.max(Math.exp((-inflection/maxIterations)*count), 1e-5);
}