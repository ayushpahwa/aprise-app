import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useContext, useMemo, useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TextInput } from 'react-native';
import { Transaction, TransactionContext } from 'store/TransactionsContext';
import { TRANSACTION_TYPES } from 'constants/txnConstants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TransactionAmountInput } from './TransactionAmountInput';

const TransactionTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.INCOME];

const validateInputs = (amount: string, description: string) => {
  // check amount validity, it should be a number and greater than 0
  const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
  return amount.length > 0 && description.length > 0 && isAmountValid;
};

export const TransactionModal = () => {
  const { ui, createTransaction, updateTransaction, fetchTransactionById } = useContext(TransactionContext);
  const { isOpen, closeModal } = ui;
  const [transactionTypeIndex, setTransactionTypeIndex] = useState(0);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  useMemo(async () => {
    const mode = ui.selectedTxnId.length > 0 ? 'edit' : 'create';
    const fetchedTransaction = mode === 'edit' ? await fetchTransactionById(parseInt(ui.selectedTxnId)) : undefined;
    if (fetchedTransaction) {
      setDescription(fetchedTransaction.description);
      setAmount(fetchedTransaction.amount.toString());
      setTransactionTypeIndex(fetchedTransaction.type === TRANSACTION_TYPES.EXPENSE ? 0 : 1);
    }
    setSelectedTransaction(fetchedTransaction);
  }, [fetchTransactionById, ui.selectedTxnId]);
  const resetInputs = () => {
    setDescription('');
    setAmount('');
    setTransactionTypeIndex(0);
    setSelectedTransaction(undefined);
  };
  const handleSave = async () => {
    if (!validateInputs(amount, description)) return;
    // save transaction
    await createTransaction({
      type: TransactionTypes[transactionTypeIndex],
      description,
      amount: parseFloat(amount),
      category: 'General',
    });
    handleClose();
  };
  const handleUpdate = async () => {
    if (!validateInputs(amount, description) || !selectedTransaction) return;
    // update transaction
    await updateTransaction({
      ...selectedTransaction,
      type: TransactionTypes[transactionTypeIndex],
      description,
      amount: parseFloat(amount),
    });
    handleClose();
  };
  const handleClose = () => {
    resetInputs();
    closeModal();
  };
  return (
    <Modal visible={isOpen} onDismiss={closeModal} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>Record your transaction</Text>
        <View style={styles.formContainer}>
          <SegmentedControl
            values={TransactionTypes}
            selectedIndex={transactionTypeIndex}
            onChange={() => {
              setTransactionTypeIndex(transactionTypeIndex === 0 ? 1 : 0);
            }}
          />
          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
          <TransactionAmountInput transactionType={TransactionTypes[transactionTypeIndex]} amount={amount} onChange={setAmount} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Close" onPress={handleClose} />
          {!!selectedTransaction ? (
            <Button disabled={!validateInputs(amount, description)} title="Update" onPress={handleUpdate} />
          ) : (
            <Button disabled={!validateInputs(amount, description)} title="Save" onPress={handleSave} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'white',
  },
  formContainer: {
    flex: 1,
    gap: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
