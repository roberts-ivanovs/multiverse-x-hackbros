use axum::extract::FromRef;

#[derive(Debug, Clone, FromRef)]
pub(crate) struct WebAppState {
    // TODO shared state goes here
}
