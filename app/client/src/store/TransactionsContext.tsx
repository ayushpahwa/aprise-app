import { createContext, useEffect, useState } from 'react';
import { dummyTxnData } from './dummyData';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

export interface TransactionSearchParams {
  type?: string;
  startDate?: string;
  endDate?: string;
}

interface TransactionUIState {
  isOpen: boolean;
  isLoading: boolean;
  selectedTxnId: string;
  openModal: (id?: string) => void;
  closeModal: () => void;
}

interface TransactionsContextData {
  ui: TransactionUIState;
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
  fetchTransactions: (searchParams: TransactionSearchParams) => Promise<Transaction[]>;
  deleteTransaction: (id: number) => Promise<void>;
  fetchTransactionById: (id: number) => Promise<Transaction | undefined>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
}

export const TransactionContext = createContext<TransactionsContextData>({
  ui: {
    isOpen: false,
    isLoading: false,
    selectedTxnId: '',
    openModal: async () => {},
    closeModal: async () => {},
  },
  transactions: [],
  createTransaction: async () => {},
  fetchTransactions: async () => [],
  fetchTransactionById: async () => undefined,
  deleteTransaction: async () => {},
  updateTransaction: async () => {},
});

function TransactionContextProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTxnId, setSelectedTxnId] = useState('');

  useEffect(() => {
    const txnData = dummyTxnData();
    setTransactions(txnData);
  }, []);

  const ui = {
    isOpen: isModalOpen,
    isLoading: false,
    selectedTxnId,
    openModal: async (id = '') => {
      setSelectedTxnId(id);
      setIsModalOpen(true);
    },
    closeModal: async () => {
      setSelectedTxnId('');
      setIsModalOpen(false);
    },
  };

  async function createTransaction(transactionInput: TransactionInput) {
    const newTransaction = {
      id: transactions.length + 1,
      createdAt: new Date().toISOString(),
      ...transactionInput,
    };
    setTransactions([...transactions, newTransaction]);
  }

  async function fetchTransactions(searchParams: TransactionSearchParams) {
    let filteredTransactions = transactions;

    // return this if there are no search params
    if (Object.keys(searchParams).length) {
      if (searchParams.type) {
        filteredTransactions = transactions.filter((transaction) => transaction.type === searchParams.type);
      } else if (searchParams.startDate && searchParams.endDate) {
        const startDate = new Date(searchParams.startDate);
        const endDate = new Date(searchParams.endDate);
        filteredTransactions = transactions.filter((transaction) => {
          return new Date(transaction.createdAt) >= new Date(startDate) && new Date(transaction.createdAt) <= new Date(endDate);
        });
      }
    }

    // sort transactions by date
    filteredTransactions.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filteredTransactions;
  }

  async function deleteTransaction(id: number) {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
  }

  async function updateTransaction(transaction: Transaction) {
    const updatedTransactions = transactions.map((t) => (t.id === transaction.id ? transaction : t));
    setTransactions(updatedTransactions);
  }

  async function fetchTransactionById(id: number) {
    return transactions.find((transaction) => transaction.id === id);
  }

  const value = {
    ui,
    transactions,
    createTransaction,
    fetchTransactions,
    deleteTransaction,
    updateTransaction,
    fetchTransactionById,
  };
  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export default TransactionContextProvider;
