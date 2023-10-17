import { host } from '@/utils/host';
import axios from 'axios';
import { UseQueryResult, useQuery } from 'react-query';

export function useAllTokens(userAddress: string): UseQueryResult<
  {
    name: string;
    decimals: number;
    your_balance: string;
    symbol: string;
    mx_token_id: string;
  }[]
> {
  return useQuery(
    ['tokens'],
    async () => {
      const { data } = await axios.get(`${host}/tokens/${userAddress}`);
      return data;
    },
    { enabled: !!userAddress }
  );
}
