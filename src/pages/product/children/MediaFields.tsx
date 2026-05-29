import Button from '@/components/ui/Button';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { EMPTY_ARRAY, FILE_MIME, PRODUCT_TYPE } from '@/constants/common.constants';
import type { TProductMedia } from '@/types/schema.type';
import {
  Controller,
  useFieldArray,
  useWatch,
  type FieldErrors,
  type UseFormReturn,
} from 'react-hook-form';

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
    register,
    resetField,
    setValue,
  } = form;
  console.log('🚀 ~ MediaFields ~ errors:', errors);

  const images = useWatch({ control, name: 'images' });
  const thumbnail = useWatch({ control, name: 'thumbnail' });
  const video = useWatch({ control, name: 'video' });

  const baseVariant = useWatch({ control, name: 'baseVariant' });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });
  console.log('🚀 ~ MediaFields ~ fields:', fields);

  return (
    <div className="grid gap-4">
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
            handleRemove={() => resetField('thumbnail', { defaultValue: undefined })}
          />
        )}
      />

      <Controller
        control={control}
        name="images"
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
            handleRemove={() => resetField('video', { defaultValue: undefined })}
          />
        )}
      />

      <Controller
        name="productType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Product type"
            error={errors.productType?.message}
            options={PRODUCT_TYPE.map((type) => ({ label: type, value: type }))}
            selectProps={{ value, placeholder: 'Select product type', onChange }}
          />
        )}
      />

      <div className="border-smoke-eerie-invert/20 bg-smoke-eerie/50 grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
        <Controller
          name={`baseVariant.type`}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Variant type"
              error={errors.baseVariant?.type?.message}
              options={[
                { label: 'Color', value: 'color' },
                { label: 'Text', value: 'text' },
              ]}
              selectProps={{
                value,
                onChange,
                placeholder: 'Select variant type',
              }}
            />
          )}
        />

        <Input
          label="Variant name"
          register={register(`baseVariant.label`)}
          error={errors.baseVariant?.label?.message}
          inputProps={{ placeholder: 'Black' }}
        />

        <Input
          label={baseVariant?.type === 'color' ? 'Hex code' : 'Variant value'}
          register={register(`baseVariant.value`)}
          error={errors.baseVariant?.value?.message}
          inputProps={{ placeholder: baseVariant?.type === 'color' ? '#000000' : '50ml' }}
        />

        <Input
          label="Original Price"
          register={register(`baseVariant.originalPrice`, { valueAsNumber: true })}
          error={errors.baseVariant?.originalPrice?.message}
          inputProps={{ type: 'number', placeholder: '999' }}
        />

        <Input
          label="Discounted price"
          register={register(`baseVariant.sellingPrice`, { valueAsNumber: true })}
          error={errors.baseVariant?.sellingPrice?.message}
          inputProps={{ type: 'number', placeholder: '799' }}
        />

        <Input
          label="Stock"
          register={register(`baseVariant.stock`, { valueAsNumber: true })}
          error={errors.baseVariant?.stock?.message}
          inputProps={{ type: 'number', placeholder: '100' }}
        />

        <Controller
          control={control}
          name="baseVariant.thumbnail"
          render={({ field: { name, onChange, value } }) => (
            <FileInput
              fileInputProps={{
                name,
                placeholder: !!baseVariant?.thumbnail ? 'Change thumbnail' : 'Select thumbnail',
                onChange: ({ target: { files } }) => onChange(files?.[0]),
                value,
              }}
              errors={getErrorMessages(errors.baseVariant?.thumbnail)}
              handleRemove={() => resetField('baseVariant.thumbnail', { defaultValue: undefined })}
            />
          )}
        />

        <Controller
          control={control}
          name="baseVariant.images"
          render={({ field: { name, onChange, value } }) => (
            <FileInput
              fileInputProps={{
                name,
                placeholder: baseVariant?.images?.length ? 'Change images' : 'Select images',
                multiple: true,
                disabled: images?.length >= 10,
                onChange: (event) => {
                  const newFiles = Array.from(event.target.files || EMPTY_ARRAY);
                  const oldImages = baseVariant?.images || EMPTY_ARRAY;
                  const files = [...oldImages, ...newFiles];
                  onChange(files);
                },
                value,
              }}
              errors={getErrorMessages(errors.baseVariant?.images)}
              handleRemove={(index) => {
                const oldImages = baseVariant?.images || EMPTY_ARRAY;

                const nextValue = oldImages.filter((_, currentIndex) => currentIndex !== index);

                setValue('baseVariant.images', nextValue, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
            />
          )}
        />
        <>
          <Input
            label="Stock threshold"
            register={register(`baseVariant.stockThreshold`, {
              valueAsNumber: true,
            })}
            error={errors.baseVariant?.stockThreshold?.message}
            inputProps={{ type: 'number', placeholder: '100' }}
          />
          <div className="flex h-min gap-4">
            <Button
              pattern="outline"
              content="Clear"
              className="bg-primary-red border-none text-white"
              buttonProps={{
                type: 'button',
                onClick: () => resetField('baseVariant'),
              }}
            />
            <Button
              pattern="outline"
              content="Add"
              className="bg-primary-yellow border-none text-white"
              buttonProps={{
                type: 'button',
                onClick: async () => {
                  const isValid = await form.trigger('baseVariant');
                  console.log('🚀 ~ MediaFields ~ isValid:', isValid);

                  console.log('🚀 ~ MediaFields ~ baseVariant:', baseVariant);
                  if (!isValid || !baseVariant) return;

                  append(structuredClone(baseVariant));
                },
              }}
            />
          </div>
        </>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border-smoke-eerie-invert/20 bg-smoke-eerie/30 rounded-xl border p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p>{field.label}</p>
              <p className="text-secondary text-xs">
                {field.type} • {field.value}
              </p>
            </div>

            <Button
              pattern="secondary"
              content="Remove"
              buttonProps={{
                type: 'button',
                onClick: () => remove(index),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
