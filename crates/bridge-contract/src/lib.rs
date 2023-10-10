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

    #[view(getMyValue)]
    #[storage_mapper("my_value")]
    fn my_value(&self) -> SingleValueMapper<usize>;

    #[view(deploymentBlock)]
    #[storage_mapper("deployment_block")]
    fn deployment_block(&self) -> SingleValueMapper<u64>;
}
