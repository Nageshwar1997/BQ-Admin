import type { TFieldErrors } from '@/types/api.type';
import type { IProcessQuillContent } from '@/types/input.type';
import axios from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toaster } from './common.util';

export const setErrorToForm = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors?: TFieldErrors,
) => {
  if (!errors || Object.keys(errors).length === 0) return;

  // field errors
  Object.entries(errors).forEach(([field, messages]) => {
    setError(field as Path<T>, {
      type: 'server',
      message: messages.join('\n'),
    });
  });
};

export const processQuillContent = async ({
  quillRef,
  quillImagesRef,
  setValue,
  fieldName,
  folderName,
  setLoading,
}: IProcessQuillContent) => {
  if (!quillRef.current) return;
  const quill = quillRef.current;
  let content = quill.root.innerHTML;

  const images = quillImagesRef.current;

  const files = images.map(({ file }) => file).filter(Boolean);

  // If no blob images, just set the value and return
  if (!files.length) {
    setValue(fieldName, content);
    return;
  }

  if (setLoading) {
    setLoading(true);
  }
  try {
    const response = await axios.post('/api/cloudinary/upload', {
      folderName,
      files,
      responseType: 'image',
    });

    const cdnUrls = response.data.filter(Boolean);

    if (cdnUrls.length !== files.length) {
      return toaster.error({ title: 'Cloudinary upload failed', description: 'Please try again.' });
    }

    images.forEach(({ blobUrl }, index) => {
      const cloudUrl = cdnUrls[index];
      content = content.replace(blobUrl, cloudUrl);
    });

    quill.root.innerHTML = content;
    setValue(fieldName, content);
  } finally {
    if (setLoading) {
      setLoading(false); // End loading no matter what
    }
  }
};

export const getQuillValue = (value: string | undefined) => {
  return value !== '<p><br></p>' ? value : '';
};
