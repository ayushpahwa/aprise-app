import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { CURRENCIES } from 'constants/txnConstants';
import { Control, Controller, FieldPath, RegisterOptions } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type FieldName = FieldPath<any>;

interface Props {
  label: string;
  control: Control<any>;
  name: FieldName; // Prop used by react-hook-form to identify the input
  validationRules?: Omit<RegisterOptions<any, FieldName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>; // Prop used by react-hook-form to define validation rules
}

const DEFAULT_CURRENCY_INDEX = 38; // INR

const getRowDescriptor = (currency: any): string => `${currency.symbol} - ${currency.name}`;

export const CurrencyPicker = ({ control, name, validationRules, label }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={validationRules}
      defaultValue={DEFAULT_CURRENCY_INDEX}
      render={({ field: { value, onChange } }) => {
        console.log(value);
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <Select size="large" onSelect={(index) => onChange((index as IndexPath).row)} value={`${getRowDescriptor(CURRENCIES[value])}`}>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.id} title={`${getRowDescriptor(currency)}`} />
              ))}
            </Select>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: Colors.text,
    marginBottom: 4,
  },
});
