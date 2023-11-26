mod hello_world;
mod mirror_body_string;
mod mirror_body_json;
mod parse_sql;

use hello_world::hello_world;
use mirror_body_string::mirror_body_string;
use mirror_body_json::mirror_body_json;
use parse_sql::parse_sql;
use axum::{
    body::Body,
    routing::{get, post},
    Router}
    ;

pub async fn create_routes() -> Router {
    let app = Router::new()
    .route("/", get(hello_world))
    .route("/mirror_body_string", post(mirror_body_string))
    .route("/mirror_body_json", post(mirror_body_json))
    .route("/parse_sql", post(parse_sql));
    return app;
}