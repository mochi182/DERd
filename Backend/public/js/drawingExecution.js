/* ----- Drawwww -----*/

// Function to draw the tables as rectangles, attributes as ellipses, and relationships as Rhombuss
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

                // Generate a unique id that will be used when drawing the Xml
                const lineId = generateId() // `${nodeData.label}-${neighbor.label}-line`

                // Get the position of the current node
                const startX = nodeData.position.x;
                const startY = nodeData.position.y;

                // Get the position of the neighbor node
                const neighborData = diagramGraph.getNodeData(neighbor)
                const endX = neighborData.position.x;
                const endY = neighborData.position.y;

                // Add line draw to stack
                redrawStack[lineId] = {
                    Svg: createSvgLine,
                    Xml: createXmlLine,
                    params: [startX, startY, endX, endY, "", nodeData.id, neighborData.id]
                }
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
            redrawStack[nodeData.id] = {
                Svg: createSvgRectangle,
                Xml: createXmlRectangle,
                params: [
                    nodeData.position.x,
                    nodeData.position.y,
                    90,
                    40,
                    nodeData.label
                ]
            }
        } else if (nodeName.includes("Attribute of")) {
            // Add ellipse draw to stack
            redrawStack[nodeData.id] = {
                Svg: createSvgEllipse,
                Xml: createXmlEllipse,
                params: [
                    nodeData.position.x,
                    nodeData.position.y,
                    38,
                    25,
                    nodeData.label,
                    nodeData.isPK
                ]
            }
        } else if (nodeName.includes("(Relationship)")) {
            // Add Rhombus to draw stack
            redrawStack[nodeData.id] = {
                Svg: createSvgRhombus,
                Xml: createXmlRhombus,
                params: [
                    nodeData.position.x,
                    nodeData.position.y,
                    70,
                    70,
                    nodeData.label
                ]
            }
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