import React from "react";
import { useMemo, useState } from "react";
import { TransactionsList } from "components/TransactionList";
import { View } from "react-native";
import type { Transaction } from "constants/types/txnTypes";

const Details = () => {
  const [transactions, setTransactions] = useState([] as Transaction[]);
  useMemo(async () => {
    setTransactions([]);
  }, []);

  return (
    <View>
      <TransactionsList isLoading={false} transactions={transactions} />
    </View>
  );
};

export default Details;
