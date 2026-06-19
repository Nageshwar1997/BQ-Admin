import type {
  AUTH_PROVIDERS,
  METHOD_MAP,
  PRODUCT_STATUSES,
  ROLES,
} from '@/constants/api.constants';
import type {
  TEmail,
  TL1Category,
  TL2Category,
  TL3Category,
  TLogin,
  TProductBasicInfo,
  TProductDescriptionAndContent,
  TProductMediaAndGallery,
  TProductStockAndVariants,
  TProductTryOnConfiguration,
  TProductWithoutVariant,
  TProductWithVariant,
} from './schema.type';

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

export type TApiL1Category = Pick<TL1Category, 'name' | 'level'>;
export type TApiL2Category = Pick<TL2Category, 'name' | 'level'> & { parent: string };
export type TApiL3Category = Pick<TL3Category, 'name' | 'level' | 'description'> & {
  parent: string;
};
export type TApiCategory = (TApiL1Category | TApiL2Category | TApiL3Category) &
  IId & { slug: string };

export interface ICreateHeaders {
  user?: Partial<Pick<IUser, '_id' | 'role'>>;
  token?: string;
  loginRole?: TRole;
  contentType?: string;
}

export type TApiMethod = (typeof METHOD_MAP)[keyof typeof METHOD_MAP];

export type TRouteNode = Record<string, unknown> & { base?: string };

export interface IEndpoint {
  path: string;
  method: TApiMethod;
}

export type TParams = Record<string, string | number>;

type TExtractRouteParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Record<Param | keyof TExtractRouteParams<`/${Rest}`>, string | number>
  : T extends `${string}:${infer Param}`
    ? Record<Param, string | number>
    : never;

type TUrl<FullPath extends string> =
  TExtractRouteParams<FullPath> extends never
    ? FullPath
    : (params: TExtractRouteParams<FullPath>) => FullPath;

interface IGeneratedEndpoint<T extends IEndpoint, FullPath extends string> {
  method: Uppercase<T['method']>;

  url: TUrl<FullPath>;
}

export type TGenerateRoutes<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? IGeneratedEndpoint<T[K], `${ParentPath}${T[K]['path']}`>
    : T[K] extends Record<string, unknown>
      ? TGenerateRoutes<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

type TQueryKey<FullPath extends string, Method extends string> =
  TExtractRouteParams<FullPath> extends never
    ? readonly [Uppercase<Method>, FullPath]
    : (params: TExtractRouteParams<FullPath>) => readonly [Uppercase<Method>, FullPath];

export type TGenerateQueryKeys<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? TQueryKey<`${ParentPath}${T[K]['path']}`, T[K]['method']>
    : T[K] extends Record<string, unknown>
      ? TGenerateQueryKeys<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

export type TProductStatus = (typeof PRODUCT_STATUSES)[number];

export type TApiProduct = IId &
  ITimeStamp &
  Omit<TProductBasicInfo, 'l1Category' | 'l2Category' | 'l3Category'> &
  TProductDescriptionAndContent &
  Record<keyof TProductMediaAndGallery, string> &
  Pick<TProductStockAndVariants, 'hasVariants'> &
  (
    | TProductWithoutVariant
    | (Pick<TProductWithVariant, 'hasVariants'> & {
        variants: (Omit<TProductWithVariant['variants'][number], 'images' | 'thumbnail'> & {
          sku: string;
          discount: number;
          images: string[];
          thumbnail?: string;
        } & IId)[];
      })
  ) & {
    category: string;
    tryon: TProductTryOnConfiguration & { configured: boolean };
    seller: string;
    sku: string;
    slug: string;
    discount: number;
    saleCount: number;
    returnCount: number;
    reviews: string[];
    totalReviews: number;
    averageRating: number;
    totalRating: number;
    status: TProductStatus;
    history?: {
      approvedBy?: string | null | undefined;
      approvedAt?: string | null | undefined;
      blockedBy?: string | null | undefined;
      blockedAt?: string | null | undefined;
      rejectedBy?: string | null | undefined;
      rejectedAt?: string | null | undefined;
      rejectReason?: string | null | undefined;
    };
  };

export type TApiProductPopulated = Omit<TApiProduct, 'category'> & {
  category: TApiCategory;
  seller: unknown;
};

/*
type TProductWithVariant = {
    hasVariants: true;
    variants: {

        images: (string | File)[];
        thumbnail?: string | File | undefined;
    }[];

    ye mera variant he mujhe isme file type hatake string dena he aur baki saari fields rakhni he aur ek chij
*/
/*
    sku: { type: String, required: true, trim: true, uppercase: true },
    discount: { type: Number, min: 0, max: 100, default: 0 },
*/
