import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useAllTokens } from '@/hooks/use-all-tokens';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const tokens = ['USDC', 'ETH', 'EVMOS', 'WrappedMX'] as const;
type Token = (typeof tokens)[number];

export default function Transaction() {
  const [selectedTransferToken, setSelectedTransferToken] =
    useState<Token>('USDC');
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const { address } = useGetAccountInfo();

  const { data } = useAllTokens(address);
  console.log(data);
  return (
    <div>
      <div className='mb-5'>
        <Label className='text-sm text-white/[0.3]'>You transfer from</Label>
        <div className='relative flex items-center'>
          <Input
            placeholder='Amount'
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className='bg-black/[0.25] placeholder:text-white/[0.15] placeholder:text-sm placeholder:font-normal rounded-xl border-none outline-none text-white pr-[120px]'
            type='text'
          />
          <Popover open={isTokenSelectOpen} onOpenChange={setIsTokenSelectOpen}>
            <PopoverTrigger asChild>
              <button
                role='combobox'
                className='max-w-[120px] absolute right-1 text-xs justify-between flex p-2 bg-gray-700 text-white rounded-lg'
              >
                {selectedTransferToken}
                <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              {tokens.map((token, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedTransferToken(token);
                    setIsTokenSelectOpen(false);
                  }}
                >
                  {token}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Label className='text-sm text-white/[0.3]'>You transfer from</Label>
        <Input
          placeholder='Amount'
          value={toValue}
          onChange={(e) => setToValue(e.target.value)}
          className='bg-black/[0.25] placeholder:text-white/[0.15] placeholder:text-sm placeholder:font-normal rounded-xl border-none outline-none text-white pr-[120px]'
          type='text'
        />
      </div>
    </div>
  );
}
