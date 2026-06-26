import type { TProductSortBy } from '@/types/api.type';
import { createQueryKeys, createRouteHelper } from '@/utils/api.util';
import { API_METHODS_MAP, PRODUCT_STATUSES_MAP } from '@beautinique/shared-constants';

export const METHODS_AND_PATHS = {
  base: '/api/v1',
  gateway: {
    refreshAccessToken: { method: API_METHODS_MAP.POST, path: '/refresh-access-token' },
  },
  user_service: {
    base: '/user-service',
    auth: {
      base: '/auth',
      login: {
        base: '/login',
        manual: { method: API_METHODS_MAP.POST, path: '/manual' },
        oauth: {
          google: {
            redirect: { method: API_METHODS_MAP.GET, path: '/oauth/google/redirect' },
            callback: { method: API_METHODS_MAP.GET, path: '/oauth/google/callback' },
          },

          linkedin: {
            redirect: { method: API_METHODS_MAP.GET, path: '/oauth/linkedin/redirect' },
            callback: { method: API_METHODS_MAP.GET, path: '/oauth/linkedin/callback' },
          },

          github: {
            redirect: { method: API_METHODS_MAP.GET, path: '/oauth/github/redirect' },
            callback: { method: API_METHODS_MAP.GET, path: '/oauth/github/callback' },
          },
        },
      },
      logout: { method: API_METHODS_MAP.DELETE, path: '/logout' },
      register: {
        base: '/register',
        sendOtp: { method: API_METHODS_MAP.POST, path: '/send-otp' },
        resendOtp: { method: API_METHODS_MAP.PATCH, path: '/resend-otp' },
        verifyOtp: { method: API_METHODS_MAP.POST, path: '/verify-otp' },
        saveUser: { method: API_METHODS_MAP.POST, path: '/save-user' },
      },
      password: {
        base: '/password',
        forgot: {
          sendOtp: { method: API_METHODS_MAP.POST, path: '/forgot-send-otp' },
          resendOtp: { method: API_METHODS_MAP.PATCH, path: '/forgot-resend-otp' },
          verifyOtp: { method: API_METHODS_MAP.POST, path: '/forgot-verify-otp' },
          save: { method: API_METHODS_MAP.POST, path: '/forgot-save' },
        },
        change: { method: API_METHODS_MAP.PATCH, path: '/change' },
        set: { method: API_METHODS_MAP.PATCH, path: '/set' },
      },
    },
    user: {
      base: '/user',
      session: { method: API_METHODS_MAP.GET, path: '/session' },
    },
  },
  media_service: {
    base: '/media-service',
    upload: {
      base: '/upload',
      single: { method: API_METHODS_MAP.POST, path: '/single' },
      multiple: { method: API_METHODS_MAP.POST, path: '/multiple' },
    },
  },
  product_service: {
    base: '/product-service',
    category: {
      base: '/category',
      add: { method: API_METHODS_MAP.POST, path: '/' },
      update: { method: API_METHODS_MAP.PATCH, path: '/:categoryId' },
      delete: { method: API_METHODS_MAP.DELETE, path: '/:categoryId' },
      get: {
        byParentLevel: { method: API_METHODS_MAP.GET, path: '/by-parent-level' },
        byHierarchy: { method: API_METHODS_MAP.GET, path: '/by-hierarchy' },
      },
    },
    product: {
      base: '/product',
      draft: {
        base: '/draft',
        publish: { method: API_METHODS_MAP.PATCH, path: '/publish' }, // For publish existing draft
        save: { method: API_METHODS_MAP.POST, path: '/' }, // For upload new Product as draft
        get: { method: API_METHODS_MAP.GET, path: '/' }, // For get existing draft Product
        remove: { method: API_METHODS_MAP.DELETE, path: '/' }, // For remove existing draft
        update: { method: API_METHODS_MAP.PATCH, path: '/' }, // For already published product and seller again made some changes
      },
      publish: { method: API_METHODS_MAP.PATCH, path: '/publish' }, // For publish existing Product
      get: {
        dashboard: {
          base: '/dashboard',
          products: { method: API_METHODS_MAP.GET, path: '/products' },
          bySlug: { method: API_METHODS_MAP.GET, path: '/:slug' },
        },
        suggestions: { method: API_METHODS_MAP.GET, path: '/suggestions' },
        products: { method: API_METHODS_MAP.GET, path: '/products' },
        bySlug: { method: API_METHODS_MAP.GET, path: '/:slug' },
      },
    },
  },
} as const;

export const API_METHODS_AND_URLS = createRouteHelper(METHODS_AND_PATHS);

export const API_QUERY_KEYS = createQueryKeys(METHODS_AND_PATHS);

export const HEADERS_KEYS = { loginRole: 'X-Login-Role' } as const;

export const PRODUCTS_TABLE_TITLES: { label: string; sortKey?: TProductSortBy | never }[] = [
  { label: 'S. No' },
  { label: 'View' },
  { label: 'Thumbnail' },
  { label: 'Title', sortKey: 'title' },
  { label: 'Brand' },
  { label: 'SP', sortKey: 'sellingPrice' },
  { label: 'MRP', sortKey: 'originalPrice' },
  { label: 'Status' },
  { label: 'Stock' },
  { label: 'Created At', sortKey: 'createdAt' },
  { label: 'Updated At', sortKey: 'updatedAt' },
  { label: 'Try-On' },
  { label: 'Variants' },
  { label: 'Sku' },
  { label: 'Slug' },
  { label: 'Sold', sortKey: 'soldCount' },
  { label: 'Returned' },
  { label: 'Avg. Rating' },
] as const;

export const PRODUCT_STATUS_TRANSITIONS = {
  [PRODUCT_STATUSES_MAP.PENDING]: [
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.REJECTED,
    PRODUCT_STATUSES_MAP.BLOCKED,
  ],

  [PRODUCT_STATUSES_MAP.PUBLISHED]: [PRODUCT_STATUSES_MAP.BLOCKED, PRODUCT_STATUSES_MAP.DELETED],

  [PRODUCT_STATUSES_MAP.REJECTED]: [PRODUCT_STATUSES_MAP.PENDING, PRODUCT_STATUSES_MAP.BLOCKED],

  [PRODUCT_STATUSES_MAP.BLOCKED]: [
    PRODUCT_STATUSES_MAP.PENDING,
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.DELETED,
  ],

  [PRODUCT_STATUSES_MAP.DELETED]: [
    PRODUCT_STATUSES_MAP.PENDING,
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.BLOCKED,
  ],
} as const;
