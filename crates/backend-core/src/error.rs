use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use eyre::ErrReport;
use serde_json::json;

#[derive(thiserror::Error, Debug)]
pub enum AppError {
    #[error(transparent)]
    CatchallServerError(#[from] ErrReport),

    #[error("Invalid transfer amount")]
    InvalidAmount,

    #[error("Invalid receiver address")]
    InvalidReceiverAddress,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status_code, msg) = match self {
            AppError::CatchallServerError(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
            AppError::InvalidAmount => (StatusCode::BAD_REQUEST, "Invalid transfer amount".to_string()),
            AppError::InvalidReceiverAddress => (StatusCode::BAD_REQUEST, "Invalid receiver address".to_string()),
        };

        let body = Json(json!({
            "error": msg,
        }));

        (status_code, body).into_response()
    }
}
