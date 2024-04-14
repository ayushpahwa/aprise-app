import type { Transaction } from "constants/types/txnTypes";
import Api from "./Api";
import type { Currency } from "./UserAPI";
import type { ApiResponse } from "constants/types/apiTypes";
import type {
  TRANSACTION_SPLIT_TYPES,
  TRANSACTION_TYPES,
} from "constants/txnConstants";

export enum GroupType {
  PERSONAL = "PERSONAL",
  HOME = "HOME",
  TRAVEL = "TRAVEL",
}

export interface Group {
  id: number;
  name: string;
  description: string;
  currencies: Currency[];
  type: GroupType;
  createdAt: string;
}

export interface CreateGroupDTO {
  name: string;
  description: string;
  type: GroupType;
  currencyId: number;
  members: number[];
}

export interface GroupTransactionMember {
  input?: Array<{ memberId: number }>;
  output?: Array<{ memberId: number }>;
}

export interface CreateTransactionDTO {
  currency_id: number;
  category_id: number;
  description: string;
  amount: number;
  type: TRANSACTION_TYPES;
  split_type: TRANSACTION_SPLIT_TYPES;
  members: GroupTransactionMember;
}

export class GroupsAPI extends Api {
  static BASE = "/groups";

  static TXN_BASE = "/transactions";

  static async getGroups(): Promise<ApiResponse<Group[]>> {
    return Api.get(GroupsAPI.BASE);
  }

  static async createGroup(
    payload: CreateGroupDTO,
  ): Promise<ApiResponse<Group>> {
    return Api.post(GroupsAPI.BASE, payload);
  }

  static async getGroupTransactions(
    groupId: number,
  ): Promise<ApiResponse<Transaction[]>> {
    return Api.get(`${GroupsAPI.BASE}/${groupId}${GroupsAPI.TXN_BASE}`);
  }

  static async createTransaction(
    groupId: number,
    payload: CreateTransactionDTO,
  ): Promise<ApiResponse<Transaction>> {
    return Api.post(
      `${GroupsAPI.BASE}/${groupId}${GroupsAPI.TXN_BASE}`,
      payload,
    );
  }
}

export default GroupsAPI;
