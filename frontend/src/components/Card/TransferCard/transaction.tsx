import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useSendTokensFromMx } from '@/hooks/transactions/useSendTokensFromMx';
import { useAllTokens } from '@/hooks/use-all-tokens';
import { useTokenTransfer } from '@/hooks/use-token-transfer';
import { useTransactionStore } from '@/stores/transaction.store';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { BigNumber } from 'bignumber.js';
import { ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Transaction() {
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [fromValue, setFromValue] = useState('');
  const [isToMx] = useTransactionStore((state) => [state.isToMx]);

  const formatNumber = (numWithZeros: string, decimals: number) => {
    decimals = decimals - 1;
    const bigIntNum = BigInt(numWithZeros);

    let numStr = bigIntNum.toString();

    while (numStr.length < decimals) {
      numStr = '0' + numStr;
    }

    const integerPart = numStr.slice(0, -decimals);
    // const decimalPart = numStr.slice(-decimals);

    return `${integerPart}`;
  };

  function unformatNumber(formattedNum: string, decimals: number) {
    decimals = decimals - 1;
    // Remove the decimal point from the formatted number
    const numWithoutDecimal = formattedNum.replace('.', '');

    // Ensure the number has exactly 18 digits after where the decimal point was
    let numStr = numWithoutDecimal;
    while (numStr.length < decimals) {
      numStr += '0';
    }

    // Convert to a BigNumber for any further arithmetic operations
    const bigNum = new BigNumber(numStr);

    return bigNum;
  }

  const gasFee = useMemo(
    () => new BigNumber(fromValue).multipliedBy(0.01),
    [fromValue]
  );

  const { address } = useGetAccountInfo();

  const { data: tokens } = useAllTokens(address);

  const [selectedTransferToken, setSelectedTransferToken] =
    useState<string>('USDC-0e4543');
  const selectedToken = useMemo(
    () => tokens?.find((token) => token.mx_token_id === selectedTransferToken),
    [tokens, selectedTransferToken]
  );

  const { transferFromMx, transferToMx } = useTokenTransfer();

  console.log(tokens);
  const tokensToSend = useMemo(
    () => new BigNumber(fromValue || 0).minus(gasFee),
    [fromValue, gasFee]
  );

  const { sendTokenFromMx } = useSendTokensFromMx();

  return (
    <>
      <p className='text-white'>{address}</p>
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
          {selectedToken && (
            <p className='text-xs text-white'>
              <span className='text-white/[0.3]'>Balance: </span>
              {`${formatNumber(
                selectedToken.your_balance,
                selectedToken.decimals
              )} ${selectedToken.name}`}
            </p>
          )}
        </div>
        <div>
          <Label className='text-sm text-white/[0.3]'>You receive on</Label>
          <Input
            placeholder='Calculated amount'
            disabled={true}
            value={`${tokensToSend} ${selectedToken?.name}`}
            className='bg-black/[0.25] my-1 placeholder:text-white/[0.15] placeholder:text-sm placeholder:font-normal rounded-xl border-none outline-none text-white pr-[120px]'
            type='text'
          />
          <p className='text-xs text-white'>
            <span className='text-white/[0.3]'>Transfer fee: </span>
            {`${gasFee} ${selectedToken?.name}`}
          </p>
        </div>
      </div>
      {selectedToken && (
        <button
          onClick={() => {
            if (isToMx) {
              transferToMx({
                userAddress: address,
                amount: unformatNumber(
                  tokensToSend.toString(),
                  selectedToken.decimals
                ).toString(),
                token_id: selectedToken.mx_token_id
              });
            } else {
              console.log('SENT TOKENS FROM MULTIVERSEX');
              sendTokenFromMx(
                unformatNumber(
                  tokensToSend.toString(),
                  selectedToken.decimals
                ).toString(),
                selectedToken.mx_token_id
              );
              // transferFromMx({});
            }
          }}
          className='w-full py-2 text-sm font-bold text-white bg-gray-700 rounded-md'
        >
          Confirm
        </button>
      )}
    </>
  );
}
