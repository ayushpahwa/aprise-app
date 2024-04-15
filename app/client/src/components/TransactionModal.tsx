import React from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TRANSACTION_TYPES } from "constants/txnConstants";
import { TransactionAmountInput } from "./TransactionAmountInput";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@ui-kitten/components";
import { CardHandle } from "./ui/CardHandle";
import { Colors, defaultStyles } from "constants/styles";
import { Controller, useForm } from "react-hook-form";
import CustomTextInput from "./ui/CustomTextInput";
import { useEffect, useMemo } from "react";
import GroupSelector from "./groups/GroupSelector";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "api/ApiConstants";
import type { CreateTransactionDTO } from "api/GroupsAPI";
import GroupsAPI from "api/GroupsAPI";
import { validateResponse } from "utils/ApiUtils";
import { LoadingIndicator } from "./ui/LoadingIndicator";
import { generatePayloadForCreateTransaction } from "utils/TxnUtils";
import Toast from "react-native-toast-message";
import { debug } from "loglevel";
import {
  CREATE_TXN_MODAL_TITLE,
  CTA_CANCEL,
  createMessage,
} from "constants/messages";
import { descValidationConfig } from "constants/formValidationConfigs";

export interface CreateTransactionFormInput {
  transactionType: TRANSACTION_TYPES;
  amount: string;
  description: string;
  groupIndex: number;
}

export enum TransactionFields {
  transactionType = "transactionType",
  amount = "amount",
  description = "description",
  groupIndex = "groupIndex",
}

const TransactionTypes = [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.INCOME];

export const TransactionModal = () => {
  const navigation = useNavigation();
  const {
    data: groupsResponse,
    isError: fetchGroupsError,
    isLoading: fetchingGroups,
  } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_GROUPS],
    queryFn: GroupsAPI.getGroups,
  });

  debug(groupsResponse, fetchingGroups, fetchGroupsError);

  const groups = useMemo(
    () =>
      !fetchingGroups && validateResponse(groupsResponse)
        ? groupsResponse?.data || []
        : [],
    [groupsResponse, fetchingGroups, fetchGroupsError],
  );

  const handleModalClose = () => {
    navigation.goBack();
  };

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm<CreateTransactionFormInput>();

  const watchTransactionType = watch(TransactionFields.transactionType);

  // update the sign of the amount based on the transaction type
  useEffect(() => {
    if (!watchTransactionType) return;

    const sign = watchTransactionType === TRANSACTION_TYPES.INCOME ? "+" : "-";
    const amount = getValues(TransactionFields.amount).toString();
    const newAmount = `${sign} ${amount.slice(2)}`;
    setValue(TransactionFields.amount, newAmount as any);
  }, [watchTransactionType]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({
      group_id,
      payload,
    }: {
      group_id: number;
      payload: CreateTransactionDTO;
    }) => {
      return await GroupsAPI.createTransaction(group_id, payload);
    },
    onSuccess: (data) => {
      try {
        if (validateResponse(data)) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Transaction created successfully",
          });
          handleModalClose();
        } else {
          const message =
            data?.responseMeta?.error?.message ||
            "Failed to create transaction";
          Toast.show({ type: "error", text1: "Error", text2: message });
        }
      } catch (error: any) {
        const message =
          data?.responseMeta?.error?.message || "Failed to create transaction";
        Toast.show({ type: "error", text1: "Error", text2: message });
      }
    },
  });

  const submitHandler = async (formInput: CreateTransactionFormInput) => {
    if (errors && Object.keys(errors).length > 0) return;
    const data: { group_id: number; payload: CreateTransactionDTO } =
      generatePayloadForCreateTransaction({ formInput, groups });
    await mutateAsync(data);
  };

  return (
    <View style={styles.container}>
      <CardHandle />
      <View style={styles.header}>
        <Button
          appearance="ghost"
          onPress={handleModalClose}
          style={styles.cancelButton}
        >
          {createMessage(CTA_CANCEL)}
        </Button>
        <Text style={[defaultStyles.titleText, styles.modalTitle]}>
          {createMessage(CREATE_TXN_MODAL_TITLE)}
        </Text>
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <Controller
          control={control}
          defaultValue={TransactionTypes[0]}
          name={TransactionFields.transactionType}
          render={({ field: { onChange, value } }) => (
            <SegmentedControl
              onChange={(event) =>
                onChange(
                  TransactionTypes[event.nativeEvent.selectedSegmentIndex],
                )
              }
              selectedIndex={TransactionTypes.indexOf(
                value as TRANSACTION_TYPES,
              )}
              values={TransactionTypes}
            />
          )}
        />
        <TransactionAmountInput
          control={control}
          name={TransactionFields.amount}
          transactionType={watchTransactionType}
        />
        <GroupSelector
          control={control}
          disabled={fetchingGroups || fetchGroupsError}
          groups={groups}
          name={TransactionFields.groupIndex}
        />
        <CustomTextInput
          control={control}
          label="Description"
          name={TransactionFields.description}
          validationRules={descValidationConfig}
        />
        {isPending && <LoadingIndicator style={styles.loadingIndicator} />}
        {!isPending && (
          <Button onPress={handleSubmit(submitHandler)}>Save</Button>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    width: "auto",
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
  loadingIndicator: {
    marginTop: 12,
  },
});
