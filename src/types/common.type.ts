import type { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import type Quill from 'quill';
import type { RefObject } from 'react';
import type { TQuillImageRef } from './component.type';
import type { TProductDescriptionAndContent } from './schema.type';

export type TAddProductStepNumber = keyof typeof ADD_PRODUCT_FORM_ID_MAP;

export type TAddProductFormId = (typeof ADD_PRODUCT_FORM_ID_MAP)[TAddProductStepNumber];

export type TProductContentFields = keyof Omit<TProductDescriptionAndContent, 'shortDescription'>;

export type TProductQuillRefs = Record<TProductContentFields, RefObject<Quill | null>>;

export type TProductQuillImageRefs = Record<TProductContentFields, RefObject<TQuillImageRef[]>>;
