import { AxiosPromise } from 'axios';
import Api from './Api';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

class AuthAPI extends Api {
  static BASE = '/auth';
  static LOGIN = `${this.BASE}/login`;
  static SIGNUP = `${this.BASE}/signup`;

  static async login(loginData: LoginDTO): Promise<AxiosPromise<LoginResponse>> {
    return Api.post(AuthAPI.LOGIN, loginData);
  }
}

export default AuthAPI;
