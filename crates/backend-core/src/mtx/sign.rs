use std::str::FromStr;

use ibc_proto::ibc::apps::transfer::v2::FungibleTokenPacketData;

use num_bigint::BigUint;

use crate::state::WebAppState;

#[tracing::instrument(skip(app), ret, err)]
pub async fn sign_tx(app: &WebAppState, token_data: FungibleTokenPacketData) -> eyre::Result<()> {
    use contract::ProxyTrait as _;
    use multiversx_sc_snippets::multiversx_sc_scenario::scenario_model::IntoBlockchainCall;

    let mut interactor = app.interactor.write().await;
    let mut vault_contract = app.vault_contract.write().await;

    let sender =
        multiversx_sc::types::Address::from(&app.wallet.expose_secret().address().to_bytes());
    let receiver =
        multiversx_sdk::data::address::Address::from_bech32_string(token_data.receiver.as_str())
            .map_err(|_| eyre::eyre!("invalid receiver address"))?;
    let amount = BigUint::from_str(token_data.amount.as_str())?;
    let mutate_state_call = vault_contract
        .0
        .mint(token_data.denom, amount, receiver.to_bytes())
        .into_blockchain_call()
        .from(&sender);
    interactor.0.sc_call(mutate_state_call).await;

    Ok(())
}
