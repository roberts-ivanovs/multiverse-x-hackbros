import { getChainId } from '@/utils/getChainId';
import { host } from '@/utils/host';
import { smartContract } from '@/utils/smartContract';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import {
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account/refreshAccount';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export function useTokenTransfer() {
  const queryClient = useQueryClient();

  const { mutate: transferToMx, isLoading: toMxLoading } = useMutation(
    ['tokens'],
    async ({
      userAddress,
      amount,
      tokenId: token_id
    }: {
      userAddress: string;
      amount: string;
      tokenId: string;
    }) => {
      const { data } = await axios.post(`${host}/tokens/${userAddress}`, {
        amount,
        token_id
      });
      return data;
    },
    {
      onSuccess() {
        toast.success('Successfully transferred tokens to MultiversX chain');
        queryClient.invalidateQueries(['tokens']);
      },
      onError() {
        toast.error('Something went wrong while transferring tokens');
      }
    }
  );

  const { mutate: transferFromMx, isLoading: fromMxLoading } = useMutation(
    ['tokens'],
    async ({
      userAddress,
      amount,
      tokenId
    }: {
      userAddress: string;
      amount: string;
      tokenId: string;
    }) => {
      removeAllSignedTransactions();
      removeAllTransactionsToSign();

      const transfer1 = TokenTransfer.fungibleFromAmount(tokenId, amount, 18);

      const pingTransaction = smartContract.methodsExplicit
        .deposit()
        // .withValue(amount ?? '0')
        .withSender(new Address(userAddress))
        .withGasLimit(20_000_0000)
        .withSingleESDTTransfer(transfer1)
        .withChainID(getChainId())
        .buildTransaction()
        .toPlainObject();

      await refreshAccount();
      const { sessionId } = await sendTransactions({
        transactions: pingTransaction,
        transactionsDisplayInfo: {
          processingMessage: 'Processing token transfer',
          errorMessage: 'An error has occured during transfer',
          successMessage: 'Token transaction successful'
        },
        redirectAfterSign: false
      });
    },
    {
      onSuccess() {
        toast.success('Redirecting...');
        queryClient.invalidateQueries(['tokens']);
      },
      onError() {
        toast.error('Something went wrong while transferring tokens');
      }
    }
  );

  return {
    transferFromMx,
    transferToMx,
    isLoading: toMxLoading || fromMxLoading
  };
}
