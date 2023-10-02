mod telemetry;

use backend_core::{Configuration, Service};

#[tokio::main]
async fn main() {
    telemetry::init_telemetry();

    let serve_addr = std::env::var("SERVE_ADDR")
        .map(|x| x.parse().expect("SERVE_ADDR must be a valid address"))
        .expect("SERVE_ADDR must be set");

    Service::prepare(Configuration { serve_addr })
        .await
        .start_and_wait_for_shutdown()
        .await;
}
