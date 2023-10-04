#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait VaultContract {
    #[view]
    #[storage_mapper("target")]
    fn target(&self) -> SingleValueMapper<BigUint>;

    #[init]
    fn init(&self, target: BigUint) {
        self.target().set(&target);
    }
}
