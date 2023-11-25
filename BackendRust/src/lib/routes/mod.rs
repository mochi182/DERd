mod hello_world;
use hello_world::hello_world;
use axum::{routing::{get, post}, Router};

pub async fn create_routes() -> Router {
    let app = Router::new()
    .route("/", post(hello_world));
    return app;
}