use axum::extract::FromRef;
use multiversx_sdk::{blockchain::CommunicationProxy, data::address::Address, wallet::Wallet};
use redact::Secret;

#[derive(Debug, Clone, FromRef)]
pub(crate) struct WebAppState {
    pub(crate) wallet: Secret<Wallet>,
    pub(crate) rpc: CommunicationProxy,
    pub(crate) smart_contract_address: Address,
}
