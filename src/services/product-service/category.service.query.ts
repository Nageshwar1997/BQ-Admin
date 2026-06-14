import { categoryApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type {
  TApiCategory,
  TApiL1Category,
  TApiL2Category,
  TApiL3Category,
} from '@/types/api.type';
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
  ...props
}: { enabled?: boolean } & Partial<
  | Pick<TApiL1Category, 'level'>
  | Pick<TApiL2Category, 'level' | 'parent'>
  | Pick<TApiL3Category, 'level' | 'parent'>
>) => {
  const level = props.level;
  const parent = 'parent' in props ? props.parent : undefined;
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
    select: (data) => (data?.categories || []) as TApiCategory[],
  });
};
