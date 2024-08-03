import React from "react";
import type { IndexPath } from "@ui-kitten/components";
import { Select, SelectItem } from "@ui-kitten/components";
import { CURRENCIES } from "constants/txnConstants";
import type { Control, FieldPath, RegisterOptions } from "react-hook-form";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

type FieldName = FieldPath<any>;

interface Props {
  label: string;
  control: Control<any>;
  name: FieldName; // Prop used by react-hook-form to identify the input
  validationRules?: Omit<
    RegisterOptions<any, FieldName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >; // Prop used by react-hook-form to define validation rules
}

const DEFAULT_CURRENCY_INDEX =
  process.env.EXPO_PUBLIC_DEFAULT_CURRENCY_INDEX || 38; // INR

const getRowDescriptor = (currency: any): string =>
  `${currency.symbol} - ${currency.name}`;

export const CurrencyPicker = ({
  control,
  label,
  name,
  validationRules,
}: Props) => {
  return (
    <Controller
      control={control}
      defaultValue={DEFAULT_CURRENCY_INDEX}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <Select
            onSelect={(index) => onChange((index as IndexPath).row)}
            size="large"
            value={`${getRowDescriptor(CURRENCIES[value])}`}
          >
            {CURRENCIES.map((currency) => (
              <SelectItem
                key={currency.id}
                title={`${getRowDescriptor(currency)}`}
              />
            ))}
          </Select>
        </View>
      )}
      rules={validationRules}
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
