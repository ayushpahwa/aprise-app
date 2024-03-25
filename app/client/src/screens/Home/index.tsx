import { Button } from '@ui-kitten/components';
import { TransactionsList } from 'components/TransactionList';
import { useContext, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from 'store/AuthContext';
import { Transaction, TransactionContext } from 'store/TransactionsContext';

const Home = () => {
  const { fetchTransactions } = useContext(TransactionContext);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const { removeToken } = useContext(AuthContext);

  useMemo(async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    // const transactions = await fetchTransactions({});
    const transactions = await fetchTransactions({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
    setTransactions(transactions);
  }, [fetchTransactions]);

  return (
    <View>
      <Button onPress={removeToken}>Logout</Button>
      <Text>Transactions from last 7 days</Text>
      <TransactionsList transactions={transactions} />
    </View>
  );
};

export default Home;
