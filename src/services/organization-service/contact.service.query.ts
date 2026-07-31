import type { IListContactQueriesQuery } from '@beautinique/frontend-types';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { contactApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { list, updateStatus } = API_QUERY_KEYS.organization_service.contact;

export const useUpdateContactQueryStatus = () => {
  return useMutation({
    mutationKey: updateStatus({ ticketId: '' }),
    mutationFn: contactApi.updateContactQueryStatus,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Updating status...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
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

export const useGetContactQueries = (
  params: Pick<IListContactQueriesQuery, 'queryType' | 'status'>,
) => {
  return useInfiniteQuery({
    queryKey: [...list, ...Object.values(params)],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      contactApi.getContactQueries({ page: pageParam.toString(), limit: '15' }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;

      if (!pagination) return undefined;

      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,

    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => data.pages.flatMap((page) => page.data?.queries ?? []),
  });
};
