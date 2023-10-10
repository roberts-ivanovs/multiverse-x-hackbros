#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract {
    #[init]
    fn init(&self) {
        self.deployment_block()
            .set(self.blockchain().get_block_nonce());
    }

    #[endpoint]
    fn set_my_value(&self, new_value: usize) {
        self.my_value().set(new_value);
    }

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
    fn deposit(&self, _token_id: &TokenIdentifier, _amount: &BigUint) {
        // pay the fee
    }

    #[endpoint(setValue)]
    #[storage_set("value")]
    fn set_value(&self, value: &BigUint);

    #[view(getMyValue)]
    #[storage_mapper("my_value")]
    fn my_value(&self) -> SingleValueMapper<usize>;

    #[view(deploymentBlock)]
    #[storage_mapper("deployment_block")]
    fn deployment_block(&self) -> SingleValueMapper<u64>;
}
