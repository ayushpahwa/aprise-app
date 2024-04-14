import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { TRANSACTION_TYPES } from 'constants/txnConstants';
import { TransactionAmountInput } from './TransactionAmountInput';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonGroup } from '@ui-kitten/components';
import { CardHandle } from './ui/CardHandle';
import { Colors, defaultStyles } from 'constants/styles';
import { Controller, useForm } from 'react-hook-form';
import CustomTextInput from './ui/CustomTextInput';
import { useEffect } from 'react';

export interface CreateTransactionFormInput {
  transactionType: string;
  amount: number;
  description: string;
  groupId: number;
}

export enum TransactionFields {
  transactionType = 'transactionType',
  amount = 'amount',
  description = 'description',
}

const TransactionTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.INCOME];

export const TransactionModal = () => {
  const navigation = useNavigation();
  const handleModalClose = () => {
    navigation.goBack();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<CreateTransactionFormInput>();

  const watchTransactionType = watch(TransactionFields.transactionType);

  // update the sign of the amount based on the transaction type
  useEffect(() => {
    if (!watchTransactionType) return;

    const sign = watchTransactionType === TRANSACTION_TYPES.INCOME ? '+' : '-';
    const amount = getValues(TransactionFields.amount).toString();
    const newAmount = `${sign} ${amount.slice(2)}`;
    setValue(TransactionFields.amount, newAmount as any);
  }, [watchTransactionType]);

  return (
    <View style={styles.container}>
      <CardHandle />
      <View style={styles.header}>
        <Button appearance="ghost" style={styles.cancelButton} onPress={handleModalClose}>
          Cancel
        </Button>
        <Text style={[defaultStyles.titleText, styles.modalTitle]}>Record your transaction</Text>
      </View>
      <KeyboardAvoidingView style={styles.formContainer} behavior="padding">
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <SegmentedControl
              values={TransactionTypes}
              selectedIndex={TransactionTypes.indexOf(value as TRANSACTION_TYPES)}
              onChange={(event) => onChange(TransactionTypes[event.nativeEvent.selectedSegmentIndex])}
            />
          )}
          name={TransactionFields.transactionType}
          defaultValue={TransactionTypes[0]}
        />
        <TransactionAmountInput transactionType={watchTransactionType} control={control} name={TransactionFields.amount} />
        <CustomTextInput control={control} name={TransactionFields.description} label="Description" />
        <Button onPress={handleModalClose}>Save</Button>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    width: 'auto',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 88,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    marginTop: 16,
    fontSize: 24,
  },
  formContainer: {
    padding: 24,
    flex: 1,
    gap: 12,
  },
  input: {
    borderWidth: 0.5,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
