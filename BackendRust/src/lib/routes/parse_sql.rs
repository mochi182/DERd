use serde::{Serialize};
use axum::extract::Json;
use serde_json::{json, Value};
use sqlparser::dialect::MySqlDialect;
use sqlparser::parser::Parser;

#[derive(Serialize)]
pub struct ParsedSqlResponse {
    ast: Value,
    message: String,
}

pub async fn parse_sql(body: String) -> Json<ParsedSqlResponse> {
    let sql = body.as_str();

    let dialect: MySqlDialect = MySqlDialect {};
    match Parser::parse_sql(&dialect, sql) {
        Ok(ast) => {
            let ast_debug_str = format!("{:?}", ast);
            Json(ParsedSqlResponse {
                ast: Value::String(ast_debug_str),
                message: "Parsed successfully".to_owned(),
            })
        }
        Err(e) => Json(ParsedSqlResponse {
            ast: Value::Null,
            message: format!("Error parsing SQL: {}", e),
        }),
    }
}
