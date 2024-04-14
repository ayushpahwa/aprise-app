import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TRANSACTION_TYPES } from 'constants/txnConstants';
import moment from 'moment';
import { Transaction } from 'constants/types/txnTypes';
import { useMemo } from 'react';

interface TransactionListItemProps {
  transaction: Transaction;
}

export const TransactionListItem = ({ transaction }: TransactionListItemProps) => {
  const formattedAmount = useMemo(() => {
    const signMultiplier = transaction.type === TRANSACTION_TYPES.EXPENSE ? -1 : 1;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: transaction.currency.symbol,
    }).format((transaction.amount / 100) * signMultiplier);
  }, [transaction.amount, transaction.currency.symbol, transaction.type]);

  const pressHandler = () => {
    console.log('Transaction clicked', transaction.id);
  };

  // Format the time to show only hours and minutes and convert to local time from UTC
  const txnDate = useMemo(() => {
    const dateObj = moment(transaction.createdAt).add(moment().utcOffset(), 'minutes');
    return dateObj.format('h:mm A');
  }, [transaction.createdAt]);

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
    width: '100%',
  },
});
