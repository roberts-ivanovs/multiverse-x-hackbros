import { ACCOUNTS_ENDPOINT, ExplorerLink } from 'components/sdkDappComponents';
import { contractAddress } from 'config';

export const ContractAddress = () => {
  return (
    <p className='w-full mb-5 overflow-hidden text-accent-100'>
      <label className='block text-xs text-gray-500 uppercase'>Contract</label>
      <ExplorerLink
        page={`/${ACCOUNTS_ENDPOINT}/${contractAddress}`}
        className='border-b border-gray-500 border-dotted hover:border-solid hover:border-gray-800'
      >
        {contractAddress}
      </ExplorerLink>
    </p>
  );
};
