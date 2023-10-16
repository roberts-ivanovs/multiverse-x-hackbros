import json from '@/contracts/contract.abi.json';
import { contractAddress } from 'config';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';

const abi = AbiRegistry.create(json);

export const smartContract = new SmartContract({
  address: new Address(contractAddress),
  abi
});
