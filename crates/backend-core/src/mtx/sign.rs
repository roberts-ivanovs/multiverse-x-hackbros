use multiversx_sc::storage::mappers::SingleValue;
use multiversx_sc_snippets::multiversx_sc_scenario::scenario_model::ScCallStep;

use crate::state::WebAppState;

// TODO sign new chain transactions and submit them to the network
pub async fn sign_tx(app: &WebAppState) {
    // https://github.com/multiversx/mx-sdk-rs/blob/master/sdk/core/examples/sign_tx.rs
    // TODO
    use contract::ProxyTrait as _;
    use multiversx_sc_snippets::multiversx_sc_scenario::scenario_model::IntoBlockchainCall;

    let mut interactor = app.interactor.write().await;
    let mut vault_contract = app.vault_contract.write().await;

    // Update the state
    let a =
        multiversx_sc::types::Address::from_slice(&app.wallet.expose_secret().address().to_bytes());
    let mutate_state_call: ScCallStep = vault_contract
        .0
        .set_my_value(10_usize)
        .into_blockchain_call()
        .from(&a)
        .into();
    interactor.0.sc_call(mutate_state_call).await;

    // Read the state
    let result: SingleValue<u64> = interactor
        .0
        .quick_query(vault_contract.0.my_value())
        .await;
    let result = result.into();
    tracing::info!("my_value: {:?}", result);
}
