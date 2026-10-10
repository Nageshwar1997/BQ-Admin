import type { AxiosProgressEvent } from 'axios';
import type { ReactNode } from 'react';

import type { TOAST_TYPE } from '@/constants/common.constants';

import type { IUser } from './api.type';
import type { IButton, IClassName, ITitleDescription } from './component.type';

interface IBaseToast extends IClassName {
  icon?: ReactNode;
  buttonProps?: Partial<IButton>;
}

interface IToastClosable {
  isClosable?: boolean;
  autoClose?: boolean;
  closeTimer?: number;
}

export interface IDefaultToast extends IBaseToast, IToastClosable, ITitleDescription {
  type: 'success' | 'error' | 'warning' | 'default';
}

export interface ICustomToast extends IBaseToast, IToastClosable {
  type: typeof TOAST_TYPE.custom;
  children: ReactNode;
  title?: never;
  description?: never;
}

export interface ILoadingToast extends IBaseToast, ITitleDescription {
  type: typeof TOAST_TYPE.loading;
  isClosable?: never;
  autoClose?: never;
  closeTimer?: never;
}

export interface IProgressToast extends Omit<ILoadingToast, 'type'> {
  type: typeof TOAST_TYPE.progress;
  progress: number;
}

export type TUploadItemStatus = 'pending' | 'uploading' | 'success' | 'error';

/** One upload (a request) of an uploads toast, e.g. "Description" with the images of that field. */
export interface IUploadItem {
  id: string;
  label: string;
  status: TUploadItemStatus;
  /** Bytes the browser has sent so far, and the bytes to send (the sum of the file sizes until known). */
  loaded: number;
  total: number;
  /** The size of every file of this upload, in the order they are sent. */
  fileSizes: number[];
}

/**
 * One toast for one or more uploads running together: the overall progress on the left, how many
 * files are through underneath and, when there is more than one upload, a row for each of them.
 */
export interface IUploadsToast extends IBaseToast {
  type: typeof TOAST_TYPE.uploads;
  title: string;
  description?: string;
  items: IUploadItem[];
  isClosable?: never;
  autoClose?: never;
  closeTimer?: never;
}

export type TToast = IDefaultToast | ICustomToast | ILoadingToast | IProgressToast | IUploadsToast;

export type TToastItem = TToast & { id: string };

export interface IToastStore {
  toasts: TToastItem[];
  add: (toast: TToast) => string;
  update: {
    progress: (id: string, progress: number) => void;
    uploadItem: (id: string, itemId: string, patch: Partial<Omit<IUploadItem, 'id'>>) => void;
  };
  remove: (id: string) => void;
}

export type TProgressToastOptions<T> = ITitleDescription & {
  request: (onProgress: (event: AxiosProgressEvent) => void) => Promise<T>;
};

export type TTheme = 'light' | 'dark';

export interface IThemeStore {
  theme: TTheme;
  toggleTheme: () => void;
}

export interface IUserStore {
  user: IUser | null;
  authenticated: boolean;
  setUser: (user: IUser | null) => void;
}

type TActionFn = () => void | Promise<void>;

export interface IActionItem {
  id: string;
  fn: TActionFn;
  retries: number;
  maxRetries: number;
}

export interface IActionsStore {
  actions: IActionItem[];
  addAction: (fn: TActionFn, options?: { maxRetries?: number }) => string;
  removeAction: (id: string) => void;
  clearActions: () => void;
  runNextAction: () => Promise<void>;
  runAllActions: () => Promise<void>;
}
