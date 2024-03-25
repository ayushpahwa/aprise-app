import { AxiosPromise } from 'axios';
import Api from './Api';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  defaultCurrencyId: number;
}

export interface AuthResponse {
  token: string;
}

class AuthAPI extends Api {
  static BASE = '/auth';
  static LOGIN = `${this.BASE}/login`;
  static REGISTER = `${this.BASE}/register`;

  static async login(loginData: LoginDTO): Promise<AxiosPromise<AuthResponse>> {
    return Api.post(AuthAPI.LOGIN, loginData);
  }

  static async register(registerData: RegisterDTO): Promise<AxiosPromise<AuthResponse>> {
    return Api.post(AuthAPI.REGISTER, registerData);
  }
}

export default AuthAPI;
