use axum::{routing::get, Router};

pub async fn run() {
    let app: Router = Router::new().route("/", get(hello_world));

    axum::Server::bind(&"0.0.0.0:3050".parse().unwrap())
    .serve(app.into_make_service())
    .await
    .unwrap()
}