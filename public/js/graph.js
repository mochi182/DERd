class Graph {
    constructor() {
        this.nodes = new Map();
        this.repulsionConstant = 2;
        this.springConstant = 1;
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
        
        console.log(this.nodes.get(node1))
        this.nodes.get(node1).data.neighbors.push(node2);
        this.nodes.get(node2).data.neighbors.push(node1); // For an undirected graph
    }
    
    // Get the neighbors of a node
    getNeighbors(node) {
        if (!this.nodes.has(node)) {
            throw new Error('Node does not exist in the graph.');
        }
        
        return this.nodes.get(node).neighbors;
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
        const allNodesWithData = diagramGraph.getAllNodes().map((node) => ({
            name: node,
            data: diagramGraph.getNodeData(node),
        }));
        
        return allNodesWithData;
    }
    
    // Calculate the attractive forces on a node
    calculateAttractiveForces(node, axis) {
        let attractiveForces = 0;
        for (const otherNode of this.getAllNodes()) {
            if (node !== otherNode) {
                const distance = this.calculateDistance(node, otherNode, axis);
                attractiveForces += this.springConstant * Math.log(Math.abs(distance) / this.springLength);
            }

            if (!this.areNodesRelated(node, otherNode)) {
                let repulsiveForce = calculateRepulsiveForce(node, otherNode)
                attractiveForces -= repulsiveForce
            }
        }
        return attractiveForces;
    }
    
    // Calculate the repulsive forces on a node in a specific axis (X or Y)
    calculateRepulsiveForces(node, axis) {
        let repulsiveForce = 0;
        for (const otherNode of this.getAllNodes()) {
            if (node !== otherNode) {
                const distance = this.calculateDistance(node, otherNode, axis);
                repulsiveForce += (-1) * this.repulsionConstant / (distance * distance);
            }

        }
        return repulsiveForce;
    }

    // Calculate a single repulsive force between 2 nodes on a specific axis (X or Y)
    calculateRepulsiveForce(node, otherNode, axis) {
        const distance = this.calculateDistance(node, otherNode, axis);
        let repulsiveForce = (-1) * this.repulsionConstant / (distance * distance);
        return repulsiveForce;
    }
    
    // Calculate the total force on a node (sum of attractive and repulsive forces) in a specific axis (X or Y)
    calculateForce(node, axis) {
        let repulsiveForces = this.calculateRepulsiveForces(node, axis);
        let attractiveForces = this.calculateAttractiveForces(node, axis);
        
        return repulsiveForces + attractiveForces;
    }
    
    // Helper method to check if two nodes are related (connected in the graph)
    areNodesRelated(node1, node2) {
        return this.getNeighbors(node1).includes(node2) || this.getNeighbors(node2).includes(node1);
    }
    
    // Calculate the distance between two nodes in a specific axis (X or Y)
    calculateDistanceInAxis(node1, node2, axis) {
        const data1 = this.getNodeData(node1);
        const data2 = this.getNodeData(node2);
        
        return data2.position[axis] - data1.position[axis];
    }
    
}

var diagramGraph = new Graph();

// Get all nodes and their data
document.querySelector("#printGraphButton").addEventListener("click", () => {
    
    // Iterate through tables and attributes
    for (const tableName in queryObject.tables) {
        // Add a node for the table
        const tableNode = `${tableName} (Table)`;
        diagramGraph.addNode(tableNode, {
            label: tableName,
            position: {
                x: Math.random() * 1000,
                y: Math.random() * 1000,
            },
            neighbors: []
        });
        
        // Add nodes for attributes
        for (const attributeName in queryObject.tables[tableName].attributes) {
            const attributeNode = `${attributeName} (Attribute)`;
            diagramGraph.addNode(attributeNode, {
                label: attributeName,
                position: {
                    x: Math.random() * 1000,
                    y: Math.random() * 1000,
                },
                neighbors: []
            });
            
            // Add an edge between the table node and attribute node
            diagramGraph.addEdge(tableNode, attributeNode);
        }
    }
    
    const allNodesWithData = diagramGraph.getAllNodesWithData()
    console.log('All nodes with data:', allNodesWithData);    
});