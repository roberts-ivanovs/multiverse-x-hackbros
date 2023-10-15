mod telemetry;

use backend_core::{Configuration, Service};
use multiversx_sdk::data::address::Address;
use redact::Secret;

#[tokio::main]
async fn main() {
    telemetry::init_telemetry();

    let serve_addr = env_var("SERVE_ADDR");
    let multivers_x_gateway = env_var("MULTIVERS_X_GATEWAY");
    let multivers_x_private_key = env_var("MULTIVERS_X_PRIVATE_KEY");
    let multivers_x_smart_contract_address = env_var("MULTIVERS_X_SMART_CONTRACT_ADDRESS");
    let persistent_storage_path = env_var("STORAGE_PATH");

    Service::prepare(Configuration {
        persistent_storage_path: persistent_storage_path.into(),
        serve_addr: serve_addr
            .parse()
            .expect("SERVE_ADDR must be a valid address"),
        multivers_x_gateway,
        multivers_x_private_key: Secret::new(multivers_x_private_key),
        multivers_x_smart_contract_address: Address::from_bech32_string(
            &multivers_x_smart_contract_address,
        )
        .expect("MULTIVERS_X_SMART_CONTRACT_ADDRESS must be a valid bech32 address"),
    })
    .await
    .start_and_wait_for_shutdown()
    .await;
}

fn env_var(key: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| panic!("{} must be set", key))
}
