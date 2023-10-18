use std::str::FromStr;

use ibc_proto::ibc::apps::transfer::v2::FungibleTokenPacketData;

use num_bigint::BigUint;

use crate::{handlers::ALL_TOKENS, state::WebAppState};

#[tracing::instrument(skip(app), ret, err)]
pub async fn sign_tx(app: &WebAppState, token_data: FungibleTokenPacketData) -> eyre::Result<()> {
    use contract::ProxyTrait as _;
    use multiversx_sc_snippets::multiversx_sc_scenario::scenario_model::IntoBlockchainCall;

    let mut interactor = app.interactor.write().await;
    let mut vault_contract = app.vault_contract.write().await;

    tracing::info!("transforming user address");
    let sender =
        multiversx_sc::types::Address::from(&app.wallet.expose_secret().address().to_bytes());
    tracing::info!("transforming receiver address");
    let receiver =
        multiversx_sdk::data::address::Address::from_bech32_string(token_data.receiver.as_str())
            .map_err(|_| eyre::eyre!("invalid receiver address"))?;
    let amount = BigUint::from_str(token_data.amount.as_str())?;

    tracing::info!("finding token to transfer");
    let token = ALL_TOKENS
        .iter()
        .find(|x| x.mx_token_id.0 == token_data.denom)
        .ok_or(eyre::eyre!("invalid token"))?;

    tracing::info!("preparing tx to send");
    let mutate_state_call = vault_contract
        .0
        .mint(
            token.mx_token_id.inner_as_identifier(),
            amount,
            receiver.to_bytes(),
        )
        .into_blockchain_call()
        .from(&sender);
    tracing::info!("calling contract");
    interactor.0.sc_call(mutate_state_call).await;

    Ok(())
}
