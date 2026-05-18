import type ApiError from '@/classes/ApiError';
import { SORT_ORDER_MAP } from '@/constants/common.constants';
import type { ICategory } from '@/types/api.type';
import type { TSort } from '@/types/component.type';
import { toaster } from './common.util';

export const handleApiErrorToaster = ({ message, globalErrors }: ApiError, title = 'Error') => {
  if (globalErrors?.length) {
    globalErrors.forEach((error) => {
      if (error) {
        toaster.error({ title, description: error });
      }
    });
  } else if (message) {
    toaster.error({ title, description: message });
  }
};

export const handleApiSuccessToaster = (message: string, title = 'Success') => {
  toaster.success({ title, description: message });
};

export const getFilteredAndSortedCats = (categories: ICategory[], search: string, sort?: TSort) => {
  const value = search?.toLowerCase().trim();
  const filtered = value
    ? categories.filter((category) =>
        [category.name, category.slug].join(' ').toLowerCase().includes(value),
      )
    : categories;

  if (!sort) return filtered;

  return [...filtered].sort((a, b) => {
    const direction = sort === SORT_ORDER_MAP.desc ? -1 : 1;
    return a.name.localeCompare(b.name) * direction;
  });
};
