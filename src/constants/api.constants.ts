import envs from '@/envs';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const API_BASE_URLS = {
  'gateway-user-service': `${envs.urls.gateway}/api/v1/user-service`,
  'gateway-product-service': `${envs.urls.gateway}/api/v1/product-service`,
};

export const API_METHODS_AND_URLS = {
  gateway: {
    user_service: {
      auth: {
        register: {
          send_otp: { method: METHODS.POST, url: '/auth/register/send-otp' },
          resend_otp: { method: METHODS.PATCH, url: '/auth/register/resend-otp' },
          verify_otp: { method: METHODS.POST, url: '/auth/register/verify-otp' },
          save_user: { method: METHODS.POST, url: '/auth/register/save-user' },
        },
        login: {
          manual: { method: METHODS.POST, url: '/auth/login/manual' },
        },
        password: {
          forgot: {
            send_otp: { method: METHODS.POST, url: '/auth/password/forgot-send-otp' },
            resend_otp: { method: METHODS.PATCH, url: '/auth/password/forgot-resend-otp' },
            verify_otp: { method: METHODS.POST, url: '/auth/password/forgot-verify-otp' },
            save: { method: METHODS.POST, url: '/auth/password/forgot-save' },
          },
          change: { method: METHODS.PATCH, url: '/auth/password/change' },
          set: { method: METHODS.PATCH, url: '/auth/password/set' },
        },
      },
      user: { session: { method: METHODS.GET, url: '/user/session' } },
    },
    product_service: {
      category: {
        add: { method: METHODS.POST, url: '/category/add' },
        update: { method: METHODS.PATCH, url: '/category/update' },
        get: {
          byParentLevel: { method: METHODS.GET, url: '/category/by-parent-level' },
        },
      },
    },
    token: {
      refresh: {
        baseURL: envs.urls.gateway,
        method: METHODS.POST,
        url: '/refresh-access-token',
      },
    },
  },
} as const;

export const USER_SERVICE_QUERY_KEYS = {
  auth: {
    password: {
      forgot: {
        send_otp: ['password_forgot_send_otp'],
        resend_otp: ['password_forgot_resend_otp'],
        verify_otp: ['password_forgot_verify_otp'],
        save: ['password_forgot_save'],
      },
      change: ['password_change'],
    },
    login: ['login'],
  },
  user: {
    session: ['get_session_user'],
  },
} as const;

export const PRODUCT_SERVICE_QUERY_KEYS = {
  category: {
    add: ['add_category'],
    update: ['update_category'],
    get: {
      all: ['get_all_categories'],
    },
  },
} as const;

export const QUERY_KEYS = {
  user_service: USER_SERVICE_QUERY_KEYS,
} as const;

export const AUTH_PROVIDERS = ['MANUAL', 'GOOGLE', 'LINKEDIN', 'GITHUB'] as const;

export const ROLES = ['USER', 'SELLER', 'ADMIN', 'MASTER'] as const;

export const HEADERS_KEYS = { loginRole: 'X-Login-Role' } as const;
