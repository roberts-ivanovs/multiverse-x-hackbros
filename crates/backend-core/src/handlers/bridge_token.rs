use axum::{debug_handler, Json};
use serde_json::{json, Value};
use serde::Deserialize;
use ibc_proto::ibc::applications::transfer::v2::FungibleTokenPacketData;

use crate::error::AppError;

#[debug_handler]
#[tracing::instrument(err)]
pub async fn index() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({
        "hello": "world",
    })))
}


pub async fn transfer(Json(payload): Json<CreateTokenTransferPayload>) -> Result<Json<Value>, AppError> {
    let token_data = FungibleTokenPacketData {
        denom: payload.token_denom,
        amount: payload.amount,
        sender: payload.sender,
        receiver: payload.receiver,
        memo: payload.description.unwrap_or("".to_string())
    };

    // TODO: call a service and pass token_data
    
    Ok(Json(json!({
        "data": format!("{} {} {} {}", token_data.denom, token_data.amount, token_data.sender, token_data.receiver),
    })))
}

#[derive(Deserialize)]
pub struct CreateTokenTransferPayload {
    token_denom: String,
    amount: String,
    sender: String,
    receiver: String,
    description: Option<String>
}