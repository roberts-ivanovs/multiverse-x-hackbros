use std::{str::FromStr, sync::Arc};

use contract::ProxyTrait;
use multiversx_sc::{storage::mappers::SingleValue, types::MultiValueEncoded};
use multiversx_sc_snippets::multiversx_sc_scenario::api::StaticApi;

use num_bigint::BigUint;

use crate::{handlers::TokenId, state::WebAppState, storage_layer::EventHash};

#[derive(Debug)]
struct Block(pub u64);

pub async fn run(app: Arc<WebAppState>) {
    let mut data = app.persistent_data.write().await;
    let last_parsed_block = if data.last_parsed_block() == 0 {
        get_deployment_block(&app)
            .await
            .expect("failed to get deployment block")
    } else {
        Block(data.last_parsed_block())
    };
    data.set_last_parsed_block(last_parsed_block.0);
    drop(data);

    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

        let _ = react_on_events(&app).await;

        let r = app.persistent_data.read().await;
        let _ = r.write_to_disk(&app.storage_fs_path).await;
    }
}

#[tracing::instrument(skip(app), err)]
async fn react_on_events(app: &Arc<WebAppState>) -> anyhow::Result<()> {
    let r = app.persistent_data.read().await;
    let last_parsed_block = r.last_parsed_block();
    drop(r);

    let latest_block = get_current_block(app).await?.0;

    react_on_events_in_range(last_parsed_block, latest_block, app).await?;

    Ok(())
}

#[tracing::instrument(skip(app), ret, err)]
async fn react_on_events_in_range(
    last_parsed_block: u64,
    latest_block: u64,
    app: &Arc<WebAppState>,
) -> Result<(), anyhow::Error> {
    let mut new_last_parsed_block = last_parsed_block;
    for (idx, block) in (last_parsed_block..latest_block).enumerate() {
        if idx == 5 {
            // Take a break every 5 blocks
            break;
        }

        let events = fetch_events(app, Block(block)).await?;
        if events.is_empty() {
            new_last_parsed_block = block;
            continue;
        }
        let unique_events = parse_unique_events(app, events).await?;
        if unique_events.is_empty() {
            new_last_parsed_block = block;
            continue;
        }
        update_balance(app, unique_events).await?;
        new_last_parsed_block = block;
    }

    let mut w = app.persistent_data.write().await;
    w.set_last_parsed_block(new_last_parsed_block);
    drop(w);

    return Ok(());
}

#[tracing::instrument(skip(app), ret, err)]
async fn fetch_events(app: &Arc<WebAppState>, at_block: Block) -> anyhow::Result<Vec<MxOutEvent>> {
    use contract::ProxyTrait as _;

    let _r = app.interactor.read().await;
    let mut vault_contract = app.vault_contract.write().await;

    let mut interactor = app.interactor.write().await;
    let result: MultiValueEncoded<StaticApi, u64> = interactor
        .0
        .quick_query(vault_contract.0.block_deposits(at_block.0))
        .await;
    let res = result.into_iter().collect::<Vec<_>>();

    let mut new_events = Vec::new();
    for x in res.iter() {
        let addresses: SingleValue<multiversx_sc::types::Address> = interactor
            .0
            .quick_query(vault_contract.0.deposit_address(x))
            .await;
        let amounts: SingleValue<BigUint> = interactor
            .0
            .quick_query(vault_contract.0.deposit_amount(x))
            .await;
        let token_id: SingleValue<multiversx_sc::types::TokenIdentifier<StaticApi>> = interactor
            .0
            .quick_query(vault_contract.0.deposit_token_id(x))
            .await;

        let token_id: multiversx_sc::types::TokenIdentifier<StaticApi> = token_id.into();
        let token_id = TokenId::new_with_identifier(token_id);

        new_events.push(MxOutEvent {
            user: addresses.into(),
            token: token_id,
            event_hash: *x,
            amount: amounts.into(),
        });
    }

    Ok(new_events)
}

#[tracing::instrument(skip(app), ret, err)]
async fn parse_unique_events(
    app: &Arc<WebAppState>,
    events: Vec<MxOutEvent>,
) -> anyhow::Result<Vec<MxOutEvent>> {
    let r = app.persistent_data.read().await;
    let events = events
        .into_iter()
        .filter(|x| r.contains(&x.event_hash))
        .collect::<Vec<_>>();
    Ok(events)
}

#[tracing::instrument(skip(app), ret, err)]
async fn update_balance(app: &Arc<WebAppState>, events: Vec<MxOutEvent>) -> anyhow::Result<()> {
    let mut w = app.persistent_data.write().await;
    for event in events {
        let user = event.user.as_array();
        let user = multiversx_sdk::data::address::Address::from_bytes(*user).to_string();
        if let Some(balances) = w.balances.get_mut(&user) {
            if let Some(x) = balances.iter_mut().find(|x| x.mx_token_id == event.token) {
                if let Ok(your_balance) = BigUint::from_str(&x.your_balance) {
                    let your_balance = your_balance + event.amount;
                    x.your_balance = your_balance.to_string();
                }
            }
        }

        w.add_event_hash(event.event_hash)
    }

    Ok(())
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

    Ok(Block(result))
}

#[tracing::instrument(skip(_app), ret, err)]
async fn get_current_block(_app: &Arc<WebAppState>) -> anyhow::Result<Block> {
    let mut latest_block = reqwest::get("https://devnet-api.multiversx.com/blocks/latest")
        .await?
        .json::<serde_json::Value>()
        .await?;

    let nonce = latest_block["nonce"].take();
    let nonce = serde_json::from_value::<u64>(nonce)?;
    Ok(Block(nonce))
}

#[derive(Debug)]
pub struct MxOutEvent {
    user: multiversx_sc::types::Address,
    token: TokenId,
    event_hash: EventHash,
    amount: BigUint,
}
