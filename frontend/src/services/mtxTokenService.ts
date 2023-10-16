import axios, { AxiosResponse } from 'axios';
import { Address } from '@multiversx/sdk-core';

interface MtxTokenSearchQuery {
  from: string;
  size: number;
  type: 'FungibleESDT' | 'MetaESDT';
  name: string;
  identifier: string;
  identifiers: string;
  includeMetaESDT: boolean;
}

export const getMtxTokens = async (
  address: Address,
  query?: MtxTokenSearchQuery
) => {
  // TODO: extract to config
  let url = `https://devnet-api.multiversx.com/accounts/${address.toString()}/tokens`;

  if (typeof query !== undefined) {
    url += '?';
    url += `from=${query?.from}&`;
    url += `size=${query?.size}&`;
    url += `type=${query?.type}&`;
    url += `name=${query?.name}&`;
    url += `identifier=${query?.identifier}&`;
    url += `identifiers=${query?.identifiers}&`;
    url += `includeMetaESDT=${query?.includeMetaESDT}`;
  }

  const response: AxiosResponse = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log(`Retrieving multiversx tokens - status: ${response.status}`);
  console.log(`Retrieving multiversx tokens - data: ${response.data}`);
  return response.data;
};
