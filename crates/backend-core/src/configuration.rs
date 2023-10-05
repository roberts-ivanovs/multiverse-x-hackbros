use std::net::SocketAddr;

use multiversx_sdk::data::address::Address;

#[derive(Debug, Clone)]
pub struct Configuration {
    pub serve_addr: SocketAddr,
    pub multivers_x_private_key: redact::Secret<String>,
    pub multivers_x_gateway: String,
    pub multivers_x_smart_contract_address: Address,
}
