import { generateId } from "./helperFunctions"

export function createGraph($globalState) {

    console.log($globalState)

    // Iterate through tables and attributes
    for (const tableName in $globalState.uploadedData.tables) {
        // Add a node for the table
        const tableNode = `${tableName} (Table)`;
        $globalState.graph.addNode(tableNode, {
            id: generateId(),
            label: tableName,
            position: {
                x: Math.random() * (900 - 100) + 100,
                y: Math.random() * (900 - 100) + 100,
            },
            neighbors: [],
            isPK: false
        });
        
        // Add nodes for attributes
        let attributeList = $globalState.uploadedData.tables[tableName].attributes;
        attributeList.forEach ((attributeName) => {
            const attributeNode = `${attributeName} (Attribute of ${tableName})`;
            $globalState.graph.addNode(attributeNode, {
                id: generateId(),
                label: attributeName,
                position: {
                    x: Math.random() * (900 - 100) + 100,
                    y: Math.random() * (900 - 100) + 100,
                },
                neighbors: [],
                isPK: true ? true : false
            });
            
            // Add an edge between the table node and attribute node
            $globalState.graph.addEdge(tableNode, attributeNode);
        });
    }
    
    // Iterate through relationships and add edges between related entities
    for (const relationshipName in $globalState.uploadedData.relationships) {
        const relationship = $globalState.uploadedData.relationships[relationshipName];
        const tableNode = `${relationship.table} (Table)`;
        const referencedTableNode = `${relationship.referenced_table} (Table)`;
        
        // Calculate the middle position between the related tables
        const tablePosition = $globalState.graph.getNodeData(tableNode).position;
        const referencedTablePosition = $globalState.graph.getNodeData(referencedTableNode).position;
        const middleX = (tablePosition.x + referencedTablePosition.x) / 2;
        const middleY = (tablePosition.y + referencedTablePosition.y) / 2;
        
        // Add a node for the relationship
        const relationshipNode = `${relationshipName} (Relationship)`;
        $globalState.graph.addNode(relationshipNode, {
            id: generateId(),
            label: relationshipName,
            position: {
                x: middleX,
                y: middleY,
            },
            neighbors: [],
            isPK: false
        });
        
        // Add edges between related entities
        $globalState.graph.addEdge(tableNode, relationshipNode, { label: relationshipName });
        $globalState.graph.addEdge(referencedTableNode, relationshipNode, { label: relationshipName });
    }
    
    $globalState.graph.connectAttributesInCircle()
}