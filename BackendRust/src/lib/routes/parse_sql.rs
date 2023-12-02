use serde::{Serialize, Deserialize};
use axum::extract::Json;
use serde_json::{json, Value};
use sqlparser::dialect::MySqlDialect;
use sqlparser::parser::Parser;
use sqlparser::ast::{TableConstraint, AlterTableOperation, Statement};

use std::collections::HashMap;

#[derive(Serialize)]
struct Entity {
    attributes: Vec<String>,
    pk: Vec<String>,
    is_joint: bool,
}

#[derive(Serialize)]
struct Relationship {
    table: String,
    referenced_table: String,
    attribute: String,
    referenced_attribute: String,
    r#type: String,
}

#[derive(Serialize)]
pub struct DatabaseObject {
    tables: HashMap<String, Entity>,
    relationships: HashMap<String, Relationship>,
}

#[derive(Serialize)]
pub struct ParsedSqlResponse {
    object: Value,
    message: String,
}

pub async fn parse_sql(body: String) -> Json<ParsedSqlResponse> {
    let sql = body.as_str();

    let dialect: MySqlDialect = MySqlDialect {};
    match Parser::parse_sql(&dialect, sql) {
        Ok(ast) => {
            print_type_of(&ast);
            let database_object: DatabaseObject = build_database_object(ast);
            let ast_json = serde_json::to_value(database_object).unwrap();
            Json(ParsedSqlResponse {
                object: ast_json,
                message: "Parsed successfully".to_owned(),
            })
        }
        Err(e) => Json(ParsedSqlResponse {
            object: Value::Null,
            message: format!("Error parsing SQL: {}", e),
        }),
    }
}


fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

fn build_database_object(ast: Vec<Statement>) -> DatabaseObject {
    let mut database_object = DatabaseObject {
        tables: HashMap::new(),
        relationships: HashMap::new(),
    };

    for statement in ast {
        match statement {
            Statement::CreateTable { name, columns, constraints, .. } => {
                let mut attributes = Vec::new();
                let mut pk = Vec::new();
                let mut is_joint = false;
    
                for column in columns {
                    let attribute_name = column.name;
                    let attribute_type = column.data_type;
    
                    attributes.push(format!("{}: {}", attribute_name, attribute_type));
                }
    
                for constraint in constraints {
                    if let TableConstraint::Unique { is_primary, columns, .. } = constraint {
                        if is_primary {
                            for column in columns {
                                pk.push(column.to_string());
                            }
                        }
                    }
                }
    
                if pk.len() > 1 {
                    is_joint = true;
                }
    
                let entity = Entity {
                    attributes,
                    pk,
                    is_joint,
                };
    
                database_object.tables.insert(name.to_string(), entity);
            }
            
            Statement::AlterTable { name, operations, .. } => {
                for operation in operations {
                    match operation {
                        AlterTableOperation::AddConstraint(TableConstraint::Unique { columns, .. }) => {
                            let mut table = database_object.tables.get_mut(&name.to_string()).unwrap_or_else(|| {
                                panic!("Table '{}' not found in database", name);
                            });
                            for column in columns {
                                table.pk.push(column.clone().to_string());
                            }
                        }
                        AlterTableOperation::AddConstraint(TableConstraint::ForeignKey { columns, foreign_table, referred_columns, .. }) => {
                            // Determine the relationship type
                            let r#type = determine_relationship_type(&name.to_string(), &foreign_table.to_string(), &columns[0].to_string(), &referred_columns[0].to_string(), &database_object).unwrap();

                            // Create a relationship
                            let relationship = Relationship {
                                table: name.to_string(),
                                referenced_table: foreign_table.to_string(),
                                attribute: columns[0].to_string(),
                                referenced_attribute: referred_columns[0].to_string(),
                                r#type,
                            };

                            // Add the relationship to the database object
                            let relationship_name = format!("{}VS{}", &name, &foreign_table);
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

fn determine_relationship_type(
    table_name: &str,
    referenced_table: &str,
    attribute: &str,
    referenced_attribute: &str,
    query_object: &DatabaseObject,
) -> Result<String, &'static str> {
    let table = query_object.tables.get(table_name).ok_or("Table not found")?;
    let referenced_table = query_object.tables.get(referenced_table).ok_or("Referenced table not found")?;

    if table.pk.contains(&attribute.to_string()) && referenced_table.pk.contains(&referenced_attribute.to_string()) {
        if table.is_joint {
            Ok("M:N".to_string())
        } else {
            Ok("1:1".to_string())
        }
    } else if !table.pk.contains(&attribute.to_string()) && referenced_table.pk.contains(&referenced_attribute.to_string()) {
        Ok("1:M".to_string())
    } else {
        Ok("".to_string())
    }
}