import React from "react";
import { View, StyleSheet } from "react-native";
import { NoTransactionUI } from "./NoTransactionUI";
import { TransactionListItem } from "./TransactionListItem";
import type { Transaction } from "constants/types/txnTypes";
import { ProgressBar } from "@ui-kitten/components";
import { FlashList } from "@shopify/flash-list";

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionsList = ({ isLoading, transactions }: Props) => {
  if (isLoading) {
    return <ProgressBar />;
  }
  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <NoTransactionUI />
      ) : (
        <FlashList
          data={transactions}
          estimatedItemSize={100}
          renderItem={({ item }) => <TransactionListItem transaction={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#ccc",
    padding: 24,
  },
});
