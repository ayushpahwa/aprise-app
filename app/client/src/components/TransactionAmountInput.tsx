import { StyleSheet, TextInput } from 'react-native';
import { TRANSACTION_TYPES } from 'constants/txnConstants';

interface Props {
  amount: string;
  onChange: (value: string) => void;
  // Add the transactionType prop which is can be either TRANSACTION_TYPES.EXPENSE or TRANSACTION_TYPES.INCOME
  transactionType: string;
}

export const TransactionAmountInput = ({ transactionType, amount, onChange }: Props) => {
  const sign = transactionType === TRANSACTION_TYPES.EXPENSE ? '-' : '+';
  return (
    <TextInput
      style={styles.input}
      placeholder="Amount"
      keyboardType="decimal-pad"
      value={`${sign} $${amount}`}
      onChangeText={(rawText) => onChange(rawText.substring(3))}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
