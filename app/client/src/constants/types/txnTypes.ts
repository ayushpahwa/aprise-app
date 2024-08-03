import type { Currency } from "api/UserAPI";
import type {
  TRANSACTION_SPLIT_TYPES,
  TRANSACTION_TYPES,
} from "constants/txnConstants";

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  currency: Currency;
  type: TRANSACTION_TYPES;
  splitType: TRANSACTION_SPLIT_TYPES;
  createdAt: string;
}
