// TODO periodically query the vault contract state

use std::sync::Arc;

use contract::Contract;
use multiversx_sc::storage::mappers::SingleValue;

use multiversx_sdk::data::vm::VmValueRequest;
use num_bigint::BigUint;

use crate::state::WebAppState;

pub struct VaultMonitor {}

#[derive(Debug)]
struct Block(pub u64);

pub async fn run(app: Arc<WebAppState>) {
    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
        let block = get_deployment_block(&app).await;
        let Ok(block) = block else {
            continue;
        };
        let mut w = app.persistent_data.write().await;
        w.set_last_fetched_block(block.0);
        let _ = w.write_to_disk(&app.storage_fs_path).await;
    }
}

#[tracing::instrument(skip(app), ret, err)]
async fn react_on_state(app: &Arc<WebAppState>) -> anyhow::Result<Block> {
    todo!()
    // use base64::{engine::general_purpose, Engine as _};
    // let caller = app.wallet.expose_secret().address();
    // let latest_block = app.rpc.get_latest_hyper_block_nonce(true).await?;
    // let req = VmValueRequest {
    //     sc_address: app.smart_contract_address.clone(),
    //     func_name: "get".to_string(),
    //     args: vec![latest_block.to_string().clone()],
    //     caller,
    //     value: "0".to_string(),
    // };
    // let result = app.rpc.execute_vmquery(&req).await?;
    // let result = general_purpose::STANDARD_NO_PAD.decode(result.data.return_message)?;
    // let big_uint = BigUint::from_bytes_be(&result);
    // Ok(Block(big_uint))
}

#[tracing::instrument(skip(app), ret, err)]
async fn get_deployment_block(app: &Arc<WebAppState>) -> anyhow::Result<Block> {
    use contract::ProxyTrait as _;

    let mut interactor = app.interactor.write().await;
    let mut vault_contract = app.vault_contract.write().await;

    // Read the state
    let result: SingleValue<u64> = interactor
        .0
        .quick_query(vault_contract.0.deployment_block())
        .await;
    let result = result.into();

    tracing::info!("deployment block: {:?}", result);
    // TODO parse the result into a Rust struct
    // let big_uint = BigUint::from_bytes_be(&result);
    // Ok(Block(big_uint))

    Ok(Block((result)))
}
