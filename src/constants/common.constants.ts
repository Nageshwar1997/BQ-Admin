import type { IStepperStep as StepperStep } from '@beautinique/frontend-components/stepper';

export const USER_KEY = 'user' as const;

export const ROUTES = {
  DASHBOARD: '/',
  AUTH: {
    BASE: 'auth',
    FORGOT_PASSWORD: 'forgot-password',
  },
  CATEGORIES: { BASE: 'categories' },
  PRODUCTS: {
    BASE: 'products',
    ADD: 'add',
    PRODUCT_ID: ':slug',
    CATEGORY_L1: ':categoryL1',
    CATEGORY_L2: ':categoryL2',
    CATEGORY_L3: ':categoryL3',
  },
  PROFILE: {
    BASE: 'profile',
    UPDATE_PASSWORD: 'update-password',
    MY_STATUS: 'my-status',
  },
  ENQUIRIES: 'enquiries',
  SELLER_QUEUE: 'seller-queue',
  PRODUCT_QUEUE: 'product-queue',
} as const;

export const SIDEBAR_DATA = [
  {
    title: 'Dashboard',
    icon: 'solar:widget-linear',
    path: ROUTES.DASHBOARD,
    handler: null,
  },
  {
    title: 'Profile',
    icon: 'solar:user-circle-linear',
    path: `/${ROUTES.PROFILE.BASE}`,
    handler: null,
  },
  {
    title: 'Categories',
    icon: 'solar:hanger-2-linear',
    path: `/${ROUTES.CATEGORIES.BASE}`,
    handler: null,
  },
  {
    title: 'Products',
    icon: 'solar:box-minimalistic-linear',
    path: `/${ROUTES.PRODUCTS.BASE}`,
    handler: null,
  },
  {
    title: 'Enquiries',
    icon: 'solar:mailbox-linear',
    path: `/${ROUTES.ENQUIRIES}`,
    handler: null,
  },
  {
    title: 'My Queue',
    icon: 'solar:clipboard-list-linear',
    path: `/${ROUTES.SELLER_QUEUE}`,
    handler: null,
  },
  {
    title: 'My Status',
    icon: 'solar:user-check-linear',
    path: `/${ROUTES.PROFILE.MY_STATUS}`,
    handler: null,
  },
  {
    title: 'Update Password',
    icon: 'solar:lock-password-linear',
    path: `/${ROUTES.PROFILE.UPDATE_PASSWORD}`,
    handler: null,
  },
  {
    title: 'Logout',
    icon: 'solar:logout-2-linear',
    handler: 'logout',
  },
] as const;

export const QUERY_PARAMS_KEY_MAP = {
  category: {
    mode: 'mode', // To Set Mode (Edit or Add)
    add: 'add', // To Open Add Category Modal
    edit: 'edit', // To Open Edit Category Modal
    // The category tree is a single table now (see Categories.tsx) - one
    // search/sort pair applies across every level instead of one per level.
    search: 'search',
    sort: 'sort',
  },
  confirm: 'confirm', // To Open Confirm Modal
  sort: 'sort', // To Set Sort Order
} as const;

export const CATEGORY_MODAL_STEPS: StepperStep[] = [
  { title: 'Category info', description: 'Name and hierarchy', icon: 'solar:hanger-2-linear' },
  {
    title: 'Review',
    description: 'Confirm before save',
    icon: 'solar:checklist-minimalistic-linear',
  },
];

export const ADD_PRODUCT_STEPS: StepperStep[] = [
  {
    title: 'Basic information',
    description: 'Set product title, pricing, brand and category details',
    icon: 'solar:tag-price-linear',
  },
  {
    title: 'Media and gallery',
    description: 'Upload product images, thumbnail and video',
    icon: 'solar:gallery-linear',
  },
  {
    title: 'Description and details',
    description:
      'Add short description, full description, usage instructions, ingredients and additional details',
    icon: 'solar:document-text-linear',
  },
  {
    title: 'Product variants and stock',
    description: 'Set product type and Configure variants, pricing and stock',
    icon: 'solar:list-check-linear',
  },
  {
    title: 'TryOn configuration',
    description: 'Setup TryOn category and configure TryOn details',
    icon: 'solar:face-scan-square-linear',
  },
  {
    title: 'Review and confirm',
    description: 'Verify all details before saving product',
    icon: 'solar:check-circle-linear',
  },
];

export const CATEGORY_STEPPER_STEP_COUNT = [0, 1] as const;

export const CATEGORY_STEPPER_STEP_COUNT_MAP = Object.fromEntries(
  CATEGORY_STEPPER_STEP_COUNT.map((type) => [type, type]),
) as { [K in (typeof CATEGORY_STEPPER_STEP_COUNT)[number]]: K };

export const VIDEO_PLACEHOLDER = '/images/Video-Placeholder.webp';

export const PRODUCT_VARIANT_ACTIONS = [
  { content: 'Remove', className: 'bg-electric-purple-c' },
  { content: 'Clear', className: 'bg-primary-red' },
  { content: 'Add', className: 'bg-primary-yellow' },
] as const;
