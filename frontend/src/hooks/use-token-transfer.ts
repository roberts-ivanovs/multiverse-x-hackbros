import { host } from '@/utils/host';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export function useTokenTransfer() {
  const queryClient = useQueryClient();

  const { mutate: transferToMx } = useMutation(
    ['tokens'],
    async ({
      userAddress,
      amount,
      token_id
    }: {
      userAddress: string;
      amount: string;
      token_id: string;
    }) => {
      const { data } = await axios.post(`${host}/tokens/${userAddress}`, {
        amount,
        token_id
      });
      return data;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['tokens']);
      }
    }
  );

  const { mutate: transferFromMx } = useMutation(
    ['tokens'],
    async ({ signer }) => {
      // SDK logic
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['tokens']);
      }
    }
  );

  return { transferFromMx, transferToMx };
}
