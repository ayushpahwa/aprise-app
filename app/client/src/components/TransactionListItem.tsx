import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TRANSACTION_TYPES } from 'constants/txnConstants';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import moment from 'moment';
import { Transaction } from 'constants/types/txnTypes';

interface TransactionListItemProps {
  transaction: Transaction;
}

export const TransactionListItem = ({ transaction }: TransactionListItemProps) => {
  const signMultiplier = transaction.type === TRANSACTION_TYPES.EXPENSE ? -1 : 1;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transaction.amount * signMultiplier);
  const pressHandler = () => {
    console.log('Transaction clicked', transaction.id);
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
            <Text>{txnDate}</Text>
          </View>
        </View>
        <Icon
          name="delete"
          size={24}
          color="red"
          onPress={() => {
            console.log('Delete transaction', transaction.id);
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
