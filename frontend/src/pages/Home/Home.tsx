import { Card } from '@/components';
import { MultiversXCard } from '@/components/Card/MultiversXCard/multiversx-card';
import { OtherTokenCard } from '@/components/Card/OtherTokenCard/other-token-card';
import { TransferCard } from '@/components/Card/TransferCard/transfer-card.component';
import { RepeatIcon } from 'lucide-react';
import { useState } from 'react';
import { PageWrapper } from 'wrappers';

export const Home = () => {
  const [isToMultiversx, setIsToMultiversx] = useState(true);

  return (
    <PageWrapper>
      <div className='flex flex-col items-center w-full h-full'>
        <div className='self-start my-10'>
          <h1 className='mb-10 text-5xl font-bold text-white'>
            <span className='underline decoration-accent-100 decoration-dotted hover:decoration-solid'>
              IBC protocol
            </span>{' '}
            for MultiversX
          </h1>
          <p className='text-gray-400'>
            The{' '}
            <a
              href='https://www.npmjs.com/package/@multiversx/sdk-dapp'
              target='_blank'
              className='text-gray-400 underline decoration-dotted hover:decoration-solid'
            >
              sdk-dapp
            </a>{' '}
            starter project for any dApp <br className='hidden xl:block' />
            built on the{' '}
            <a
              href='https://multiversx.com/'
              target='_blank'
              className='text-gray-400 underline decoration-dotted hover:decoration-solid'
            >
              MultiversX
            </a>{' '}
            blockchain.
          </p>
        </div>
        <div className='flex flex-col lg:flex-row my-auto self-start w-full gap-[24px] text-center sm:text-left font-medium'>
          <Card
            icon={
              <div className='flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-900 rounded-full'>
                1
              </div>
            }
            title='Connect your source wallet'
          >
            {isToMultiversx ? <OtherTokenCard /> : <MultiversXCard />}
          </Card>
          <div
            className='z-10 flex items-center -my-[36px] self-center justify-center bg-gray-700 rounded-xl hover:bg-gray-600 duration-150 cursor-pointer w-[64px] -mx-[44px] h-fit'
            onClick={() => setIsToMultiversx((prev) => !prev)}
          >
            <RepeatIcon className='w-full h-[46px] p-3 text-white ' />
          </div>
          <Card
            icon={
              <div className='flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-900 rounded-full'>
                2
              </div>
            }
            title='Connect your destination wallet'
          >
            {!isToMultiversx ? <OtherTokenCard /> : <MultiversXCard />}
          </Card>
          <TransferCard />
        </div>
      </div>
    </PageWrapper>
  );
};
