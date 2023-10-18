import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { Wallet } from 'lucide-react';
import { Card } from '../card';
import Transaction from './transaction';

export function TransferCard() {
  const isLoggedIn = useGetIsLoggedIn();

  return (
    <Card
      icon={
        <div className='flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-900 rounded-full'>
          3
        </div>
      }
      title='Confirm asset transfer'
    >
      {isLoggedIn ? (
        <Transaction />
      ) : (
        <>
          <div className='flex flex-col items-center justify-center h-full gap-3 text-white'>
            <Wallet />
            Wallet not connected
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-red-500 rounded-full' />
            <p className='text-sm font-normal text-white'>
              Connect MultiversX wallet to use
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
