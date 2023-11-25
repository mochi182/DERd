mod routes;
use routes::create_routes;
use axum::Router;

pub async fn run() {
    let app: Router = create_routes().await;

    axum::Server::bind(&"0.0.0.0:3050".parse().unwrap())
    .serve(app.into_make_service())
    .await
    .unwrap()
}