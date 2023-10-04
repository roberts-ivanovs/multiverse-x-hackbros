mod configuration;
mod error;
mod handlers;
mod state;
mod mtx;

use std::net::{SocketAddr, TcpListener};

use axum::{routing::get, routing::post, Router};
pub use configuration::Configuration;
use multiversx_sdk::{wallet::Wallet, blockchain::CommunicationProxy};
use redact::Secret;
use state::WebAppState;

pub struct Service {
    web_listener: TcpListener,
    state: WebAppState,
}

impl Service {
    pub async fn prepare(configuration: Configuration) -> Self {
        // Define app
        let state = WebAppState {
            wallet: Secret::new(
                Wallet::from_private_key(configuration.multivers_x_private_key.expose_secret())
                    .unwrap(),
            ),
            rpc: CommunicationProxy::new(configuration.multivers_x_gateway),
        };

        // Bind the port that we'll listen to
        let web_listener = TcpListener::bind(configuration.serve_addr).unwrap();

        Self {
            web_listener,
            state,
        }
    }

    pub async fn start_and_wait_for_shutdown(self) {
        let address = self.local_addr().unwrap();
        tracing::info!(address =? address, "Starting service");
        let app = Router::new()
            .route("/health", get(handlers::bridge_token::index))
            .route("/transfer", post(handlers::bridge_token::transfer))
            .with_state(self.state);

        let server = axum::Server::from_tcp(self.web_listener)
            .unwrap()
            .serve(app.into_make_service());

        server.await.unwrap();
    }

    pub fn local_addr(&self) -> std::io::Result<SocketAddr> {
        self.web_listener.local_addr()
    }
}
