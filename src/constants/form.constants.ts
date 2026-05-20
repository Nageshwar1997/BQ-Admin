import { CATEGORY_LEVELS_MAP } from './common.constants';

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
    level: CATEGORY_LEVELS_MAP.L1,
    mainCategory: '',
    subCategory: '',
    description: '',
    confirmDetails: false,
  },
} as const;
