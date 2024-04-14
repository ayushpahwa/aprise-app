import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TRANSACTION_TYPES } from "constants/txnConstants";
import { Colors } from "constants/styles";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

interface Props {
  name: string;
  control: Control<any>;
  // Add the transactionType prop which is can be either TRANSACTION_TYPES.EXPENSE or TRANSACTION_TYPES.INCOME
  transactionType: string;
}

const amountRegex = /^(\+|-)\s(\d+(\.\d{0,2})?)?$/;

export const TransactionAmountInput = ({
  control,
  name,
  transactionType,
}: Props) => {
  const sign =
    !!transactionType && transactionType === TRANSACTION_TYPES.INCOME
      ? "+"
      : "-";
  return (
    <Controller
      control={control}
      defaultValue={`${sign} 0`}
      name={name}
      render={({ field: { onChange, value } }) => {
        const handleTextChange = (rawText: string) => {
          if (value === rawText) return;

          // do not allow multiple decimal points or any other special characters
          if (!amountRegex.test(rawText)) {
            return;
          }

          if (rawText === "" || rawText === `${sign} `) {
            onChange(`${sign} 0`);
            return;
          }

          // by default the value look like `-0` or `+0` when the input is empty
          // when the user inputs a number, we need to remove the 0 and keep the sign with the number
          if (value === `${sign} 0`) {
            // remove the 0 from the value
            let output = rawText.slice(3);

            if (output === ".") {
              output = "0.";
            }

            onChange(`${sign} ${output}`);
            return;
          }

          const text = rawText.split(" ")[1];
          onChange(`${sign} ${text}`);
        };
        return (
          <View style={styles.container}>
            <View style={styles.symbolCard}>
              <Text style={{ fontWeight: "600" }}>INR</Text>
            </View>
            <TextInput
              caretHidden
              keyboardType="decimal-pad"
              onChangeText={handleTextChange}
              style={styles.input}
              value={value}
            />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  symbolCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent_gray,
    borderRadius: 24,
    width: 72,
    padding: 12,
    opacity: 0.5,
  },
  container: {
    flexDirection: "row",
    borderWidth: 0.5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    height: 96,
    justifyContent: "space-between",
  },
  input: {
    fontSize: 48,
    width: "70%",
    textAlign: "right",
  },
});
