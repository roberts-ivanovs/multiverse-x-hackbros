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
}
