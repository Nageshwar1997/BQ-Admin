import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sellerApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { ISellerQueueQuery } from '@/types/api.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { queue, updateApprovalStatus } = API_QUERY_KEYS.organization_service.seller;

export const useGetSellerQueue = (params: ISellerQueueQuery) => {
  return useQuery({
    queryKey: [...queue, params.status, params.filter] as const,
    queryFn: () => sellerApi.getSellerQueue(params),

    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,

    select: (data) => data.data ?? [],
  });
};

export const useUpdateSellerApprovalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateApprovalStatus({ sellerId: '' }),
    mutationFn: sellerApi.updateSellerApprovalStatus,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Updating seller status...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: queue });
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};
