import type {
  AUTH_PROVIDERS,
  METHOD_MAP,
  PRODUCT_STATUSES,
  ROLES,
} from '@/constants/api.constants';
import type { CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import type { TSort } from './component.type';
import type {
  TCategoryForm,
  TEmail,
  TLogin,
  TProductBasicInfo,
  TProductDescriptionAndContent,
  TProductMediaAndGallery,
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

/* -------------------------------------------------------------------------- */
/*                                  CATEGORY                                  */
/* -------------------------------------------------------------------------- */

export type TCategoryLevelMap = typeof CATEGORY_LEVELS_MAP;

export type TCategoryLevel = TCategoryLevelMap[keyof TCategoryLevelMap];

export type TLevel1 = TCategoryLevelMap['L1'];
export type TLevel2 = TCategoryLevelMap['L2'];
export type TLevel3 = TCategoryLevelMap['L3'];

type CategoryBase<TLevel extends TCategoryLevel> = IId &
  Pick<TCategoryForm, 'name'> & { slug: string; level: TLevel };

export type TL1Category = CategoryBase<TLevel1>;
export type TL2Category = CategoryBase<TLevel2> & { parent: string };
export type TL3Category = CategoryBase<TLevel3> & { parent: string; description: string };

export type TCategory = TL1Category | TL2Category | TL3Category;

export type TCategoryHierarchyNode<TLevel extends TCategoryLevel> = TLevel extends TLevel1
  ? CategoryBase<TLevel1> & { subcategories: TCategoryHierarchyNode<TLevel2>[] }
  : TLevel extends TLevel2
    ? CategoryBase<TLevel2> & {
        parent: string;
        subcategories: TCategoryHierarchyNode<TLevel3>[];
      }
    : CategoryBase<TLevel3> & { parent: string; description: string; subcategories: never };

export type TCategoryHierarchy = TCategoryHierarchyNode<TCategoryLevel>;

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

type TEnabledTryOn = Extract<TProductTryOnConfiguration, { enabled: true }>['tryOn'];

type TApiTryOn =
  | { enabled: boolean; configured: false }
  | ({ enabled: false; configured: true } & Partial<TEnabledTryOn>)
  | ({ enabled: true; configured: true } & TEnabledTryOn);

type TRemoveFileType<T> = {
  [K in keyof T]: T[K] extends (infer U)[] ? Exclude<U, File>[] : Exclude<T[K], File>;
};

export type TApiProductBase = IId &
  ITimeStamp &
  Pick<TProductBasicInfo, 'title' | 'brand' | 'sellingPrice' | 'originalPrice'> &
  TProductDescriptionAndContent &
  TRemoveFileType<TProductMediaAndGallery> & {
    tryOn: TApiTryOn;
    seller: string;
    sku: string;
    slug: string;
    discount: number;
    soldCount: number;
    returnCount: number;
    reviews: string[];
    totalReviews: number;
    averageRating: number;
    totalRating: number;
    status: TProductStatus;
    history?: {
      approvedBy?: string | null;
      approvedAt?: string | null;
      blockedBy?: string | null;
      blockedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectReason?: string | null;
    };
  };

type TApiStockAndVariants =
  | TProductWithoutVariant
  | (Pick<TProductWithVariant, 'hasVariants'> & {
      variants: (TRemoveFileType<TProductWithVariant['variants'][number]> & {
        sku: string;
        discount: number;
        images: string[];
        thumbnail?: string;
      } & IId)[];
    });

export type TApiProduct = TApiProductBase & TApiStockAndVariants & { category: string };

export type TApiProductPopulated = TApiProductBase &
  TApiStockAndVariants & { category: TCategory; seller: unknown };

export type TProductSortBy = keyof Pick<
  TApiProduct,
  'createdAt' | 'updatedAt' | 'title' | 'sellingPrice' | 'originalPrice' | 'soldCount'
>;

export interface IGetDashboardProductsQuery {
  page: string;
  limit: string;
  search?: string;
  status?: TProductStatus;
  category?: string;
  sortBy?: TProductSortBy;
  sortOrder?: TSort;
}
