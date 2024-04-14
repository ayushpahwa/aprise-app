import type { AxiosResponse } from "axios";

export interface APIResponseError {
  code: string | number;
  message: string;
}

export interface ResponseMeta {
  status: number;
  success: boolean;
  error?: APIResponseError;
}

export type ApiResponse<T = unknown> = AxiosResponse<T> & {
  responseMeta?: ResponseMeta;
  code?: string;
};
