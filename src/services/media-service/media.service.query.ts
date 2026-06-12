import { mediaApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { TTitleDescription } from '@/types/component.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { withProgressToast } from '@/utils/common.util';
import { useMutation } from '@tanstack/react-query';

const { upload } = API_QUERY_KEYS.media_service;

type TUploadPayload = {
  data: FormData;
  toasterInfo?: Partial<TTitleDescription>;
};
export const useUploadSingleMedia = () => {
  return useMutation({
    mutationKey: upload.single,
    mutationFn: ({ data, toasterInfo }: TUploadPayload) =>
      withProgressToast({
        title: toasterInfo?.title || 'Please wait...',
        description: toasterInfo?.description || 'Uploading file...',
        request: (onUploadProgress) => mediaApi.uploadSingle({ data, onUploadProgress }),
      }),
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
  });
};

export const useUploadMultipleMedia = () => {
  return useMutation({
    mutationKey: upload.multiple,
    mutationFn: ({ data, toasterInfo }: TUploadPayload) =>
      withProgressToast({
        title: toasterInfo?.title || 'Please wait...',
        description: toasterInfo?.description || 'Uploading files...',
        request: (onUploadProgress) => mediaApi.uploadMultiple({ data, onUploadProgress }),
      }),
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
  });
};
