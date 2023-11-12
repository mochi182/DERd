   
   // Get references to form elements
   const queryForm = document.getElementById("queryForm");
   const writeQueryDiv = document.getElementById("writeQueryDiv");
   const uploadQueryDiv = document.getElementById("uploadQueryDiv");
   
   // Event listener for radio button change
   queryForm.addEventListener("change", function () {
    const selectedQueryType = document.querySelector('input[name="queryType"]:checked').value;
    if (selectedQueryType === "write") {
        writeQueryDiv.style.display = "block";
        uploadQueryDiv.style.display = "none";
    } else if (selectedQueryType === "upload") {
        writeQueryDiv.style.display = "none";
        uploadQueryDiv.style.display = "block";
    }
});

var queryObject = {
    tables: {},
    relationships: {},
};

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Check which query type is selected
    const selectedQueryType = document.querySelector('input[name="queryType"]:checked').value;
    
    if (selectedQueryType === "write") {
        // If "Write query" is selected, get the query from the textarea
        const queries = document.querySelector("#queryText").value
        .split(';')
        .filter((query) => query.trim() != '')
        .map((query) => 
        query.replaceAll('\n', ' ')
        .replaceAll('`', '')
        .replace(/\s+/g, ' ')
        .replaceAll(' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci', '')
        );
        
        let splitQueries = [];
        
        for (const query of queries) {
            if (query.includes("ALTER TABLE") && query.includes("PRIMARY KEY")) {
                splitQueries.push(query.split(', ADD KEY')[0])
            } else if (query.includes("ALTER TABLE") && query.includes("FOREIGN KEY")) {
                if (query.includes("CONSTRAINT")) {
                    const toRemoveRegex = /(CONSTRAINT [^`||^ ]+)/g;
                    const modifiedQuery = query.replaceAll(toRemoveRegex, '')
                    .replaceAll(',', '')
                    .split('ADD')
                    .slice(1, length-1)
                    .map((query) => 'ALTER TABLE events ADD ' + query.trim());
                    splitQueries.push(...modifiedQuery);
                } else {
                    splitQueries.push(query);
                }
            } else if (query.includes("CREATE TABLE")) {
                splitQueries.push(query);
            }
        }
        
        splitQueries = splitQueries.map((query) => query.trim() + ';')
        
        for (const query of splitQueries) {
            console.log(query)
            parseSQLQuery(query)
        }
        console.log(queryObject);
        
    } else if (selectedQueryType === "upload") {
        // If "Upload SQL file" is selected, handle the file upload
        // You can add code here to handle the file upload if needed
    }
});

function parseSQLQuery(query) {
    
    const createTableRegex = /CREATE TABLE (\w+) \(([\s\S]*?)\);/g;
    const alterTableFKRegex = /ALTER TABLE (\w+) ADD FOREIGN KEY \(([\s\S]*?)\) REFERENCES (\w+) \(([\s\S]*?)\);/g;
    const alterTablePKRegex = /ALTER TABLE (\w+) ADD PRIMARY KEY \(([\s\S]*?)\);/g;
    
    const jointTables = {}; // Track joint tables
    let match;
    
    while ((match = createTableRegex.exec(query))) {
        const tableName = match[1];
        const PK = [];
        let isJoint = false;
        const attributes = {};
        const attributeDeclarations = match[2].split(',').map(attribute => attribute.trim());
        
        for (const attrDecl of attributeDeclarations) {
            if (attrDecl.toUpperCase().includes('PRIMARY KEY')) {
                // Handle PRIMARY KEY declaration
                const attrName = attrDecl.split(' ').pop().trim().replace('(', '').replace(')', '').split(',');
                PK.push(...attrName);
                if (PK.length > 2) {
                    isJoint = true;
                }
            } else {
                // Split attribute declaration into name and type
                const [attrName, attrType] = attrDecl.split(/\s+/);
                attributes[attrName] = attrType;
            }
        }
        
        queryObject.tables[tableName] = { attributes, PK, isJoint };
        
        // Track joint tables
        if (isJoint) {
            jointTables[tableName] = true;
        }
    }
    
    while ((match = alterTableFKRegex.exec(query))) {
        const tableName = match[1];
        const attributes = match[2].split(',').map(attribute => attribute.trim());
        const referencedTable = match[3];
        const referencedAttributes = match[4].split(',').map(attribute => attribute.trim());
        
        // Give name to the relationship
        let relationshipName;
        if (jointTables[tableName]) {
            relationshipName = tableName;
        } else {
            relationshipName = tableName + 'VS' + referencedTable;
        }
        
        // Create a relationship for each attribute altered
        for (let i = 0; i < attributes.length; i++) {
            const attribute = attributes[i];
            const referencedAttribute = referencedAttributes[i];
            const type = determineRelationshipType(tableName, referencedTable, attribute, referencedAttribute, queryObject);
            
            // If the relationship doesn't exist, add it. Else, if it is of type M:N, change the table name so that the relationship only points to referenced tables
            if (!queryObject.relationships[relationshipName]) {
                queryObject.relationships[relationshipName] = { table: tableName, referencedTable, attribute, referencedAttribute, type };
            } else if (type == "M:N") {
                queryObject.relationships[relationshipName].table = referencedTable;
            }
        }
    }
    
    while ((match = alterTablePKRegex.exec(query))) {
        const tableName = match[1];
        const attributeNames = match[2].split(',').map(attribute => attribute.trim());
        
        // Check if tableName is a jointTable
        if (jointTables[tableName]) {
            if (!queryObject.tables[tableName].PK) {
                queryObject.tables[tableName].PK = [];
            }
            queryObject.tables[tableName].PK.push(...attributeNames);
        } else {
            queryObject.tables[tableName].PK = attributeNames;
        }
    }
    
    // return queryObject;
}

function determineRelationshipType(tableName, referencedTable, attribute, referencedAttribute, queryObject) {
    try {
        if (queryObject.tables[tableName].PK.includes(attribute) && queryObject.tables[referencedTable].PK.includes(referencedAttribute)) {
            if (queryObject.tables[tableName].isJoint) {
                return 'M:N';
            } else {
                return '1:1';
            }
        } else if (!queryObject.tables[tableName].PK.includes(attribute) && queryObject.tables[referencedTable].PK.includes(referencedAttribute)) {
            return '1:M';
        } else {
            return ''; // Handle other cases if needed
        }
    } catch (error) {
        console.log(error)
    }
}