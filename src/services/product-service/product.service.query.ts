import { productApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { useMutation } from '@tanstack/react-query';

const { draft } = API_QUERY_KEYS.product_service.product;

export const useSaveDraftProduct = () => {
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
    onSuccess: async ({ message }) => handleApiSuccessToaster(message),
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
