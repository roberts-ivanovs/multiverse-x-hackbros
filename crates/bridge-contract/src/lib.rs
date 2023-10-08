
#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract { 
    #[view(getValue)] #[storage_get("value")]
    fn get_value(&self) -> BigUint;

    #[init]
    fn init(&self) {}

    #[endpoint(setValue)]
    #[storage_set("value")]
    fn set_value(&self, value: &BigUint);

}
