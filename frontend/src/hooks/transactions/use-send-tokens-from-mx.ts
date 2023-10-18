import { getChainId } from '@/utils/getChainId';
import { smartContract } from '@/utils/smartContract';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import {
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account/refreshAccount';
import { useGetAccountInfo } from '../sdkDappHooks';

export const useSendTokensFromMx = () => {
  const { address } = useGetAccountInfo();

  const clearAllTransactions = () => {
    removeAllSignedTransactions();
    removeAllTransactionsToSign();
  };

  const sendTokenFromMx = async (amount: string, tokenId: string) => {
    clearAllTransactions();

    const transfer1 = TokenTransfer.fungibleFromAmount(tokenId, amount, 18);

    const pingTransaction = smartContract.methodsExplicit
      .deposit()
      // .withValue(amount ?? '0')
      .withSender(new Address(address))
      .withGasLimit(20_000_0000)
      .withSingleESDTTransfer(transfer1)
      .withChainID(getChainId())
      .buildTransaction()
      .toPlainObject();

    await refreshAccount();
    const { sessionId } = await sendTransactions({
      transactions: pingTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });

    // sessionStorage.setItem(type, sessionId);
    // setPingPongSessionId(sessionId);
  };

  return { sendTokenFromMx };
};
