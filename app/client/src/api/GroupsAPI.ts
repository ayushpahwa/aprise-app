import { Transaction } from 'constants/types/txnTypes';
import Api from './Api';
import { Currency } from './UserAPI';
import { ApiResponse } from 'constants/types/apiTypes';

export enum GroupType {
  PERSONAL = 'PERSONAL',
  HOME = 'HOME',
  TRAVEL = 'TRAVEL',
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

export class GroupsAPI extends Api {
  static BASE = '/groups';

  static TXN_BASE = '/transactions';

  static async getGroups(): Promise<ApiResponse<Group[]>> {
    return Api.get(GroupsAPI.BASE);
  }

  static async createGroup(payload: CreateGroupDTO): Promise<ApiResponse<Group>> {
    return Api.post(GroupsAPI.BASE, payload);
  }

  static async getGroupTransactions(groupId: number): Promise<ApiResponse<Transaction[]>> {
    return Api.get(`${GroupsAPI.BASE}/${groupId}${GroupsAPI.TXN_BASE}`);
  }
}

export default GroupsAPI;
