use std::{str::FromStr, sync::Arc};

use axum::{
    debug_handler,
    extract::{Path, State},
    Json,
};
use ibc_proto::ibc::apps::transfer::v2::FungibleTokenPacketData;
use multiversx_sdk::data::address::Address;

use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use crate::{error::AppError, mtx::sign::sign_tx, state::WebAppState};

#[derive(Debug, Default, Clone, serde::Serialize, serde::Deserialize, PartialEq)]
pub struct Symbol(pub String);
#[derive(Debug, Default, Clone, serde::Serialize, serde::Deserialize)]
pub struct TokenDefinition {
    pub name: String,
    pub symbol: Symbol,
    pub decimals: u8,
    pub address: String,
    pub your_balance: String,
}

/// Tokens for USDC, ETH, EVMOS, and MX
#[static_init::dynamic]
static ALL_TOKENS: [TokenDefinition; 4] = [
    TokenDefinition {
        name: "USDC".to_string(),
        symbol: Symbol("USDC".to_string()),
        decimals: 18,
        address: "0x1234".to_string(),
        your_balance: "1000000000000000000000000000".to_string(),
    },
    TokenDefinition {
        name: "ETH".to_string(),
        symbol: Symbol("ETH".to_string()),
        decimals: 18,
        address: "0x1234".to_string(),
        your_balance: "1000000000000000000000000000".to_string(),
    },
    TokenDefinition {
        name: "EVMOS".to_string(),
        symbol: Symbol("EVMOS".to_string()),
        decimals: 18,
        address: "0x1234".to_string(),
        your_balance: "1000000000000000000000000000".to_string(),
    },
    TokenDefinition {
        name: "WrappedMX".to_string(),
        symbol: Symbol("WrappedMX".to_string()),
        decimals: 18,
        address: "0x1234".to_string(),
        your_balance: "1000000000000000000000000000".to_string(),
    },
];

#[debug_handler]
#[tracing::instrument(err)]
pub async fn health() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({
        "hello": "world",
    })))
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct MintNewTokensPayload {
    amount: String,
    denom: Symbol,
}

#[debug_handler]
#[tracing::instrument(err)]
pub async fn mint_new_tokens_on_the_other_chain(
    Path(user_address): Path<Address>,
    State(state): State<Arc<WebAppState>>,
    Json(payload): Json<MintNewTokensPayload>,
) -> Result<Json<Value>, AppError> {
    let mut w = state.persistent_data.write().await;
    let ua = user_address.to_string();
    match w.balances.get_mut(&ua) {
        Some(entry) => {
            let token = entry
                .iter_mut()
                .find(|t| t.symbol == payload.denom)
                .ok_or(eyre::eyre!("Invalid token"))?;
            let amount =
                BigInt::from_str(&payload.amount).map_err(|_| eyre::eyre!("invalid amount"))?;
            let token_your_balance = BigInt::from_str(&token.your_balance)
                .map_err(|_| eyre::eyre!("invalid your balance"))?;

            token.your_balance = (token_your_balance + amount).to_string();
        }
        None => {
            Err(eyre::eyre!("User not found"))?;
        }
    };
    Ok(Json(json!({ "message": "Mint successful" })))
}

#[debug_handler]
#[tracing::instrument(err)]
pub async fn list_all_user_tokens(
    Path(user_address): Path<Address>,
    State(state): State<Arc<WebAppState>>,
) -> Result<Json<Vec<TokenDefinition>>, AppError> {
    let mut w = state.persistent_data.write().await;
    let ua = user_address.to_string();
    match w.balances.get_mut(&ua) {
        Some(entry) => {
            let tokens = entry.clone();
            Ok(Json(tokens))
        }
        None => {
            let tokens = ALL_TOKENS.to_vec();
            w.balances.insert(ua, tokens.clone());
            Ok(Json(tokens))
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateTokenTransferPayload {
    token_denom: String,
    amount: String,
}

#[debug_handler]
#[tracing::instrument(err)]
pub async fn transfer_to_mx(
    Path(user_address): Path<Address>,
    State(app): State<Arc<WebAppState>>,
    Json(payload): Json<CreateTokenTransferPayload>,
) -> Result<Json<Value>, AppError> {
    let token_data = FungibleTokenPacketData {
        denom: payload.token_denom,
        amount: payload.amount,
        sender: app.wallet.expose_secret().address().to_string(),
        receiver: user_address.to_string(),
        memo: "".to_string(),
    };

    // TODO deduct the amount from the user's balance

    let mut w = app.persistent_data.write().await;
    let ua = user_address.to_string();
    match w.balances.get_mut(&ua) {
        Some(entry) => {
            let token = entry
                .iter_mut()
                .find(|t| t.symbol.0 == token_data.denom)
                .ok_or(eyre::eyre!("Invalid token"))?;
            let amount =
                BigInt::from_str(&token_data.amount).map_err(|_| eyre::eyre!("invalid amount"))?;
            let token_your_balance = BigInt::from_str(&token.your_balance)
                .map_err(|_| eyre::eyre!("invalid your balance"))?;

            let new_balance = token_your_balance
                .checked_sub(&amount)
                .ok_or(eyre::eyre!("Insufficient balance"))?;
            token.your_balance = new_balance.to_string();
        }
        None => {
            Err(eyre::eyre!("User not found"))?;
        }
    };

    sign_tx(&app, token_data).await?;

    Ok(Json(json!({ "message": "Transfer successful" })))
}
