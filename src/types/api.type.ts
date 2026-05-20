import type { AUTH_PROVIDERS, ROLES } from '@/constants/api.constants';
import type { TCategory, TEmail, TLogin } from './schema.type';

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

export interface ICategory extends IId, Pick<TCategory, 'level' | 'name'> {
  slug: string;
  parent?: string | null;
  description?: string | null;
}
