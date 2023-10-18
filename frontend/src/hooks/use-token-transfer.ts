import { host } from '@/utils/host';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export function useTokenTransfer() {
  const queryClient = useQueryClient();
  return useMutation(
    ['tokens'],
    async ({
      userAddress,
      amount,
      token
    }: {
      userAddress: string;
      amount: string;
      token: string;
    }) => {
      const { data } = await axios.post(`${host}/tokens/${userAddress}`, {
        amount,
        token_denom: token
      });
      return data;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['tokens']);
      }
    }
  );
}
