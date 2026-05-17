import type { AUTH_PROVIDERS, ROLES } from '@/constants/api.constants';
import type { TEmail, TLogin } from './schema.type';

export type TFieldErrors = Record<string, string[]>;

export interface IId {
  _id: string;
}

export interface ITimeStamp {
  createdAt: string;
  updatedAt: string;
}

export type TAuthProvider = (typeof AUTH_PROVIDERS)[number];

export type TRole = (typeof ROLES)[number];

export interface IUser extends Pick<TLogin, 'password'>, TEmail, IId, ITimeStamp {
  providers: TAuthProvider[];
  role: TRole;
  avatar?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ICategory extends IId {
  name: string;
  slug: string;
  level: 2 | 1 | 3;
  parent?: string | null;
}
