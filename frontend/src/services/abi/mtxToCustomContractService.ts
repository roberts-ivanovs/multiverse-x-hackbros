import { ResultsParser } from 'utils';
import { smartContract } from 'utils/smartContract';
import {
  TokenTransfer,
  GasEstimator,
  TransferTransactionsFactory,
  Address
} from '@multiversx/sdk-core';
import { ContractFunction, U64Value } from '@multiversx/sdk-core/out';
import { getChainId } from '@/utils/getChainId';
import {
  ApiNetworkProvider,
  ProxyNetworkProvider,
  TransactionOnNetwork
} from '@multiversx/sdk-network-providers/out';
import axios, { AxiosResponse } from 'axios';
import {
  WalletProvider,
  WALLET_PROVIDER_DEVNET
} from '@multiversx/sdk-web-wallet-provider';

const resultsParser = new ResultsParser();

// TODO: replace with a correct URL
// const proxy = new ProxyNetworkProvider('https://devnet-gateway.multiversx.com');
const API_URL = 'https://devnet-api.multiversx.com';
const proxy = new ApiNetworkProvider(API_URL);

export const depositOnCustomContract = async (
  tokenId: string,
  amount: string,
  numDecimals = 2
) => {
  try {
    // https://github.com/multiversx/mx-sdk-js-examples/blob/5049a911701c039cccc9eb5a25b0f0705222b819/cookbook/generated/basic.md
    // const transferCall = smartContract.methods
    //   .deposit()
    //   .withSingleESDTTransfer(
    //     TokenTransfer.fungibleFromAmount(tokenId, amount, numDecimals)
    //   )
    //   .buildTransaction();
    // console.log(transferCall);
    // return transferCall;

    const factory = new TransferTransactionsFactory(new GasEstimator());
    const transfer1 = TokenTransfer.fungibleFromAmount(
      tokenId,
      amount,
      numDecimals
    );

    const tx1 = factory.createESDTTransfer({
      tokenTransfer: transfer1,
      nonce: 7,
      sender: new Address(
        'erd1vudplk63q6fph97suwkqeafw2hmlgctp2aqszsxhv5ur3lkvgrmscg53uk'
      ),
      receiver: smartContract.getAddress(),
      chainID: getChainId()
    });

    const signer = new WalletProvider(WALLET_PROVIDER_DEVNET);
    await signer.signTransaction(tx1);

    signer.walletConnectAccount;
    const serializedTransaction = tx1.serializeForSigning();
    const transactionSignature = await signer.sign(serializedTransaction);
    tx1.applySignature(transactionSignature);

    const data = tx1.toSendable();

    const response: AxiosResponse = await axios.post(
      `${API_URL}/transactions`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const txHash = response.data.txHash;
    const txResponse = await axios.get(`${API_URL}/transactions/${txHash}`);
    const transactionOnNetwork = TransactionOnNetwork.fromApiHttpResponse(
      txHash,
      txResponse.data
    );

    // const tx1 = smartContract.methodsExplicit
    //   .deposit()
    //   .withGasLimit(60000000)
    //   .withChainID(getChainId())
    //   .withSender(
    //     new Address(
    //       'erd1vudplk63q6fph97suwkqeafw2hmlgctp2aqszsxhv5ur3lkvgrmscg53uk'
    //     )
    //   )
    //   .withSingleESDTTransfer(
    //     TokenTransfer.fungibleFromAmount(tokenId, amount, numDecimals)
    //   )
    //   .buildTransaction()
    //   .toPlainObject();

    console.log(tx1);
    console.log(response.data);
    // console.log(`Transaction hash: ${txHash}`);
    // console.log(`Transaction data: ${transactionOnNetwork.data}`);
    // console.log(`Transaction result: ${transactionOnNetwork.contractResults}`);

    // console.log(res);
    // return res;
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

export const getTokenIds = async () => {
  try {
    const query = smartContract.createQuery({
      func: new ContractFunction('getTokenIds')
    });

    const queryResponse = await proxy.queryContract(query);
    const endpointDefinition = smartContract.getEndpoint('getTokenIds');

    const res = resultsParser.parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    console.log(`Return values: ${res.values}`);
    console.log(`Return code: ${res.returnCode}`);
    console.log(`Return msg: ${res.returnMessage}`);
    return res;
  } catch (err) {
    console.error('Unable to get tokens list', err);
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
