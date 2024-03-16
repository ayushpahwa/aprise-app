import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Transaction } from 'store/TransactionsContext';
import { NoTransactionUI } from './NoTransactionUI';
import { TransactionListItem } from './TransactionListItem';

interface Props {
  transactions: Transaction[];
}

export const TransactionsList = ({ transactions }: Props) => {
  return (
    <View style={styles.container}>
      {transactions.length === 0 ? <NoTransactionUI /> : <FlatList data={transactions} renderItem={({ item }) => <TransactionListItem transaction={item} />} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#ccc',
    padding: 24,
  },
});
