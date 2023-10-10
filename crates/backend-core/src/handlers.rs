use std::sync::Arc;

use axum::{debug_handler, extract::{Path, State}, Json};
use ibc_proto::ibc::apps::transfer::v2::FungibleTokenPacketData;
use multiversx_sdk::data::address::Address;

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use crate::{error::AppError, state::WebAppState};

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct TokenDefinition {
    name: String,
    symbol: String,
    decimals: u8,
    address: String,
    total_supply: String,
    your_balance: String,
}

/// Tokens for USDC, ETH, EVMOS, and MX
#[static_init::dynamic]
static ALL_TOKENS: [TokenDefinition; 4] = [
    TokenDefinition {
        name: "USDC".to_string(),
        symbol: "USDC".to_string(),
        decimals: 18,
        address: "0x1234".to_string(),
        total_supply: "1000000000000000000000000000".to_string(),
        your_balance: "1000000000000000000000000000".to_string(),
    },
    TokenDefinition {
        name: "ETH".to_string(),
        symbol: "ETH".to_string(),
        decimals: 18,
        address: "0x1234".to_string(),
        total_supply: "1000000000000000000000000000".to_string(),
        your_balance: "1000000000000000000000000000".to_string(),
    },
    TokenDefinition {
        name: "EVMOS".to_string(),
        symbol: "EVMOS".to_string(),
        decimals: 18,
        address: "0x1234".to_string(),
        total_supply: "1000000000000000000000000000".to_string(),
        your_balance: "1000000000000000000000000000".to_string(),
    },
    TokenDefinition {
        name: "WrappedMX".to_string(),
        symbol: "WrappedMX".to_string(),
        decimals: 18,
        address: "0x1234".to_string(),
        total_supply: "1000000000000000000000000000".to_string(),
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
    denom: String,
}

#[debug_handler]
#[tracing::instrument(err)]
pub async fn mint_new_tokens_on_the_other_chain(
    Path(_user_address): Path<Address>,
    State(_state): State<Arc<WebAppState>>,
    Json(_payload): Json<MintNewTokensPayload>,
) -> Result<Json<Value>, AppError> {
    Ok(Json(json!({ "message": "Mint successful" })))
}

#[debug_handler]
#[tracing::instrument(err)]
pub async fn list_all_user_tokens(
    Path(_user_address): Path<Address>,
    State(_state): State<Arc<WebAppState>>,
) -> Result<Json<Vec<TokenDefinition>>, AppError> {
    Ok(Json(ALL_TOKENS.to_vec()))
}

#[derive(Debug, Deserialize)]
pub struct CreateTokenTransferPayload {
    token_denom: String,
    amount: String,
    sender: String,
    receiver: String,
    description: Option<String>,
}

#[debug_handler]
#[tracing::instrument(err)]
pub async fn transfer_to_mx(
    Path(_user_address): Path<Address>,
    State(_state): State<Arc<WebAppState>>,
    Json(payload): Json<CreateTokenTransferPayload>,
) -> Result<Json<Value>, AppError> {
    let token_data = FungibleTokenPacketData {
        denom: payload.token_denom,
        amount: payload.amount,
        sender: payload.sender,
        receiver: payload.receiver,
        memo: payload.description.unwrap_or("".to_string()),
    };

    // TODO: call a service and pass token_data
    return match process_transfer(&token_data) {
        Ok(_) => Ok(Json(json!({ "message": "Transfer successful" }))),
        Err(e) => Err(e),
    };

    pub fn process_transfer(token_data: &FungibleTokenPacketData) -> Result<(), AppError> {
        // simulate an error
        if token_data.receiver == "invalid_receiver" {
            return Err(AppError::InvalidReceiverAddress);
        }

        println!(
            "Transfer: {} tokens from {} to {}",
            token_data.amount, token_data.sender, token_data.receiver
        );

        Ok(())
    }
}
