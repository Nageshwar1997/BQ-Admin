import type { TFieldErrors } from '@/types/api.type';
import type { FieldErrors, FieldValues, Path, UseFormSetError } from 'react-hook-form';

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

export const toErrorMessageArray = <T extends FieldValues>(
  fieldErrors?: FieldErrors<T>,
): string[] | undefined => {
  if (!fieldErrors) return undefined;

  if (
    typeof fieldErrors === 'object' &&
    'message' in fieldErrors &&
    typeof fieldErrors.message === 'string'
  ) {
    return [fieldErrors.message];
  }

  return Object.values(fieldErrors)
    .map((error) => {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        return error.message;
      }

      return null;
    })
    .filter((message): message is string => !!message);
};
