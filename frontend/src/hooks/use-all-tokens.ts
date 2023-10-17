import { host } from '@/utils/host';
import axios from 'axios';
import { useQuery } from 'react-query';

export function useAllTokens(userAddress: string) {
  return useQuery(
    ['tokens'],
    async () => {
      const { data } = await axios.get(`${host}/tokens/${userAddress}`);
      return data;
    },
    { enabled: !!userAddress }
  );
}
