import BSCIcon from '@/assets/img/bsc.svg?react';
import ETHIcon from '@/assets/img/eth.svg?react';
import { ReactElement } from 'react';
import { create } from 'zustand';

interface Chain {
  name: string;
  icon: ReactElement;
}

export const chains: Chain[] = [
  { name: 'Ethereum (ETH)', icon: <ETHIcon className='w-6 h-6' /> },
  { name: 'Binance (BSC)', icon: <BSCIcon className='w-6 h-6' /> }
];

interface TransactionState {
  isToMx: boolean;
  setIsToMx: (a: boolean) => void;
  selectedChain: Chain;
  setSelectedChain: (name: string) => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  isToMx: true,
  setIsToMx: (a) => set({ isToMx: a }),
  selectedChain: chains[0],
  setSelectedChain: (name) =>
    set({ selectedChain: chains.find((chain) => chain.name === name) })
}));
