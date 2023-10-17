// TODO: remove in prod

import { Address } from '@multiversx/sdk-core';
import { getMtxTokens } from './mtxTokenService';
import { depositOnCustomContract } from './abi/mtxToCustomContractService';

const address = "erd1vudplk63q6fph97suwkqeafw2hmlgctp2aqszsxhv5ur3lkvgrmscg53uk";

// getting tokens from multivers-x
const res_tokens = getMtxTokens(address);

// depositing to our custom smart contract
const res_deposit = depositOnCustomContract("HYPE-7f129a", "1.5");