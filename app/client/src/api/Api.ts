import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { REQUEST_TIMEOUT_MS } from './ApiConstants';
import { apiFailureResponseInterceptor, apiRequestInterceptor, apiSuccessResponseInterceptor } from '../utils/ApiUtils';
import { convertObjectToQueryParams } from '../utils/URLUtils';

export const apiRequestConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

console.log('EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL);

const axiosInstance: AxiosInstance = axios.create();

const requestInterceptors = [apiRequestInterceptor];
requestInterceptors.forEach((interceptor) => {
  axiosInstance.interceptors.request.use(interceptor as any);
});

axiosInstance.interceptors.response.use(apiSuccessResponseInterceptor, apiFailureResponseInterceptor);

class Api {
  static async get(url: string, queryParams?: any, config: AxiosRequestConfig = {}) {
    return axiosInstance.get(url + convertObjectToQueryParams(queryParams), {
      ...apiRequestConfig,
      ...config,
    });
  }

  static async post(url: string, body?: any, queryParams?: any, config: AxiosRequestConfig = {}) {
    return axiosInstance.post(url + convertObjectToQueryParams(queryParams), body, {
      ...apiRequestConfig,
      ...config,
    });
  }

  static async put(url: string, body?: any, queryParams?: any, config: AxiosRequestConfig = {}) {
    return axiosInstance.put(url + convertObjectToQueryParams(queryParams), body, {
      ...apiRequestConfig,
      ...config,
    });
  }

  static async patch(url: string, body?: any, queryParams?: any, config: AxiosRequestConfig = {}) {
    return axiosInstance.patch(url + convertObjectToQueryParams(queryParams), body, {
      ...apiRequestConfig,
      ...config,
    });
  }

  static async delete(url: string, queryParams?: any, config: AxiosRequestConfig = {}) {
    return axiosInstance.delete(url + convertObjectToQueryParams(queryParams), {
      ...apiRequestConfig,
      ...config,
    });
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export default Api;
