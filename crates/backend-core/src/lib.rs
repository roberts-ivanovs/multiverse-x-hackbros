mod configuration;
mod error;
mod handlers;
mod mtx;
mod state;

use std::{
    net::{SocketAddr, TcpListener},
    sync::Arc,
};

use axum::{routing::get, routing::post, Router};
pub use configuration::Configuration;
use multiversx_sdk::{blockchain::CommunicationProxy, wallet::Wallet};
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
            smart_contract_address: configuration.multivers_x_smart_contract_address,
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
        let state = Arc::new(self.state);
        tracing::info!(address =? address, "Starting service");
        let app = Router::new()
            .route("/health", get(handlers::bridge_token::index))
            .route("/transfer", post(handlers::bridge_token::transfer))
            .with_state(state.clone());

        let server = axum::Server::from_tcp(self.web_listener)
            .unwrap()
            .serve(app.into_make_service());

        // Start listening for chain events
        tokio::spawn(async move {
            mtx::monitor::run(state).await;
        });

        server.await.unwrap();
    }

    pub fn local_addr(&self) -> std::io::Result<SocketAddr> {
        self.web_listener.local_addr()
    }
}
