use std::net::SocketAddr;

#[derive(Debug, Clone)]
pub struct Configuration {
    pub serve_addr: SocketAddr,
    pub multivers_x_private_key: redact::Secret<String>,
    pub multivers_x_gateway: String,
}
