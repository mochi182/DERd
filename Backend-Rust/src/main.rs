use Backend-Rust::run;

#[tokio::main]

async fn main() {
    run().await
}


async fn hello_world() -> String {
    "Hello world!!!!".to_owned()
}