import { createMessage, ERROR_413, ERROR_500, SERVER_API_TIMEOUT_ERROR } from '../constants/messages';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_STATUS_CODES, ERROR_CODES, SERVER_ERROR_CODES } from '../api/ApiConstants';

const timeoutErrorRegex = /timeout of (\d+)ms exceeded/;
export const axiosConnectionAbortedCode = 'ECONNABORTED';
export const ENV_ENABLED_ROUTES = ['v1/datasources/[a-z0-9]+/structure', '/v1/datasources/[a-z0-9]+/trigger', 'v1/actions/execute', 'v1/saas'];

const is404orAuthPath = () => {
  return false;
};

// Request interceptor will add a timer property to the request.
// this will be used to calculate the time taken for an action
// execution request
export const apiRequestInterceptor = (config: AxiosRequestConfig) => {
  config.headers = config.headers ?? {};

  // Add header for CSRF protection.
  const methodUpper = config.method?.toUpperCase();
  if (methodUpper && methodUpper !== 'GET' && methodUpper !== 'HEAD') {
    config.headers['X-Requested-By'] = 'Aprise';
  }

  return { ...config, timer: performance.now() };
};

export const apiSuccessResponseInterceptor = (response: AxiosResponse): AxiosResponse['data'] => {
  return response.data;
};

// Handle different api failure scenarios
export const apiFailureResponseInterceptor = async (error: any) => {
  // this can be extended to other errors we want to catch.
  // in this case it is 413.
  if (error && error?.response && error?.response.status === 413) {
    return Promise.reject({
      ...error,
      clientDefinedError: true,
      statusCode: 'AE-APP-4013',
      message: createMessage(ERROR_413, 100),
    });
  }

  // Return error if any timeout happened in other api calls
  if (error.code === axiosConnectionAbortedCode && error.message && error.message.match(timeoutErrorRegex)) {
    return Promise.reject({
      ...error,
      message: createMessage(SERVER_API_TIMEOUT_ERROR),
      code: ERROR_CODES.REQUEST_TIMEOUT,
    });
  }

  if (error.response) {
    if (error.response.status === API_STATUS_CODES.SERVER_ERROR) {
      return Promise.reject({
        ...error,
        code: ERROR_CODES.SERVER_ERROR,
        message: createMessage(ERROR_500),
      });
    }

    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (!is404orAuthPath()) {
      if (error.response.status === API_STATUS_CODES.REQUEST_NOT_AUTHORISED) {
        console.log('Unauthorized', error.response.data);
        return Promise.reject({
          ...error,
          code: ERROR_CODES.REQUEST_NOT_AUTHORISED,
          message: 'Unauthorized',
          show: false,
        });
      }
      const errorData = error.response.data.responseMeta ?? {};
      if (errorData.status === API_STATUS_CODES.RESOURCE_NOT_FOUND && SERVER_ERROR_CODES.RESOURCE_NOT_FOUND.includes(errorData.error.code)) {
        return Promise.reject({
          ...error,
          code: ERROR_CODES.PAGE_NOT_FOUND,
          message: 'Resource Not Found',
          show: false,
        });
      }
    }
    if (error.response.data.responseMeta) {
      return Promise.resolve(error.response.data);
    }
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message);
  }
  console.debug(error.config);
  return Promise.resolve(error);
};
