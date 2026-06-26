import { CATEGORY_LEVEL_MAP } from '@beautinique/shared-constants';

const passwords = { password: '', confirmPassword: '' };

const changePassword = { ...passwords, currentPassword: '' };

export const FORM_DEFAULT_VALUES = {
  passwords,
  changePassword,
  email: { email: '' },
  phoneNumber: { phoneNumber: '' },
  otp: { otp: '' },
  register: {
    ...passwords,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  },
  login: {
    loginMethod: 'email',
    email: undefined,
    phoneNumber: undefined,
    password: '',
  },
  addProduct: {
    title: '',
    brand: '',
    mainCategory: '',
    subCategory: '',
    productCategory: '',
    mrp: '',
    salePrice: '',
    stock: '',
    imageUrl: '',
    confirmDetails: false,
  },
  category: {
    activeStep: 0,
    name: '',
    level: CATEGORY_LEVEL_MAP.L1,
    mainCategory: '',
    subCategory: '',
    description: '',
  },
} as const;

export const ADD_PRODUCT_FORM_ID_MAP = {
  0: 'product-basic-info-form',
  1: 'product-media-form',
  2: 'product-description-form',
  3: 'product-variants-form',
  4: 'product-try-on-form',
  5: 'product-confirm-form',
} as const;

export const TRY_ON_MAP = {
  LIP: ['MATTE', 'GLOSS', 'SHIMMER', 'CRAYON'],
  EYE: ['EYEBROW', 'EYELINER', 'KAJAL', 'EYESHADOW'],
  HAIR: ['COLOR'],
  FACE: ['CONCEALER', 'FOUNDATION', 'HIGHLIGHTER', 'BLUSH'],
  NAIL: ['GEL', 'LIQUID'],
  SKIN: ['MOISTURIZER', 'SERUM', 'TONER', 'CLEANSER'],
} as const;

export const TRY_ON_CATEGORIES = Object.keys(TRY_ON_MAP) as (keyof typeof TRY_ON_MAP)[];

export const TRYON_ALL_SUB_CATEGORIES = Object.values(TRY_ON_MAP).flat();

export const TRYON_CATEGORY_MAP = Object.fromEntries(
  TRY_ON_CATEGORIES.map((category) => [category, category]),
) as {
  [K in keyof typeof TRY_ON_MAP]: K;
};
