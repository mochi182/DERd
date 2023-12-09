mod index;
mod parse_sql;

use index::index;
use parse_sql::parse_sql;
use axum::{
    http::Method,
    routing::{get, post},
    Router}
    ;

use tower_http::cors::{Any, CorsLayer};

pub async fn create_routes() -> Router {

    // Add CORS middleware
    let cors = CorsLayer::new()
    .allow_methods([Method::GET, Method::POST])
    .allow_origin(Any);

    let app = Router::new()
    .route("/", get(index))
    .route("/parse_sql", post(parse_sql))
    .layer(cors);

    return app;
}