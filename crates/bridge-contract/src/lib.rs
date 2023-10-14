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

    // todo: Remove these endpoints
    #[endpoint(setValue)]
    #[storage_set("value")]
    fn set_value(&self, value: &BigUint);

    #[view(getMyValue)]
    #[storage_mapper("my_value")]
    fn my_value(&self) -> SingleValueMapper<usize>;

    #[endpoint]
    fn set_my_value(&self, new_value: usize) {
        self.my_value().set(new_value);
    }
    // end todo

    #[endpoint(mint)]
    fn mint(&self, _token_id: &TokenIdentifier, _amount: &BigUint, _recipient: &ManagedAddress) {
        // self.send().esdt_local_mint(&token_id, 0, &amount);
        // self.send().direct_esdt(&recipient, &token_id, 0, &amount);
    }

    #[endpoint(burn)]
    fn burn(&self, _token_id: &TokenIdentifier, _amount: &BigUint) {
        // self.send().esdt_local_burn(&token_id, 0, &amount);
    }

    #[endpoint(deposit)]
    #[payable("*")]
    fn deposit(&self, token_id: &TokenIdentifier, amount: &BigUint) {
        let depositor = self.blockchain().get_caller();
        let block_num = self.blockchain().get_block_nonce();
        let deposit_id = self.current_deposit_id().get();

        self.deposit_amount(deposit_id).set(amount.clone());
        self.deposit_address(deposit_id).set(depositor.clone());
        self.deposit_token_id(deposit_id).set(token_id.clone());
        self.block_deposits(block_num).push(&deposit_id);
        self.current_deposit_id().set(&deposit_id + 1);

        // transfer token
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
}
