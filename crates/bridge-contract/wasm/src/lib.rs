// Code generated by the multiversx-sc multi-contract system. DO NOT EDIT.

////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

// Init:                                 1
// Endpoints:                           13
// Async Callback (empty):               1
// Total number of exported functions:  15

#![no_std]
#![allow(internal_features)]
#![feature(lang_items)]

multiversx_sc_wasm_adapter::allocator!();
multiversx_sc_wasm_adapter::panic_handler!();

multiversx_sc_wasm_adapter::endpoints! {
    contract
    (
        init => init
        issueToken1 => issue_token1
        issueToken2 => issue_token2
        issueToken3 => issue_token3
        issueToken4 => issue_token4
        mint => mint
        burn => burn
        deposit => deposit
        getTokenIds => get_token_ids
        deploymentBlock => deployment_block
        getBlockDeposits => block_deposits
        getDepositAmount => deposit_amount
        getDepositAddress => deposit_address
        getDepositTokenId => deposit_token_id
    )
}

multiversx_sc_wasm_adapter::async_callback_empty! {}
