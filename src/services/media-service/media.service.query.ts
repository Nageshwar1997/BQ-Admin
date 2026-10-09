import { useMutation } from '@tanstack/react-query';

import { mediaApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { IUploadItemHandle, TFormDataProgress } from '@/types/common.type';
import type { ITitleDescription } from '@/types/component.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { withProgressToast } from '@/utils/common.util';
import { getFormDataFiles, withUploadsToast } from '@/utils/upload.util';

const { upload } = API_QUERY_KEYS.media_service;

interface TUploadPayload {
  data: FormData;
  toasterInfo?: Partial<ITitleDescription>;
}

export const useUploadSingleMedia = () => {
  return useMutation({
    mutationKey: upload.single,
    mutationFn: ({ data, toasterInfo }: TUploadPayload) =>
      withProgressToast({
        title: toasterInfo?.title ?? 'Please wait...',
        description: toasterInfo?.description ?? 'Uploading file...',
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

interface TUploadMultiplePayload extends TUploadPayload {
  /**
   * This upload's row in one toast that follows several uploads together (see `createUploadsToast`).
   * Without it the upload gets a toast of its own, showing how many of its files are through.
   */
  progress?: IUploadItemHandle;
}

const toastText = (value: unknown, fallback: string) =>
  typeof value === 'string' ? value : fallback;

export const useUploadMultipleMedia = () => {
  return useMutation({
    mutationKey: upload.multiple,
    mutationFn: ({ data, toasterInfo, progress }: TUploadMultiplePayload) => {
      const request = (onUploadProgress: TFormDataProgress['onUploadProgress']) =>
        mediaApi.uploadMultiple({ data, onUploadProgress });

      if (progress) return progress.run(request);

      return withUploadsToast({
        title: toastText(toasterInfo?.title, 'Please wait...'),
        description: toastText(toasterInfo?.description, 'Uploading files...'),
        files: getFormDataFiles(data),
        request,
      });
    },
    // No "uploaded" toast here: the uploads toast itself shows that everything is through.
    onError: (error) => {
      handleApiErrorToaster(error);
    },
  });
};
