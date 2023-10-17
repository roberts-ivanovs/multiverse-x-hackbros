#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract {
    #[init]
    fn init(&self) {
        self.deployment_block()
            .set(self.blockchain().get_block_nonce());
        self.current_deposit_id().set(0);
    }

    #[endpoint(issueToken1)]
    #[payable("EGLD")]
    fn issue_token1(&self) {
        let issue_cost: u128 = 50_000_000_000_000_000;
        let token_display_name = ManagedBuffer::from("Token");
        let token_ticker = ManagedBuffer::from("TOK");
        self.token_1().issue_and_set_all_roles(BigUint::from(issue_cost), token_display_name, token_ticker, 18, None);
    }

    #[endpoint(mint)]
    fn mint(&self, token_id: TokenIdentifier, amount: &BigUint, recipient: &ManagedAddress) {
        self.send().esdt_local_mint(&token_id, 0, &amount);
        self.send().direct_esdt(&recipient, &token_id, 0, &amount);
    }

    #[endpoint(burn)]
    fn burn(&self, deposit_id: u64) {
        let token_id = self.deposit_token_id(deposit_id).get();
        let amount = self.deposit_amount(deposit_id).get();
        self.send().esdt_local_burn(&token_id, 0, &amount);
        self.deposit_amount(deposit_id).set(BigUint::zero());
    }

    #[endpoint(deposit)]
    #[payable("*")]
    fn deposit(&self) {
        let payment = self.call_value().single_fungible_esdt();
        let depositor = self.blockchain().get_caller();
        let block_num = self.blockchain().get_block_nonce();
        let deposit_id = self.current_deposit_id().get();

        self.deposit_token_id(deposit_id).set(payment.0);
        self.deposit_amount(deposit_id).set(payment.1);
        self.deposit_address(deposit_id).set(&depositor);
        self.block_deposits(block_num).push(&deposit_id);
        self.current_deposit_id().set(&deposit_id + 1);
    }

    #[view(deploymentBlock)]
    #[storage_mapper("deployment_block")]
    fn deployment_block(&self) -> SingleValueMapper<u64>;

    #[view(getBlockDeposits)]
    #[storage_mapper("block_deposits")]
    fn block_deposits(&self, block_num: u64) -> VecMapper<u64>;

    #[view(getDepositAmount)]
    #[storage_mapper("deposit_amount")]
    fn deposit_amount(&self, deposit_id: u64) -> SingleValueMapper<BigUint>;

    #[view(getDepositAddress)]
    #[storage_mapper("deposit_address")]
    fn deposit_address(&self, deposit_id: u64) -> SingleValueMapper<ManagedAddress>;

    #[view(getDepositTokenId)]
    #[storage_mapper("deposit_token_id")]
    fn deposit_token_id(&self, deposit_id: u64) -> SingleValueMapper<TokenIdentifier>;

    #[storage_mapper("current_deposit_id")]
    fn current_deposit_id(&self) -> SingleValueMapper<u64>;
    
    #[view(getToken1)]
    #[storage_mapper("token_1")]
    fn token_1(&self) -> FungibleTokenMapper;
}
