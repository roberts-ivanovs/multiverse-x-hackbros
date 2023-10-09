use crate::state::WebAppState;

// TODO sign new chain transactions and submit them to the network
pub async fn sign_tx(state: &WebAppState) {
    // https://github.com/multiversx/mx-sdk-rs/blob/master/sdk/core/examples/sign_tx.rs
    // TODO

    let mut asd = multiversx_sc_snippets::Interactor::new(&state.gateway).await;
    asd.register_wallet(*state.wallet.expose_secret());
    // let aaaa = asd.sc_call(ScCallStep::new().).await;
}
