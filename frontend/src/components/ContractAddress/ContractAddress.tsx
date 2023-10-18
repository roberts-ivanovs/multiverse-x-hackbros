import { ACCOUNTS_ENDPOINT, ExplorerLink } from 'components/sdkDappComponents';
import { contractAddress } from 'config';

export const ContractAddress = () => {
  return (
    <p className='mb-5 text-left truncate text-accent-10'>
      <label className='block text-xs text-gray-500 uppercase'>Contract</label>
      <ExplorerLink
        page={`/${ACCOUNTS_ENDPOINT}/${contractAddress}`}
        className='!ml-0 text-sm border-b border-gray-500 w-full border-dotted text-white hover:border-solid hover:border-gray-800'
      >
        {contractAddress}
      </ExplorerLink>
    </p>
  );
};
