import axios from 'axios';

const BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const SIGN_UP_URL = `${BASE_URL}signUp?key=`;
const SIGN_IN_URL = `${BASE_URL}signInWithPassword?key=`;
const API_KEY = '';

export const authenticate = async (email: string, password: string, isLogin: boolean) => {
  try {
    const url = isLogin ? SIGN_IN_URL : SIGN_UP_URL;
    const response = await axios.post(url + API_KEY, { email, password, returnSecureToken: true });
    return response.data;
  } catch (error: any) {
    console.error(error);
    console.log(error.response.data.error.message);
    throw error;
  }
};
