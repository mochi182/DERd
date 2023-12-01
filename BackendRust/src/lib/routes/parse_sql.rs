use serde::{Serialize, Deserialize};
use axum::extract::Json;
use serde_json::{json, Value};
use sqlparser::dialect::MySqlDialect;
use sqlparser::parser::Parser;

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

use sqlparser::ast::{TableConstraint, SetExpr, ObjectName, Ident, TableFactor , Table, TableWithJoins, Select, Query, Statement, WildcardAdditionalOptions};
use sqlparser::ast::FunctionArgExpr::Wildcard;
use sqlparser::ast::GroupByExpr::Expressions;
use std::option::Option;

fn build_database_object(ast: Vec<Statement>) -> DatabaseObject {
    let mut database_object = DatabaseObject {
        tables: HashMap::new(),
        relationships: HashMap::new(),
    };

    for statement in ast {
        if let Statement::CreateTable { name, columns, constraints, .. } = statement {
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
    }

    database_object
}