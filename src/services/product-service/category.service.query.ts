import { productApi } from '@/classes/apis';
import { PRODUCT_SERVICE_QUERY_KEYS } from '@/constants/api.constants';
import type { ICategory } from '@/types/api.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

const { get, add, update, delete: remove } = PRODUCT_SERVICE_QUERY_KEYS.category;

export const useAddCategory = () => {
  return useMutation({
    mutationKey: add,
    mutationFn: productApi.addCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Adding category...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationKey: update,
    mutationFn: productApi.updateCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Updating category...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationKey: remove,
    mutationFn: productApi.deleteCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Deleting category...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useGetCategoriesByParentLevel = ({
  enabled = true,
  level,
  parent,
}: { enabled?: boolean } & Partial<Pick<ICategory, 'level' | 'parent'>>) => {
  return useQuery({
    queryKey: [...get.all, level, parent],
    queryFn: () => productApi.getCategoriesByParentLevel({ level, parent }),
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled: enabled,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => data?.categories || [],
  });
};
