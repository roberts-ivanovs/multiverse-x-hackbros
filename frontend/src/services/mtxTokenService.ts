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
  address: string,
  query?: MtxTokenSearchQuery
) => {
  // TODO: extract to config
  let url = `https://devnet-api.multiversx.com/accounts/${address}/tokens`;

  if (query !== undefined) {
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
  console.log(
    `Retrieving multiversx tokens - token count: ${JSON.stringify(
      response.data
    )}`
  );
  return response.data;
};
