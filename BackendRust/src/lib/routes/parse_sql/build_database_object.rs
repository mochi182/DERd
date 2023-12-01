
use std::collections::HashMap;

struct Table {
    attributes: Vec<String>,
    pk: Vec<String>,
    is_joint: bool,
}

struct Relationship {
    table: String,
    referenced_table: String,
    attribute: String,
    referenced_attribute: String,
    r#type: String,
}

struct DatabaseObject {
    tables: HashMap<String, Table>,
    relationships: HashMap<String, Relationship>,
}

pub fn build_database_object(ast: Vec<struct>) -> DatabaseObject {
    let mut database_object = DatabaseObject {
        tables: HashMap::new(),
        relationships: HashMap::new(),
    };

    for statement in ast.statements {
        match statement {
            CreateTable { name, columns, constraints, .. } => {
                let mut attributes = Vec::new();
                let mut pk = Vec::new();
                let mut is_joint = false;

                for column in columns {
                    // Extract attribute name and type from the column
                    let attribute_name = column.name;
                    let attribute_type = column.data_type;

                    // Add the attribute to the list
                    attributes.push(attribute_name);

                    // Check if the attribute is part of the primary key
                    if constraints.contains(attribute_name) {
                        pk.push(attribute_name.clone());
                    }
                }

                // Check if it's a joint table
                if pk.len() > 1 {
                    is_joint = true;
                }

                let table = Table {
                    attributes,
                    pk,
                    is_joint,
                };

                // Add the table to the database object
                database_object.tables.insert(name.clone(), table);
            }
            AlterTable { name, operations, .. } => {
                for operation in operations {
                    match operation {
                        AddConstraint(Unique { columns, .. }) => {
                            // Check if it's a primary key constraint
                            if let Some(pk) = &mut database_object.tables.get_mut(&name).map(|t| &mut t.pk) {
                                pk.extend(columns.clone());
                            }
                        }
                        AddConstraint(ForeignKey { columns, foreign_table, referred_columns, .. }) => {
                            // Determine the relationship type
                            let r#type = determine_relationship_type(&name, &foreign_table, &columns[0], &referred_columns[0], &database_object);

                            // Create a relationship
                            let relationship = Relationship {
                                table: name.clone(),
                                referenced_table: foreign_table.clone(),
                                attribute: columns[0].clone(),
                                referenced_attribute: referred_columns[0].clone(),
                                r#type,
                            };

                            // Add the relationship to the database object
                            let relationship_name = format!("{}V{}", &name, &foreign_table);
                            database_object.relationships.insert(relationship_name, relationship);
                        }
                        _ => {}
                    }
                }
            }
            _ => {}
        }
    }

    database_object
}

fn determine_relationship_type(table: &str, referenced_table: &str, attribute: &str, referenced_attribute: &str, database_object: &DatabaseObject) -> String {
    // Determine the relationship type based on the primary keys
    // ...
}
