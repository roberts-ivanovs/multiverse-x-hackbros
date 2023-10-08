use std::{path::{Path, PathBuf}, sync::Arc};

use axum::extract::FromRef;
use multiversx_sdk::{blockchain::CommunicationProxy, data::address::Address, wallet::Wallet};
use redact::Secret;
use tokio::sync::RwLock;

use crate::storage_layer::StorageData;

#[derive(Debug, Clone, FromRef)]
pub(crate) struct WebAppState {
    pub(crate) wallet: Secret<Wallet>,
    pub(crate) rpc: CommunicationProxy,
    pub(crate) smart_contract_address: Address,
    pub(crate) persistent_data: Arc<RwLock<StorageData>>,
    pub(crate) storage_fs_path: PathBuf,
}
