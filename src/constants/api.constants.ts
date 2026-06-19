import { createQueryKeys, createRouteHelper } from '@/utils/api.util';

export const METHOD_MAP = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const;

export const METHODS_AND_PATHS = {
  base: '/api/v1',
  gateway: {
    refreshAccessToken: { method: METHOD_MAP.POST, path: '/refresh-access-token' },
  },
  user_service: {
    base: '/user-service',
    auth: {
      base: '/auth',
      login: {
        base: '/login',
        manual: { method: METHOD_MAP.POST, path: '/manual' },
        oauth: {
          google: {
            redirect: { method: METHOD_MAP.GET, path: '/oauth/google/redirect' },
            callback: { method: METHOD_MAP.GET, path: '/oauth/google/callback' },
          },

          linkedin: {
            redirect: { method: METHOD_MAP.GET, path: '/oauth/linkedin/redirect' },
            callback: { method: METHOD_MAP.GET, path: '/oauth/linkedin/callback' },
          },

          github: {
            redirect: { method: METHOD_MAP.GET, path: '/oauth/github/redirect' },
            callback: { method: METHOD_MAP.GET, path: '/oauth/github/callback' },
          },
        },
      },
      logout: { method: METHOD_MAP.DELETE, path: '/logout' },
      register: {
        base: '/register',
        sendOtp: { method: METHOD_MAP.POST, path: '/send-otp' },
        resendOtp: { method: METHOD_MAP.PATCH, path: '/resend-otp' },
        verifyOtp: { method: METHOD_MAP.POST, path: '/verify-otp' },
        saveUser: { method: METHOD_MAP.POST, path: '/save-user' },
      },
      password: {
        base: '/password',
        forgot: {
          sendOtp: { method: METHOD_MAP.POST, path: '/forgot-send-otp' },
          resendOtp: { method: METHOD_MAP.PATCH, path: '/forgot-resend-otp' },
          verifyOtp: { method: METHOD_MAP.POST, path: '/forgot-verify-otp' },
          save: { method: METHOD_MAP.POST, path: '/forgot-save' },
        },
        change: { method: METHOD_MAP.PATCH, path: '/change' },
        set: { method: METHOD_MAP.PATCH, path: '/set' },
      },
    },
    user: {
      base: '/user',
      session: { method: METHOD_MAP.GET, path: '/session' },
    },
  },
  media_service: {
    base: '/media-service',
    upload: {
      base: '/upload',
      single: { method: METHOD_MAP.POST, path: '/single' },
      multiple: { method: METHOD_MAP.POST, path: '/multiple' },
    },
  },
  product_service: {
    base: '/product-service',
    category: {
      base: '/category',
      add: { method: METHOD_MAP.POST, path: '/' },
      update: { method: METHOD_MAP.PATCH, path: '/:categoryId' },
      delete: { method: METHOD_MAP.DELETE, path: '/:categoryId' },
      get: {
        byParentLevel: { method: METHOD_MAP.GET, path: '/by-parent-level' },
        byHierarchy: { method: METHOD_MAP.GET, path: '/by-hierarchy' },
      },
    },
    product: {
      base: '/product',
      draft: {
        base: '/draft',
        publish: { method: METHOD_MAP.PATCH, path: '/publish' }, // For publish existing draft
        save: { method: METHOD_MAP.POST, path: '/' }, // For upload new Product as draft
        get: { method: METHOD_MAP.GET, path: '/' }, // For get existing draft Product
        remove: { method: METHOD_MAP.DELETE, path: '/' }, // For remove existing draft
        update: { method: METHOD_MAP.PATCH, path: '/' }, // For already published product and seller again made some changes
      },
      publish: { method: METHOD_MAP.PATCH, path: '/publish' }, // For publish existing Product
      get: {
        dashboard: { method: METHOD_MAP.GET, path: '/dashboard' },
        bySlug: { method: METHOD_MAP.GET, path: '/:slug' },
      },
    },
  },
} as const;

export const API_METHODS_AND_URLS = createRouteHelper(METHODS_AND_PATHS);

export const API_QUERY_KEYS = createQueryKeys(METHODS_AND_PATHS);

export const AUTH_PROVIDERS = ['MANUAL', 'GOOGLE', 'LINKEDIN', 'GITHUB'] as const;

export const ROLES = ['USER', 'SELLER', 'ADMIN', 'MASTER'] as const;

export const HEADERS_KEYS = { loginRole: 'X-Login-Role' } as const;
