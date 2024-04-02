import { TransactionsList } from 'components/TransactionList';
import { useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Transaction, TransactionContext } from 'store/TransactionsContext';

const Details = () => {
  const { fetchTransactions } = useContext(TransactionContext);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  useMemo(async () => {
    const transactions = await fetchTransactions({});
    setTransactions(transactions);
  }, [fetchTransactions]);

  return (
    <View>
      <TransactionsList transactions={transactions} />
    </View>
  );
};

export default Details;
