// TODO periodically query the vault contract state

use std::sync::Arc;

use multiversx_sdk::data::vm::VmValueRequest;
use num_bigint::BigUint;

use crate::state::WebAppState;

pub struct VaultMonitor {}


#[derive(Debug)]
struct Block(pub BigUint);



pub async fn run(app: Arc<WebAppState>) {
    let data = app.persistent_data.read().await;
    let mut _last_fetched_block = if data.last_fetched_block() == 0 {
        get_deployment_block(&app).await.expect("failed to get deployment block")
    } else {
        Block(data.last_fetched_block().into())
    };
    drop(data);

    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

        let reacted = react_on_state(&app).await;
    }
}

#[tracing::instrument(skip(app), ret, err)]
async fn react_on_state(app: &Arc<WebAppState>) -> anyhow::Result<Block> {
    use base64::{engine::general_purpose, Engine as _};
    let caller = app.wallet.expose_secret().address();
    let latest_block = app.rpc.get_latest_hyper_block_nonce(true).await?;
    let req = VmValueRequest {
        sc_address: app.smart_contract_address.clone(),
        func_name: "get".to_string(),
        args: vec![latest_block.to_string().clone()],
        caller,
        value: "0".to_string(),
    };
    let result = app.rpc.execute_vmquery(&req).await?;
    let result = general_purpose::STANDARD_NO_PAD.decode(&result.data.return_message)?;
    let big_uint = BigUint::from_bytes_be(&result);
    Ok(Block(big_uint))
}

#[tracing::instrument(skip(app), ret, err)]
async fn get_deployment_block(app: &Arc<WebAppState>) -> anyhow::Result<Block> {
    use base64::{engine::general_purpose, Engine as _};

    let caller = app.wallet.expose_secret().address();
    let req = VmValueRequest {
        sc_address: app.smart_contract_address.clone(),
        func_name: "get_deployment_block".to_string(),
        args: vec![],
        caller,
        value: "0".to_string(),
    };
    let result = app.rpc.execute_vmquery(&req).await?;
    let result = general_purpose::STANDARD_NO_PAD.decode(&result.data.return_message)?;

    // TODO parse the result into a Rust struct
    let big_uint = BigUint::from_bytes_be(&result);
    Ok(Block(big_uint))
}
