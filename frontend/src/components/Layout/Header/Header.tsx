import MultiversXLogo from '@/assets/img/multiversx-logo.svg?react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { environment } from 'config';
import { LinkIcon, WalletIcon } from 'lucide-react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const Header = () => {
  const [walletPopoverOpen, setIsWalletPopoverOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();

  return (
    <header className='flex flex-row items-center justify-between px-12 pt-6 align-center'>
      <div className='flex gap-1 lg:gap-5'>
        <MultiversXLogo className='w-[100px] h-6' />
        <div className='h-full w-[1px] bg-gray-700' />
        <h1 className='font-bold text-transparent lg:text-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text animate-text'>
          xChains
        </h1>
      </div>

      <nav className='w-full h-full text-sm sm:relative sm:left-auto sm:top-auto sm:flex sm:w-auto sm:flex-row sm:justify-end sm:bg-transparent'>
        <div className='container flex items-center justify-end gap-2 p-0 lg:mx-auto'>
          {isLoggedIn && (
            <Popover
              open={walletPopoverOpen}
              onOpenChange={setIsWalletPopoverOpen}
            >
              <PopoverTrigger asChild>
                <div className='flex items-center gap-2 p-2 px-4 text-white duration-150 rounded-lg cursor-pointer hover:bg-gray-700'>
                  <WalletIcon className='w-5' />
                  <span className='hidden lg:block'>Wallet</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className='p-2 bg-gray-700 border-none rounded-lg w-fit'>
                <CopyToClipboard
                  text={address}
                  onCopy={() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 3000);
                  }}
                >
                  <div className='p-2 text-sm flex items-center gap-2 text-white rounded-lg hover:bg-white/[0.2] duration-150 cursor-pointer'>
                    <LinkIcon className='w-4' />
                    {isCopied ? 'Copied!' : 'Copy wallet ID'}
                  </div>
                </CopyToClipboard>
              </PopoverContent>
            </Popover>
          )}

          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-green-500 rounded-full' />
            <p className='text-white'>{environment}</p>
          </div>
        </div>
      </nav>
    </header>
  );
};
