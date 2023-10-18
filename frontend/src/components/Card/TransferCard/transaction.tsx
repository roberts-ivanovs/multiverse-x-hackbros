import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useAllTokens } from '@/hooks/use-all-tokens';
import { useTokenTransfer } from '@/hooks/use-token-transfer';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { BigNumber } from 'bignumber.js';
import { ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Transaction() {
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [fromValue, setFromValue] = useState('');

  const gasFee = useMemo(
    () => new BigNumber(fromValue).multipliedBy(0.01),
    [fromValue]
  );

  const { address } = useGetAccountInfo();

  const { data: tokens } = useAllTokens(address);
  const [selectedTransferToken, setSelectedTransferToken] =
    useState<string>('USDC-123456');
  const selectedTokenName = useMemo(
    () =>
      tokens?.find((token) => token.mx_token_id === selectedTransferToken)
        ?.name,
    [tokens, selectedTransferToken]
  );
  const {
    data: transferResult,
    isSuccess,
    mutate: sendTransaction
  } = useTokenTransfer();
  const tokensToSend = useMemo(
    () => new BigNumber(fromValue || 0).minus(gasFee),
    [fromValue, gasFee]
  );
  console.log(transferResult, isSuccess);

  return (
    <>
      <div>
        <div className='mb-5'>
          <Label className='text-sm text-white/[0.3]'>You transfer from</Label>
          <div className='relative flex items-center my-1'>
            <Input
              placeholder='Amount'
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className='bg-black/[0.25] placeholder:text-white/[0.15] placeholder:text-sm placeholder:font-normal rounded-xl border-none outline-none text-white pr-[120px]'
              type='text'
            />
            <Popover
              open={isTokenSelectOpen}
              onOpenChange={setIsTokenSelectOpen}
            >
              <PopoverTrigger asChild>
                <button
                  role='combobox'
                  className='max-w-[120px] absolute right-1 text-xs justify-between flex p-2 bg-gray-700 text-white rounded-lg'
                >
                  {selectedTransferToken &&
                    tokens?.find(
                      (token) => token.mx_token_id === selectedTransferToken
                    )?.name}
                  <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
                </button>
              </PopoverTrigger>
              <PopoverContent className='p-2 bg-gray-700 border-none rounded-lg w-fit'>
                {tokens?.map((token, i) => (
                  <div
                    className='p-2 text-xs text-white rounded-lg hover:bg-white/[0.2] duration-150 cursor-pointer'
                    key={i}
                    onClick={() => {
                      setSelectedTransferToken(token.mx_token_id);
                      setIsTokenSelectOpen(false);
                    }}
                  >
                    {token.name}
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          <p className='text-xs text-white'>
            <span className='text-white/[0.3]'>Balance: </span>
            {`${tokens?.find(
              (token) => token.mx_token_id === selectedTransferToken
            )?.your_balance} ${selectedTokenName}`}
          </p>
        </div>
        <div>
          <Label className='text-sm text-white/[0.3]'>You receive on</Label>
          <Input
            placeholder='Calculated amount'
            disabled={true}
            value={`${tokensToSend} ${selectedTokenName}`}
            className='bg-black/[0.25] my-1 placeholder:text-white/[0.15] placeholder:text-sm placeholder:font-normal rounded-xl border-none outline-none text-white pr-[120px]'
            type='text'
          />
          <p className='text-xs text-white'>
            <span className='text-white/[0.3]'>Transfer fee: </span>
            {`${gasFee} ${tokens?.find(
              (token) => token.mx_token_id === selectedTransferToken
            )?.name}`}
          </p>
        </div>
      </div>
      <button
        onClick={() =>
          sendTransaction({
            userAddress: address,
            amount: tokensToSend.toString(),
            token: selectedTransferToken
          })
        }
        className='w-full py-2 text-sm font-bold text-white bg-gray-700 rounded-md'
      >
        Confirm
      </button>
    </>
  );
}
