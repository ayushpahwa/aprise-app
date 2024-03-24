import { TRANSACTION_TYPES } from 'constants/txnConstants';
import { Transaction } from './TransactionsContext';

export const dummyTxnData = () => {
  const output: Transaction[] = new Array(10).fill(0).map((_, index) => ({
    id: index,
    description: `Transaction ${index}`,
    amount: Math.random() * 100,
    type: Math.random() > 0.5 ? TRANSACTION_TYPES.EXPENSE : TRANSACTION_TYPES.INCOME,
    category: 'General',
    createdAt: new Date(Date.now() - Math.random() * 60 * 60 * 24 * 15 * 1000).toISOString(),
  }));
  return output;
};
