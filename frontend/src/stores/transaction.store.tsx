import { create } from 'zustand';

interface TransactionState {
  isToMx: boolean;
  setIsToMx: (a: boolean) => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  isToMx: true,
  setIsToMx: (a) => set({ isToMx: a })
}));
