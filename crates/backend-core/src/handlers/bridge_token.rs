use std::sync::Arc;

use axum::{debug_handler, extract::State, Json};
use ibc_proto::ibc::applications::transfer::v2::FungibleTokenPacketData;
use num_bigint::{BigUint, ToBigUint};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::{error::AppError, state::WebAppState};

#[debug_handler]
#[tracing::instrument(err)]
pub async fn index() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({
        "hello": "world",
    })))
}

pub async fn transfer(
    State(_state): State<Arc<WebAppState>>,
    Json(payload): Json<CreateTokenTransferPayload>,
) -> Result<Json<Value>, AppError> {
    // Validate the amount field
    let _amount = match payload.amount.parse::<BigUint>() {
        Ok(parsed_amount) if parsed_amount >= 0.to_biguint().unwrap() => parsed_amount,
        _ => return Err(AppError::InvalidAmount),
    };

    let token_data = FungibleTokenPacketData {
        denom: payload.token_denom,
        amount: payload.amount,
        sender: payload.sender,
        receiver: payload.receiver,
        memo: payload.description.unwrap_or("".to_string()),
    };

    // TODO: call a service and pass token_data
    match process_transfer(&token_data) {
        Ok(_) => Ok(Json(json!({ "message": "Transfer successful" }))),
        Err(e) => Err(e),
    }
}

#[derive(Deserialize)]
pub struct CreateTokenTransferPayload {
    token_denom: String,
    amount: String,
    sender: String,
    receiver: String,
    description: Option<String>,
}

// TODO: simulate a processing method, remove later
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
