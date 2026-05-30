import FileInput from '@/components/ui/inputs/FileInput';
import { EMPTY_ARRAY, FILE_MIME } from '@/constants/common.constants';
import type { TProductMedia } from '@/types/schema.type';
import { Controller, useWatch, type FieldErrors, type UseFormReturn } from 'react-hook-form';

const getErrorMessages = (fieldErrors?: FieldErrors<TProductMedia>): string[] | undefined => {
  if (!fieldErrors) return undefined;

  // Direct message object
  if (
    typeof fieldErrors === 'object' &&
    'message' in fieldErrors &&
    typeof fieldErrors.message === 'string'
  ) {
    return [fieldErrors.message];
  }

  // Array/object indexed errors
  return (Object.keys(fieldErrors) as Array<keyof TProductMedia>)
    .map((key) => {
      const error = fieldErrors[key];

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
    .filter(Boolean) as string[];
};

export const TestMediaFields = ({ form }: { form: UseFormReturn<TProductMedia> }) => {
  const {
    control,
    formState: { errors },
    resetField,
    setValue,
  } = form;
  console.log('🚀 ~ TestMediaFields ~ errors:', errors);

  const images = useWatch({ control, name: 'images' });
  const thumbnail = useWatch({ control, name: 'thumbnail' });
  const video = useWatch({ control, name: 'video' });

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="thumbnail"
          render={({ field: { name, onChange, value } }) => (
            <FileInput
              label="Thumbnail"
              fileInputProps={{
                name,
                placeholder: !!thumbnail ? 'Change thumbnail' : 'Select thumbnail',
                onChange: ({ target: { files } }) => onChange(files?.[0]),
                value,
              }}
              errors={getErrorMessages(errors.thumbnail)}
              handleRemove={() => resetField('thumbnail')}
            />
          )}
        />
        <Controller
          control={control}
          name="video"
          render={({ field: { name, value, onChange } }) => (
            <FileInput
              label="Video"
              fileInputProps={{
                name,
                placeholder: !!video ? 'Change video' : 'Select video',
                accept: FILE_MIME.video.join(','),
                onChange: ({ target: { files } }) => onChange(files?.[0]),
                value,
              }}
              errors={getErrorMessages(errors.video)}
              handleRemove={() => resetField('video')}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="images"
        defaultValue={[]}
        render={({ field: { name, onChange, value } }) => (
          <FileInput
            label="Images"
            fileInputProps={{
              name,
              placeholder: images?.length ? 'Change images' : 'Select images',
              multiple: true,
              disabled: images?.length >= 10,
              onChange: (event) => {
                const newFiles = Array.from(event.target.files || EMPTY_ARRAY);
                const files = [...images, ...newFiles];
                onChange(files);
              },
              value,
            }}
            errors={getErrorMessages(errors.images)}
            handleRemove={(index) => {
              const nextValue = images.filter((_, currentIndex) => currentIndex !== index);

              setValue('images', nextValue, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
        )}
      />
    </div>
  );
};
