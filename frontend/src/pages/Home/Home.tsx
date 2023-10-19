import { Card } from '@/components';
import { MultiversXCard } from '@/components/Card/MultiversXCard/multiversx-card';
import { OtherTokenCard } from '@/components/Card/OtherTokenCard/other-token-card';
import { TransferCard } from '@/components/Card/TransferCard/transfer-card.component';
import { useTransactionStore } from '@/stores/transaction.store';
import { AnimatePresence, motion } from 'framer-motion';
import { RepeatIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageWrapper } from 'wrappers';

const chains = ['Cosmos', 'Ethereum', 'Solana', 'Binance'];

export const Home = () => {
  const [isToMx, setIsToMx] = useTransactionStore((state) => [
    state.isToMx,
    state.setIsToMx
  ]);
  const [animatedChainIdx, setAnimatedChainIdx] = useState(0);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      console.log('AAA');
      setAnimatedChainIdx((prev) => {
        if (prev + 1 >= chains.length) {
          return 0;
        } else {
          return prev + 1;
        }
      });
    }, 3000);

    return () => {
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <PageWrapper>
      <div className='flex flex-col w-full h-full'>
        <div className='my-10 shrink-0 flex-2'>
          <h1 className='z-10 mb-10 text-5xl lg:leading-[100px] font-bold text-white lg:text-7xl font-urbanist'>
            Your gateway to
            <div className='relative'>
              <span className='opacity-0'>_</span>
              <AnimatePresence>
                <motion.div
                  key={animatedChainIdx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  className='absolute top-0 z-0 text-accent-100'
                >
                  {chains[animatedChainIdx]}
                  <span className='absolute left-0 opacity-75 blur-xl'>
                    {chains[animatedChainIdx]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            chain
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
        <div className='flex w-full flex-col my-auto lg:flex-row justify-center gap-[24px] text-center sm:text-left font-medium'>
          <Card
            icon={
              <div className='flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-900 rounded-full'>
                1
              </div>
            }
            title='Connect your source wallet'
          >
            {isToMx ? <OtherTokenCard /> : <MultiversXCard />}
          </Card>
          <div
            className='z-10 flex items-center -my-[36px] self-center justify-center bg-gray-700 rounded-xl hover:bg-gray-600 duration-150 cursor-pointer w-[64px] -mx-[44px] h-fit'
            onClick={() => setIsToMx(!isToMx)}
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
            {!isToMx ? <OtherTokenCard /> : <MultiversXCard />}
          </Card>
          <TransferCard />
        </div>
      </div>
    </PageWrapper>
  );
};
