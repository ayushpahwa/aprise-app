import type { AxiosResponse } from "axios";
import Api from "./Api";

export interface Currency {
  id: number;
  name: string;
  symbol: string;
}

export interface Account {
  id: number;
  name: string;
  current_balance: number;
  starting_balance: number;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  fullName: string;
  defaultCurrency: Currency;
  accounts: Account[];
  joiningDate: string;
}

class UserAPI extends Api {
  static BASE = "/users";
  static GET_USER = `${this.BASE}/profile`;

  static async getUserProfile(): Promise<AxiosResponse<UserProfileResponse>> {
    return Api.get(UserAPI.GET_USER);
  }
}

export default UserAPI;
