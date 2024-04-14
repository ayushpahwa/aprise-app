import type { CreateTransactionDTO, Group } from "api/GroupsAPI";
import type { CreateTransactionFormInput } from "components/TransactionModal";
import {
  TRANSACTION_SPLIT_TYPES,
  TRANSACTION_TYPES,
} from "constants/txnConstants";

export const generatePayloadForCreateTransaction = ({
  formInput,
  groups,
}: {
  formInput: CreateTransactionFormInput;
  groups: Group[];
}) => {
  const { amount, description, groupIndex, transactionType } = formInput;
  const { currencies, id: group_id } = groups[groupIndex > 0 ? groupIndex : 0];
  const { id: currency_id } = currencies[0];
  // remove the sign and convert to cents/paise
  const parsedAmount = Number(amount.toString().slice(2)) * 100;
  const payload: CreateTransactionDTO = {
    amount: parsedAmount,
    category_id: 1,
    currency_id,
    description,
    members: generateMemberPayload(transactionType, [1]),
    split_type: TRANSACTION_SPLIT_TYPES.EQUAL,
    type: transactionType,
  };
  return { group_id, payload };
};

export const generateMemberPayload = (
  transactionType: TRANSACTION_TYPES,
  members: number[],
) => {
  const key = transactionType === TRANSACTION_TYPES.INCOME ? "input" : "output";
  return {
    [key]: members.map((memberId) => ({ memberId })),
  };
};
