import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import envs from '@/envs';
import type { IErrorResponse } from '@/types/api.type';

import ApiError from './ApiError';
import type ApiSuccess from './ApiSuccess';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

interface IFailedQueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: IFailedQueueItem[] = [];
let hasRedirected = false;

const processQueue = (error?: unknown) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

const triggerLogout = () => {
  if (hasRedirected) return;

  hasRedirected = true;

  window.dispatchEvent(
    new CustomEvent('auth:logout', {
      detail: { reason: 'login' },
    }),
  );
};

export class ApiRequest {
  protected readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: envs.urls.gateway,
      withCredentials: true,
    });

    this.instance.interceptors.response.use(
      (res) => res,
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        }

        if (!error.config) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as AxiosRequestConfigWithRetry;

        const refreshUrl = API_METHODS_AND_URLS.gateway.refreshAccessToken.url;

        if (originalRequest.url?.includes(refreshUrl)) {
          triggerLogout();
          return Promise.reject(error);
        }

        // 🔁 401 handling
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(() => this.instance.request(originalRequest));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            await this.instance.request(API_METHODS_AND_URLS.gateway.refreshAccessToken);

            processQueue();

            return await this.instance.request(originalRequest);
          } catch (err) {
            processQueue(err);
            triggerLogout();
            return await Promise.reject(err instanceof Error ? err : new Error(String(err)));
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  protected request = async <TData = unknown>(
    config: AxiosRequestConfig,
  ): Promise<ApiSuccess<TData>> => {
    try {
      const { data } = await this.instance.request<ApiSuccess<TData>>(config);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errResp: AxiosResponse<IErrorResponse> | undefined = error.response;

        throw new ApiError({
          message: errResp?.data.message ?? 'API Error occurred',
          globalErrors: errResp?.data.globalErrors,
          fieldErrors: errResp?.data.fieldErrors,
        });
      }

      if (error instanceof Error) {
        throw new ApiError({ message: error.message });
      }

      throw new ApiError({ message: 'Something went wrong!' });
    }
  };
}
