import type { TOAST_TYPE } from '@/constants/common.constants';
import type { AxiosProgressEvent } from 'axios';
import type { ReactNode } from 'react';
import type { IUser } from './api.type';
import type { IButton, TClassName, TTitleDescription } from './component.type';

interface IBaseToast extends TClassName {
  icon?: ReactNode;
  buttonProps?: Partial<IButton>;
}

type TToastClosable = {
  isClosable?: boolean;
  autoClose?: boolean;
  closeTimer?: number;
};

export interface IDefaultToast extends IBaseToast, TToastClosable, TTitleDescription {
  type:
    | typeof TOAST_TYPE.success
    | typeof TOAST_TYPE.error
    | typeof TOAST_TYPE.warning
    | typeof TOAST_TYPE.default;
}

export interface ICustomToast extends IBaseToast, TToastClosable {
  type: typeof TOAST_TYPE.custom;
  children: ReactNode;
  title?: never;
  description?: never;
}

export interface ILoadingToast extends IBaseToast, TTitleDescription {
  type: typeof TOAST_TYPE.loading;
  isClosable?: never;
  autoClose?: never;
  closeTimer?: never;
}

export interface IProgressToast extends Omit<ILoadingToast, 'type'> {
  type: typeof TOAST_TYPE.progress;
  progress: number;
}

export type TToast = IDefaultToast | ICustomToast | ILoadingToast | IProgressToast;

export type TToastItem = TToast & { id: string };

export interface IToastStore {
  toasts: TToastItem[];
  add: (toast: TToast) => string;
  update: { progress: (id: string, progress: number) => void };
  remove: (id: string) => void;
}

export type TProgressToastOptions<T> = TTitleDescription & {
  request: (onProgress: (event: AxiosProgressEvent) => void) => Promise<T>;
};

export type TTheme = 'light' | 'dark';

export type TThemeStore = { theme: TTheme; toggleTheme: () => void };

export type TUserStore = {
  user: IUser | null;
  authenticated: boolean;
  setUser: (user: IUser | null) => void;
};

export type ActionFn = () => void | Promise<void>;

export type ActionItem = {
  id: string;
  fn: ActionFn;
  retries: number;
  maxRetries: number;
};

export type TActionsStore = {
  actions: ActionItem[];

  addAction: (fn: ActionFn, options?: { maxRetries?: number }) => string;

  removeAction: (id: string) => void;
  clearActions: () => void;

  runNextAction: () => Promise<void>;
  runAllActions: () => Promise<void>;
};
