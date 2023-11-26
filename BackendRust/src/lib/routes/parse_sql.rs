use serde::{Deserialize, Serialize};
use axum::extract::Json;

use sqlparser::dialect::GenericDialect;
use sqlparser::parser::Parser;

pub async fn parse_sql(body: String) -> String {
    println!("Received SQL: {:?}", body);
    let sql = body.as_str(); 

    let dialect = GenericDialect {};
    match Parser::parse_sql(&dialect, sql) {
        Ok(ast) => {
            println!("AST: {:?}", ast);
            "Parsed successfully".to_owned()
        },
        Err(e) => format!("Error parsing SQL: {}", e),
    }
}
