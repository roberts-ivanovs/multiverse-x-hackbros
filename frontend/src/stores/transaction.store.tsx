import { create } from 'zustand';

export enum TransactionType {
  ToMultiversX,
  FromMultiversX
}

interface TransactionState {
  transactionType: TransactionType;
  setTransactionType: (t: TransactionType) => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transactionType: TransactionType.ToMultiversX,
  setTransactionType: (t: TransactionType) => set({ transactionType: t })
}));
