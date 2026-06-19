import { productApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { SORT_ORDER_MAP } from '@/constants/common.constants';
import type { ITimeStamp, TProductStatus } from '@/types/api.type';
import type { TDraftProduct } from '@/types/schema.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { draft, get } = API_QUERY_KEYS.product_service.product;

export const useSaveDraftProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: draft.save,
    mutationFn: productApi.saveDraftProduct,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your product in draft...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: [draft.get] });
      handleApiSuccessToaster(message);
    },
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const usePublishProduct = () => {
  return useMutation({
    mutationKey: draft.publish,
    mutationFn: productApi.publishDraftProduct,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending your product for approval...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useGetDraftProduct = () => {
  return useQuery({
    queryKey: draft.get,
    queryFn: productApi.getDraftProduct,
    retry: false,
    select: (data) => data?.draft as Partial<TDraftProduct> | undefined,
  });
};

export const useGetDashboardProducts = (params: {
  limit?: string;
  search?: string;
  status?: TProductStatus;
  category?: string;
  sortBy?: keyof ITimeStamp;
  sortOrder?: (typeof SORT_ORDER_MAP)[keyof typeof SORT_ORDER_MAP];
}) => {
  return useInfiniteQuery({
    queryKey: [...get.dashboard, ...Object.values(params)],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      productApi.getDashboardProducts({ ...params, page: pageParam.toString() }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;

      if (!pagination) return undefined;

      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,

    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,

    select: (data) => {
      console.log("🚀 ~ useGetDashboardProducts ~ data:", data)
      return {
      products: data.pages.flatMap((page) => page.data.products),
      counts: data.pages[0]?.data.counts,
      pagination: data.pages[data.pages.length - 1]?.data.pagination,
      draft: data.pages[0]?.data.draft,
    };
    },
  });
};
