class Graph {
    constructor() {
        this.nodes = new Map();
        this.repulsionConstant = 55; //
        this.springConstant = 2;
        this.springLength = 50;
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
                let repulsiveForce = 0

                //let repulsiveForce = direction * 7 * Math.max(0, Math.log(Math.max((this.repulsionConstant / distance), 1e-5)))

                let attractiveForce = 0
                //let repulsiveForce = direction * this.repulsionConstant / Math.max(distance**2, 1e-5)

                if (this.areNodesRelated(node, otherNode)){
                    attractiveForce = -1 * direction * this.springConstant * Math.log(Math.max((distance / this.springLength), 1e-5));
                } else {
                    repulsiveForce = direction * 2 * Math.exp(-35 * distance*(0.45/1000))
                }
            
                //console.log(attractiveForce, repulsiveForce)
                totalForces += attractiveForce + repulsiveForce;
            }
        }
        return totalForces;
    }

    rangeCutoff(bottom, top, num) {
        if (num < bottom) {
            return bottom
        } else if (num > top) {
            return top
        } else {
            return num
        }
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
    
    
}

var diagramGraph = new Graph();

// Get all nodes and their data
document.querySelector("#calculateGraphButton").addEventListener("click", () => {
    
    // Iterate through tables and attributes
    for (const tableName in queryObject.tables) {
        // Add a node for the table
        const tableNode = `${tableName} (Table)`;
        diagramGraph.addNode(tableNode, {
            label: tableName,
            position: {
                x: Math.random() * (900 - 100) + 100,
                y: Math.random() * (900 - 100) + 100,
            },
            neighbors: []
        });
        
        // Add nodes for attributes
        for (const attributeName in queryObject.tables[tableName].attributes) {
            const attributeNode = `${attributeName} (Attribute)`;
            diagramGraph.addNode(attributeNode, {
                label: attributeName,
                position: {
                    x: Math.random() * (900 - 100) + 100,
                    y: Math.random() * (900 - 100) + 100,
                },
                neighbors: []
            });
            
            // Add an edge between the table node and attribute node
            diagramGraph.addEdge(tableNode, attributeNode);
        }
    }
    
    const allNodesWithData = diagramGraph.getAllNodesWithData()
    console.log("Calculated graph")
    //console.log('All nodes with data:', allNodesWithData);   
    
    // Test: Connecting all attributes circularly
    //diagramGraph.connectAttributesInCircle()
});