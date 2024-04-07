import Api from './Api';
import { Currency } from './UserAPI';
import { ApiResponse } from 'constants/apiConstants';

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

  static async getGroups(): Promise<ApiResponse<Group[]>> {
    return Api.get(GroupsAPI.BASE);
  }

  static async createGroup(payload: CreateGroupDTO): Promise<ApiResponse<Group>> {
    return Api.post(GroupsAPI.BASE, payload);
  }
}

export default GroupsAPI;
