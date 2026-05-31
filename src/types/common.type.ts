import type { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';

export type TAddProductStepNumber = keyof typeof ADD_PRODUCT_FORM_ID_MAP;

export type TAddProductFormId = (typeof ADD_PRODUCT_FORM_ID_MAP)[TAddProductStepNumber];
