import { categoryApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { ICategory } from '@/types/api.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { get, add, update, delete: remove } = API_QUERY_KEYS.product_service.category;

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: add,
    mutationFn: categoryApi.addCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Adding category...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
      await queryClient.invalidateQueries({ queryKey: get.byParentLevel });
    },

    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useUpdateCategory = ({ categoryId = '' }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: update({ categoryId }),
    mutationFn: categoryApi.updateCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Updating category...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
      await queryClient.invalidateQueries({ queryKey: get.byParentLevel });
    },
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useDeleteCategory = ({ categoryId = '' }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: remove({ categoryId }),
    mutationFn: categoryApi.deleteCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Deleting category...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
      await queryClient.invalidateQueries({ queryKey: get.byParentLevel });
    },
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
    queryKey: [...get.byParentLevel, level, parent],
    queryFn: () => categoryApi.getCategoriesByParentLevel({ level, parent }),
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled: enabled,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => data?.categories || [],
  });
};
