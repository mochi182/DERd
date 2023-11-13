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
    
    // Calculate the repulsive force on a node
    calculateRepulsiveForces(node) {
        let repulsiveForce = 0;
        for (const otherNode of this.getAllNodes()) {
            if (node !== otherNode) {
                const distance = this.calculateEuclideanDistance(node, otherNode);
                repulsiveForce += (-1) * this.repulsionConstant / (distance * distance);
            }
        }
        return repulsiveForce;
    }
    
    // Calculate the attractive force on a node
    calculateAttractiveForces(node) {
        let attractiveForce = 0;
        for (const otherNode of this.getAllNodes()) {
            if (node !== otherNode && this.areNodesRelated(node, otherNode)) {
                const distance = this.calculateEuclideanDistance(node, otherNode);
                attractiveForce += this.springConstant * Math.log(Math.abs(distance) / this.springLength);
            }
        }
        return attractiveForce;
    }
    
    // Calculate the total force on a node (sum of attractive and repulsive forces)
    calculateForce(node) {
        const repulsiveForce = this.calculateRepulsiveForces(node);
        let attractiveForce = this.calculateAttractiveForces(node);
        
        // Subtract the repulsive forces from nodes that are not related to the current node
        for (const otherNode of this.getAllNodes()) {
            if (node !== otherNode && !this.areNodesRelated(node, otherNode)) {
                const repulsiveForceOther = this.calculateRepulsiveForces(otherNode);
                attractiveForce -= repulsiveForceOther;
            }
        }
        
        return repulsiveForce + attractiveForce;
    }
    
    // Helper method to calculate Euclidean distance between two nodes
    calculateEuclideanDistance(node1, node2) {
        // You can implement this function based on the positions of the nodes.
        // For example, if nodes have { x, y } properties, you can calculate the distance.
        const data1 = this.getNodeData(node1);
        const data2 = this.getNodeData(node2);
        const dx = data1.position.x - data2.position.x;
        const dy = data1.position.y - data2.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Helper method to check if two nodes are related (connected in the graph)
    areNodesRelated(node1, node2) {
        return this.getNeighbors(node1).includes(node2) || this.getNeighbors(node2).includes(node1);
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