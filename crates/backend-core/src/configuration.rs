use std::net::SocketAddr;

#[derive(Debug, Clone)]
pub struct Configuration {
    pub serve_addr: SocketAddr,
}
