#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract {
    #[view(getValue)]
    #[storage_get("value")]
    fn get_value(&self) -> BigUint;

    #[init]
    fn init(&self) {
        self.deployment_block()
            .set(self.blockchain().get_block_nonce());
    }

    #[endpoint(setValue)]
    #[storage_set("value")]
    fn set_value(&self, value: &BigUint);

    #[storage_set("deployment_block")]
    fn set_deployment_block(&self, value: &u64);

    #[view(deploymentBlock)]
    #[storage_mapper("deployment_block")]
    fn deployment_block(&self) -> SingleValueMapper<u64>;
}
