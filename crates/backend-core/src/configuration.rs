use std::{net::SocketAddr, path::PathBuf};

use multiversx_sdk::data::address::Address;

#[derive(Debug, Clone)]
pub struct Configuration {
    pub serve_addr: SocketAddr,
    pub persistent_storage_path: PathBuf,
    pub multivers_x_private_key: redact::Secret<String>,
    pub multivers_x_gateway: String,
    pub multivers_x_smart_contract_address: Address,
}
