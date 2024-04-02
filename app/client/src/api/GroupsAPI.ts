import { AxiosResponse } from 'axios';
import Api from './Api';
import { Currency } from './UserAPI';

export enum GroupType {
  PERSONAL = 'Personal',
  HOME = 'Home',
  Travel = 'Travel',
}

export interface Group {
  id: number;
  name: string;
  currencies: Currency[];
  type: GroupType;
  createdAt: string;
}

export class GroupsAPI extends Api {
  static BASE = '/groups';

  static async getGroups(): Promise<AxiosResponse<Group[]>> {
    return Api.get(GroupsAPI.BASE);
  }
}

export default GroupsAPI;
