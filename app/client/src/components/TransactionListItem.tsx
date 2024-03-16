import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Transaction, TransactionContext } from 'store/TransactionsContext';
import { TRANSACTION_TYPES } from 'utils/constants';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import moment from 'moment';

interface TransactionListItemProps {
  transaction: Transaction;
}

export const TransactionListItem = ({ transaction }: TransactionListItemProps) => {
  const { ui, deleteTransaction } = useContext(TransactionContext);
  const signMultiplier = transaction.type === TRANSACTION_TYPES.EXPENSE ? -1 : 1;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transaction.amount * signMultiplier);
  const pressHandler = () => {
    ui.openModal(transaction.id.toString());
  };

  const txnDate = moment(transaction.createdAt).format('DD/MM/YYYY HH:mm');
  return (
    <Pressable style={styles.outerContainer} onPress={pressHandler}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <View style={styles.container}>
            <Text>{transaction.description}</Text>
            <Text>{formattedAmount}</Text>
          </View>
          <View style={styles.container}>
            <Text>{transaction.category}</Text>
            <Text>{txnDate}</Text>
          </View>
        </View>
        <Icon
          name="delete"
          size={24}
          color="red"
          onPress={() => {
            deleteTransaction(transaction.id);
          }}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 12,
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90%',
  },
});
