import { mediaApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { useMutation } from '@tanstack/react-query';

const { upload } = API_QUERY_KEYS.media_service;

export const useUploadSingleMedia = () => {
  return useMutation({
    mutationKey: upload.single,
    mutationFn: mediaApi.uploadSingle,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Uploading file...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
    },

    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useUploadMultipleMedia = () => {
  return useMutation({
    mutationKey: upload.multiple,
    mutationFn: mediaApi.uploadMultiple,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Uploading files...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
    },

    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};
