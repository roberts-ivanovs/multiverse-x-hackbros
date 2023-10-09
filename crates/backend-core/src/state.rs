use std::{
    ops::Deref,
    path::{Path, PathBuf},
    sync::Arc,
};

use axum::extract::FromRef;
use multiversx_sc_snippets::{Interactor, multiversx_sc_scenario::{ContractInfo, DebugApi}};
use multiversx_sdk::{blockchain::CommunicationProxy, data::address::Address, wallet::Wallet};
use redact::Secret;
use tokio::sync::RwLock;

use crate::storage_layer::StorageData;

#[derive(Debug, Clone, FromRef)]
pub(crate) struct WebAppState {
    pub(crate) wallet: Secret<Wallet>,
    pub(crate) rpc: CommunicationProxy,
    pub(crate) gateway: String,
    pub(crate) smart_contract_address: Address,
    pub(crate) persistent_data: Arc<RwLock<StorageData>>,
    pub(crate) storage_fs_path: PathBuf,
    pub(crate) interactor: Arc<RwLock<WInteractor>>,
    pub(crate) vault_contract: Arc<WVaultContract>,
}

pub struct WInteractor(pub Interactor);

impl std::fmt::Debug for WInteractor {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("WInteractor").finish()
    }
}

impl AsRef<Interactor> for WInteractor {
    fn as_ref(&self) -> &Interactor {
        &self.0
    }
}

impl Deref for WInteractor {
    type Target = Interactor;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
pub struct WVaultContract(pub VaultContract);
pub type VaultContract = ContractInfo<contract::Proxy<DebugApi>>;

impl std::fmt::Debug for WVaultContract {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("WVaultContract").finish()
    }
}

impl AsRef<VaultContract> for WVaultContract {
    fn as_ref(&self) -> &VaultContract {
        &self.0
    }
}

impl Deref for WVaultContract {
    type Target = VaultContract;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
