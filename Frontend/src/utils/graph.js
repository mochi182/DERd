// graph.js
export class Graph {
    constructor() {
        this.nodes = new Map();
        this.repulsionConstant = 200; //
        this.springConstant = 30;
        this.springLength = 100;
        this.repulsionLength = 50;
    }
    
    // Add a node to the graph
    addNode(node, data) {
        this.nodes.set(node, { data });
    }
    
    // Add an edge between two nodes
    addEdge(node1, node2) {
        if (!this.nodes.has(node1) || !this.nodes.has(node2)) {
            throw new Error('Both nodes must exist in the graph.');
        }
        
        this.nodes.get(node1).data.neighbors.push(node2);
        this.nodes.get(node2).data.neighbors.push(node1); // For an undirected graph
    }
    
    // Get the neighbors of a node
    getNeighbors(node) {
        if (!this.nodes.has(node)) {
            throw new Error('Node does not exist in the graph.');
        }
        
        return this.nodes.get(node).data.neighbors;
    }
    
    // Get the data associated with a node
    getNodeData(node) {
        if (!this.nodes.has(node)) {
            throw new Error('Node does not exist in the graph.');
        }
        
        return this.nodes.get(node).data;
    }
    
    // Get all nodes in the graph
    getAllNodes() {
        return Array.from(this.nodes.keys());
    }
    
    // Get all nodes in the graph with data
    getAllNodesWithData() {
        const allNodesWithData = this.getAllNodes().map((node) => ({
            name: node,
            data: this.getNodeData(node),
        }));
        
        return allNodesWithData;
    }
    
    // Calculate the attractive forces on a node
    calculateForce(node, axis) {
        let totalForces = 0;
        for (const otherNode of this.getAllNodes()) {
            if (node !== otherNode) {
                const displacement = this.calculateDisplacement(node, otherNode, axis);
                const distance = Math.abs(displacement)
                let randomSign = Math.random() < 0.5 ? -1 : 1;
                const direction =  distance > 1e-5 ? displacement/distance : randomSign;

                //let attractiveForce = -1 * direction * (distance/this.springLength**2);
                //let repulsiveForce = direction * this.springLength**2 / Math.max(distance, 1e-5)
                //let repulsiveForce = direction * 7 * Math.max(0, Math.log(Math.max((this.repulsionConstant / distance), 1e-5)))
                //let repulsiveForce = direction * this.repulsionConstant / Math.max(distance**2, 1e-5)
                //let repulsiveForce = (this.repulsionConstant / Math.max(distance**2, 1e-5)) * direction * 75 * Math.exp(-2*distance/this.repulsionLength);

                // direction * 10 * Math.exp(50/(distance+20))
                // (this.repulsionConstant / Math.max(distance**0.5, 1e-5)) * 0.08

                //let repulsiveForce = direction * 10 * Math.exp(50/(distance+20)) //* 0.1
                //let repulsiveForce = direction * (100 / Math.max((distance+70)**0.9, 1e-5)) ** 5.5 // OK
                
                let repulsiveForce = 0
                let attractiveForce = 0

                if (this.areNodesRelated(node, otherNode)){
                    // attractiveForce = -1 * direction * 20 * Math.log(Math.max((distance / 100), 1e-5)); // OK
                    attractiveForce = -1 * direction * (((distance + 1000)**2)/this.springLength)**0.5
                    repulsiveForce = direction * ((this.springLength**2)/(distance + 50))**1.12
                }  else {
                    if (distance < this.springLength) {
                        repulsiveForce = direction * ((this.springLength**1.6485)/(distance + 10))+18
                    }
                }
            
                //console.log(attractiveForce, repulsiveForce)
                totalForces += attractiveForce + repulsiveForce;
            }
        }
        return totalForces;
    }
    
    // Helper method to check if two nodes are related (connected in the graph)
    areNodesRelated(node1, node2) {
        return this.getNeighbors(node1).includes(node2) || this.getNeighbors(node2).includes(node1);
    }
    
    // Calculate the displacement between two nodes in a specific axis (X or Y)
    calculateDisplacement(node1, node2, axis) {
        const data1 = this.getNodeData(node1);
        const data2 = this.getNodeData(node2);
        
        return data1.position[axis] - data2.position[axis];
    }

    connectAttributesInCircle() {
        // Get all nodes from the graph
        const nodes = this.getAllNodesWithData();
    
        // Iterate through the nodes
        for (const node of nodes) {
            const nodeName = node.name

            // Check if the node is a table (you can define a condition here based on your data)
            if (nodeName.includes("(Table)")) {

                const neighbors = this.getNeighbors(nodeName);
    
                if (neighbors.length > 1) {
                    // Connect the neighbors in a circular manner
                    for (let i = 0; i < neighbors.length; i++) {
                        const sourceNode = neighbors[i];
                        const targetNode = neighbors[(i + 1) % neighbors.length];
    
                        // Add an edge between sourceNode and targetNode
                        this.addEdge(sourceNode, targetNode);
                    }
                }
            }
        }
    }
    
    repositionRelationship(node) {
        let relData = this.getNodeData(node)
        let middleX = 0
        let middleY = 0
        relData.neighbors.forEach((neighbor) => {
            const neighborData = this.getNodeData(neighbor);
            middleX += neighborData.position.x
            middleY += neighborData.position.y
        })
        relData.position.x = middleX/relData.neighbors.length
        relData.position.y = middleY/relData.neighbors.length
    }

    centerGraph() {
        // Calculate the current centroid among all points
        let centerX = 0;
        let centerY = 0;
        const nodes = this.getAllNodesWithData();
    
        for (const node of nodes) {
            const position = node.data.position;
            centerX += position.x;
            centerY += position.y;
        }
    
        if (nodes.length > 0) {
            centerX /= nodes.length;
            centerY /= nodes.length;
        }
    
        // Calculate the displacement to the current center
        const displacementX = 1000 / 2 - centerX;
        const displacementY = 1000 / 2 - centerY;
    
        // Add the displacement to every point in the graph
        for (const node of nodes) {
            const nodeName = node.name
            this.getNodeData(nodeName).position.x += displacementX;
            this.getNodeData(nodeName).position.y += displacementY;
        }
    }
    
}