use axum::{debug_handler, Json};
use serde_json::{json, Value};

use crate::error::AppError;

#[debug_handler]
#[tracing::instrument(err)]
pub async fn index() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({
        "hello": "world",
    })))
}
