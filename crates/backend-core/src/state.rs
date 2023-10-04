use axum::extract::FromRef;
use multiversx_sdk::{wallet::Wallet, blockchain::CommunicationProxy};
use redact::Secret;

#[derive(Debug, Clone, FromRef)]
pub(crate) struct WebAppState {
    pub(crate) wallet: Secret<Wallet>,
    pub(crate) rpc: CommunicationProxy,
}
