// TODO: remove in prod

import { Address } from '@multiversx/sdk-core';
import { getMtxTokens } from './mtxTokenService';
import {
  depositOnCustomContract,
  getTokenIds
} from './abi/mtxToCustomContractService';

const address =
  'erd1vudplk63q6fph97suwkqeafw2hmlgctp2aqszsxhv5ur3lkvgrmscg53uk';

// getting tokens from multivers-x
// const res_tokens = getMtxTokens(address);

// getting tokens from our simulated blockchain
// const res_tokens_custom = getTokenIds();

// depositing to our custom smart contract
const res_deposit = depositOnCustomContract('WEGLD-4505c8', '1.5');
