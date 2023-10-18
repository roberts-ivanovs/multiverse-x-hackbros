mod configuration;
mod error;
mod handlers;
mod mtx;
mod state;
mod storage_layer;

use axum::http::Method;
use axum::{
    routing::post,
    routing::{get, patch},
    Router,
};
pub use configuration::Configuration;
use std::{
    net::{SocketAddr, TcpListener},
    sync::Arc,
};
use tower_http::cors::{Any, CorsLayer};

use multiversx_sc_snippets::{multiversx_sc_scenario::scenario_model::AddressKey, Interactor};
use multiversx_sdk::{blockchain::CommunicationProxy, wallet::Wallet};
use redact::Secret;
use state::{VaultContract, WVaultContract, WebAppState};
use tokio::sync::RwLock;

use crate::state::WInteractor;

pub struct Service {
    web_listener: TcpListener,
    state: WebAppState,
}

impl Service {
    pub async fn prepare(configuration: Configuration) -> Self {
        // Define app
        let storage_data =
            storage_layer::StorageData::read_from_disk(&configuration.persistent_storage_path)
                .await;
        let mut interactor = Interactor::new(&configuration.multivers_x_gateway).await;
        interactor.register_wallet(
            Wallet::from_private_key(configuration.multivers_x_private_key.expose_secret())
                .unwrap(),
        );

        let address_key = AddressKey {
            value: multiversx_sc::types::Address::from_slice(
                &configuration.multivers_x_smart_contract_address.to_bytes(),
            ),
            original: configuration.multivers_x_smart_contract_address.to_string(),
        };
        let contract = VaultContract::new(address_key);
        let wallet =
            Wallet::from_private_key(configuration.multivers_x_private_key.expose_secret())
                .unwrap();
        let state = WebAppState {
            wallet: Secret::new(wallet),
            vault_contract: Arc::new(RwLock::new(WVaultContract(contract))),
            interactor: Arc::new(RwLock::new(WInteractor(interactor))),
            storage_fs_path: configuration.persistent_storage_path,
            persistent_data: Arc::new(tokio::sync::RwLock::new(storage_data)),
            gateway: configuration.multivers_x_gateway.clone(),
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
            .route("/health", get(handlers::health))
            .route("/tokens/:user_address", get(handlers::list_all_user_tokens))
            .route(
                "/tokens/:user_address",
                patch(handlers::mint_new_tokens_on_the_other_chain),
            )
            .route("/tokens/:user_address", post(handlers::transfer_to_mx))
            .layer(
                CorsLayer::permissive(),
            )
            .with_state(state.clone());

        let server = axum::Server::from_tcp(self.web_listener)
            .unwrap()
            .serve(app.into_make_service());

        // Start listening for chain events
        let mut monitor_handle = tokio::spawn(async move {
            mtx::monitor::run(state).await;
        });
        let mut server_handle = tokio::spawn(async move {
            server.await.unwrap();
        });

        tokio::select! {
            _ = &mut server_handle => {
                monitor_handle.abort();
            },
            _ = &mut monitor_handle => {
                server_handle.abort();
            },
        }
    }

    pub fn local_addr(&self) -> std::io::Result<SocketAddr> {
        self.web_listener.local_addr()
    }
}
