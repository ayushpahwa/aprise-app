import { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { TransactionContext } from 'store/TransactionsContext';

export const NoTransactionUI = () => {
  const { ui } = useContext(TransactionContext);
  return (
    <View>
      <Text>No transactions yet, click here to record your first transaction</Text>
      <Button
        title="Add Transaction"
        onPress={() => {
          ui.openModal();
        }}
      />
    </View>
  );
};
