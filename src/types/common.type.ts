import type { TProductDescriptionAndContentZodSchema } from '@beautinique/frontend-types';
import type { AxiosProgressEvent } from 'axios';
import type Quill from 'quill';
import type { RefObject } from 'react';

import type { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';

import type { IQuillImageRef } from './component.type';

export type TAddProductStepNumber = keyof typeof ADD_PRODUCT_FORM_ID_MAP;

export type TAddProductFormId = (typeof ADD_PRODUCT_FORM_ID_MAP)[TAddProductStepNumber];

export type TProductContentFields = keyof Omit<
  TProductDescriptionAndContentZodSchema,
  'shortDescription' | 'step'
>;

export type TProductQuillRefs = Record<TProductContentFields, RefObject<Quill | null>>;

export type TProductQuillImageRefs = Record<TProductContentFields, RefObject<IQuillImageRef[]>>;

export type TUploadProgressHandler = (event: AxiosProgressEvent) => void;

export interface TFormDataProgress {
  data: FormData;
  onUploadProgress?: TUploadProgressHandler;
}

export interface IUploadItemHandle {
  /**
   * Runs the upload: shows it as uploading, follows its progress, shows it as done or failed, and
   * gives back what the request gave back (or throws what it threw).
   */
  run: <T>(request: (onProgress: TUploadProgressHandler) => Promise<T>) => Promise<T>;
}

export interface IUploadGroup {
  item: (id: string) => IUploadItemHandle;
  /** Call when the uploads are over: an upload that never ran (or never finished) shows as failed. */
  end: () => void;
}
