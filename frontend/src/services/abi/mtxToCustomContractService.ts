import { ProxyNetworkProvider, ResultsParser } from 'utils';
import { smartContract } from 'utils/smartContract';
import { TokenTransfer } from '@multiversx/sdk-core';
import { ContractFunction, U64Value } from '@multiversx/sdk-core/out';

const resultsParser = new ResultsParser();

// TODO: replace with a correct URL
const proxy = new ProxyNetworkProvider('https://devnet-gateway.multiversx.com');

export const depositOnCustomContract = async (
  tokenId: string,
  amount: string,
  numDecimals = 2
) => {
  try {
    // https://github.com/multiversx/mx-sdk-js-examples/blob/5049a911701c039cccc9eb5a25b0f0705222b819/cookbook/generated/basic.md
    const transferCall = smartContract.methods
      .deposit()
      .withSingleESDTTransfer(
        TokenTransfer.fungibleFromAmount(tokenId, amount, numDecimals)
      );

    // const txHash = transferCall.buildTransaction().getHash().toString();
    // const tx = await proxy.getTransaction(txHash);
    // const res = resultsParser.parseOutcome(tx, transferCall.getEndpoint())
    //   .firstValue;
    
    // console.log(res);
    // return res;

    console.log(transferCall);
    return transferCall
  } catch (err) {
    console.error('Unable to transfer to "deposit"', err);
  }
};

export const getDepositTokenId = async (depositId: number) => {
  try {
    const query = smartContract.createQuery({
      func: new ContractFunction('getDepositTokenId'),
      args: [new U64Value(depositId)]
    });

    const queryResponse = await proxy.queryContract(query);
    const endpointDefinition = smartContract.getEndpoint('getDepositTokenId');
    return resultsParser.parseQueryResponse(queryResponse, endpointDefinition)
      .firstValue;
  } catch (err) {
    console.error('Unable to get deposit token id', err);
  }
};

export const getDepositAddress = async (depositId: number) => {
  try {
    const query = smartContract.createQuery({
      func: new ContractFunction('getDepositAddress'),
      args: [new U64Value(depositId)]
    });

    const queryResponse = await proxy.queryContract(query);
    const endpointDefinition = smartContract.getEndpoint('getDepositAddress');
    return resultsParser.parseQueryResponse(queryResponse, endpointDefinition)
      .firstValue;
  } catch (err) {
    console.error('Unable to get deposit address', err);
  }
};
