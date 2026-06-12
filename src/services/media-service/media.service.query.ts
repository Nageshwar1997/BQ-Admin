import { mediaApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { withProgressToast } from '@/utils/common.util';
import { useMutation } from '@tanstack/react-query';

const { upload } = API_QUERY_KEYS.media_service;

export const useUploadSingleMedia = () => {
  return useMutation({
    mutationKey: upload.single,

    mutationFn: (data: FormData) =>
      withProgressToast({
        title: 'Please wait...',
        description: 'Uploading file...',
        request: (onUploadProgress) => mediaApi.uploadSingle({ data, onUploadProgress }),
      }),

    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },

    onError: (error) => {
      handleApiErrorToaster(error);
    },
  });
};

export const useUploadMultipleMedia = () => {
  return useMutation({
    mutationKey: upload.multiple,

    mutationFn: (data: FormData) =>
      withProgressToast({
        title: 'Please wait...',
        description: 'Uploading files...',
        request: (onUploadProgress) => mediaApi.uploadMultiple({ data, onUploadProgress }),
      }),

    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },

    onError: (error) => {
      handleApiErrorToaster(error);
    },
  });
};
