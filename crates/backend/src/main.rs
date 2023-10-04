mod telemetry;

use backend_core::{Configuration, Service};
use redact::Secret;

#[tokio::main]
async fn main() {
    telemetry::init_telemetry();

    let serve_addr = env_var("SERVE_ADDR");
    let multivers_x_gateway = env_var("MULTIVERS_X_GATEWAY");
    let multivers_x_private_key = env_var("MULTIVERS_X_GATEWAY");

    Service::prepare(Configuration {
        serve_addr: serve_addr
            .parse()
            .expect("SERVE_ADDR must be a valid address"),
        multivers_x_gateway,
        multivers_x_private_key: Secret::new(multivers_x_private_key),
    })
    .await
    .start_and_wait_for_shutdown()
    .await;
}

fn env_var(key: &str) -> String {
    std::env::var(key).expect(&format!("{} must be set", key))
}
