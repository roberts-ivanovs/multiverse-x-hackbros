#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract {
    #[view(getValue)]
    #[storage_get("value")]
    fn get_value(&self) -> BigUint;

    // #[view(getDeploymentBlock)]
    // #[storage_get("deployment_block")]
    // fn get_deployment_block(&self) -> u64;

    #[init]
    fn init(&self) {
        // self.set_deployment_block(&self.blockchain().get_block_nonce());
    }

    #[endpoint(setValue)]
    #[storage_set("value")]
    fn set_value(&self, value: &BigUint);

    // #[storage_set("deployment_block")]
    // fn set_deployment_block(&self, value: &u64);
}
