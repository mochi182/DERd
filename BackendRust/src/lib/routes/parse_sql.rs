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

use sqlparser::ast::{SetExpr, ObjectName, Ident, TableFactor , Table, TableWithJoins, Select, Query, Statement, WildcardAdditionalOptions};
use sqlparser::ast::FunctionArgExpr::Wildcard;
use sqlparser::ast::GroupByExpr::Expressions;
use std::option::Option;

pub fn build_database_object(ast: Vec<Statement>) -> DatabaseObject {
    let mut database_object = DatabaseObject {
        tables: HashMap::new(),
        relationships: HashMap::new(),
    };

    for statement in ast {
        if let Statement::Query(boxed_query) = statement {
            if let Query { body: boxed_select, .. } = *boxed_query {
                // Process the Query here
                if let SetExpr::Select(thing) = *boxed_select {
                    // Process the Query here
                    if let Select {from: from, ..} = *thing {

                        if let Option::Some(caraeverga) = from.first() {
                            //println!("{:?}", caraeverga);
                            if let TableWithJoins {relation: xuxa, ..} = caraeverga {
                                //println!("{:?}", xuxa);
                                if let TableFactor::Table {name: name, ..} = xuxa {

                                    println!("Table name: {}", xuxa);

                                }
                            }
                        }
                    }
                }
            }
        }
    }
    

    database_object
}
