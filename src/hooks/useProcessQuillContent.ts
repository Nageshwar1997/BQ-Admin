import type { ITitleDescription } from '@beautinique/frontend-components';
import {
  processQuillContent as processContent,
  type QuillImageRef,
  QuillUploadCountError,
} from '@beautinique/frontend-quill/editor';
import type { IUploadItemHandle } from '@beautinique/frontend-stores';
import type Quill from 'quill';
import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { FieldPath, FieldPathValue, FieldValues, UseFormSetValue } from 'react-hook-form';

import { useUploadMultipleMedia } from '@/services/media-service/media.service.query';
import { toaster } from '@/utils/toaster';

interface IProcessQuillContent<T extends FieldValues> {
  quillRef: RefObject<Quill | null>;
  /** The images the editor holds (the `imagesRef` it was given). */
  imagesRef: RefObject<QuillImageRef[]>;
  setValue: UseFormSetValue<T>;
  field: FieldPath<T>;
  folder: string;
  toasterInfo?: Partial<ITitleDescription>;
  /** This field's row in a toast that follows several uploads together (see `runUploadsInToast`). */
  progress?: IUploadItemHandle;
}

/**
 * Makes the content of a Quill editor ready to be saved: uploads the images that were picked in it (one
 * request, with a toast that follows it), puts their addresses in the text, and sets the field of the
 * form to the cleaned HTML. The work on the content is the quill package's `processQuillContent`; this
 * hook gives it this app's upload.
 */
export const useProcessQuillContent = <T extends FieldValues>() => {
  const { mutateAsync, isPending } = useUploadMultipleMedia();

  const processQuillContent = useCallback(
    async ({
      quillRef,
      imagesRef,
      setValue,
      field,
      folder,
      toasterInfo = {
        title: 'Please wait...',
        description: 'Uploading content files...',
      },
      progress,
    }: IProcessQuillContent<T>) => {
      if (!quillRef.current) return '';

      try {
        const content = await processContent({
          quill: quillRef.current,
          imagesRef,
          upload: async (files) => {
            const formData = new FormData();

            files.forEach((file) => {
              formData.append('files', file);
            });

            formData.append('folder', folder);

            const { data } = await mutateAsync({ data: formData, toasterInfo, progress });

            return data ?? [];
          },
        });

        setValue(field, content as FieldPathValue<T, typeof field>);

        return content;
      } catch (error) {
        if (error instanceof QuillUploadCountError) {
          toaster.error({
            title: 'Upload failed',
            description: 'Some files could not be uploaded.',
          });

          throw new Error('File upload count mismatch', { cause: error });
        }

        throw error;
      }
    },
    [mutateAsync],
  );

  return { processQuillContent, isPending };
};
