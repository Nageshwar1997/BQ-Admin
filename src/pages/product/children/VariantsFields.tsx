import Button from '@/components/ui/Button';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import Select from '@/components/ui/inputs/Select';
import {
  EMPTY_ARRAY,
  PRODUCT_TYPE,
  VARIANT_TYPE,
  VARIANT_TYPE_MAP,
} from '@/constants/common.constants';
import type { TProductVariants } from '@/types/schema.type';
import { Controller, useFieldArray, type FieldErrors, type UseFormReturn } from 'react-hook-form';

const getErrorMessages = (fieldErrors?: FieldErrors<TProductVariants>): string[] | undefined => {
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
  return (Object.keys(fieldErrors) as Array<keyof TProductVariants>)
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
const VariantsFieldsTest = ({ form }: { form: UseFormReturn<TProductVariants> }) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });
  console.log('🚀 ~ VariantsFieldsTest ~ fields:', fields);

  return (
    <div className="flex flex-col gap-6">
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
      {fields.map((field, index) => {
        return (
          <div
            key={field.id}
            className="border-smoke-eerie-invert/20 bg-smoke-eerie/50 grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
          >
            <Controller
              name={`variants.${index}.type`}
              control={control}
              defaultValue={VARIANT_TYPE_MAP.COLOR}
              render={({ field: { onChange, value } }) => (
                <Radio
                  value={value}
                  onChange={onChange}
                  options={VARIANT_TYPE.map((type) => ({ label: type, value: type }))}
                  containerClassName="sm:col-span-2 max-w-xs w-full mx-auto mb-2"
                  error={errors.variants?.[index]?.type?.message}
                />
              )}
            />
            <Input
              label="Variant name"
              register={register(`variants.${index}.label`)}
              error={errors.variants?.[index]?.label?.message}
              inputProps={{ placeholder: 'Black' }}
            />
            <Input
              label={field?.type === VARIANT_TYPE_MAP.COLOR ? 'Hex color code' : 'Variant value'}
              register={register(`variants.${index}.value`)}
              error={errors.variants?.[index]?.value?.message}
              inputProps={{
                placeholder: field?.type === VARIANT_TYPE_MAP.COLOR ? '#000000' : '50ml',
              }}
            />
            <Input
              label="Original Price"
              register={register(`variants.${index}.originalPrice`, { valueAsNumber: true })}
              error={errors.variants?.[index]?.originalPrice?.message}
              inputProps={{ type: 'number', placeholder: '999' }}
            />
            <Input
              label="Discounted price"
              register={register(`variants.${index}.sellingPrice`, { valueAsNumber: true })}
              error={errors.variants?.[index]?.sellingPrice?.message}
              inputProps={{ type: 'number', placeholder: '799' }}
            />
            <Input
              label="Stock"
              register={register(`variants.${index}.stock`, { valueAsNumber: true })}
              error={errors.variants?.[index]?.stock?.message}
              inputProps={{ type: 'number', placeholder: '100' }}
            />
            <Input
              label="Stock threshold"
              register={register(`variants.${index}.stockThreshold`, {
                valueAsNumber: true,
              })}
              error={errors.variants?.[index]?.stockThreshold?.message}
              inputProps={{ type: 'number', placeholder: '100' }}
            />
            <Controller
              control={control}
              name={`variants.${index}.thumbnail`}
              render={({ field: { name, onChange, value } }) => (
                <FileInput
                  fileInputProps={{
                    name,
                    placeholder: !!field?.thumbnail ? 'Change thumbnail' : 'Select thumbnail',
                    onChange: ({ target: { files } }) => onChange(files?.[0]),
                    value,
                  }}
                  errors={getErrorMessages(errors.variants?.[index]?.thumbnail)}
                  handleRemove={() =>
                    form.resetField(`variants.${index}.thumbnail`, { defaultValue: undefined })
                  }
                />
              )}
            />
            <Controller
              control={control}
              name={`variants.${index}.images`}
              render={({ field: { name, onChange, value } }) => (
                <FileInput
                  fileInputProps={{
                    name,
                    placeholder: field?.images?.length ? 'Change images' : 'Select images',
                    multiple: true,
                    disabled: field?.images?.length >= 10,
                    onChange: (event) => {
                      const newFiles = Array.from(event.target.files || EMPTY_ARRAY);
                      const oldImages = field?.images || EMPTY_ARRAY;
                      const files = [...oldImages, ...newFiles];
                      onChange(files);
                    },
                    value,
                  }}
                  errors={getErrorMessages(errors.variants?.[index]?.images)}
                  handleRemove={(index) => {
                    const oldImages = field?.images || EMPTY_ARRAY;

                    const nextValue = oldImages.filter((_, currentIndex) => currentIndex !== index);

                    form.setValue(`variants.${index}.images`, nextValue, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                />
              )}
            />
            <Button
              pattern="outline"
              content="Reset"
              className="bg-primary-red border-none text-white"
              buttonProps={{
                type: 'button',
                onClick: () => {
                  form.setValue(`variants.${index}`, {
                    type: VARIANT_TYPE_MAP.COLOR,
                    label: '',
                    value: '',
                    originalPrice: NaN,
                    sellingPrice: NaN,
                    stock: NaN,
                    stockThreshold: NaN,
                    thumbnail: undefined,
                    images: [],
                  });

                  form.clearErrors(`variants.${index}`);
                },
              }}
            />
            <Button
              pattern="outline"
              content="Save"
              className="bg-primary-yellow border-none text-white"
              buttonProps={{
                type: 'button',
                onClick: () => {
                  console.log(form.getValues(`variants.${index}`));
                },
              }}
            />
          </div>
        );
      })}

      <Button
        pattern="primary"
        content="Add variant"
        buttonProps={{
          type: 'button',
          onClick: () => append({} as TProductVariants['variants'][number]),
        }}
      />
    </div>
  );
};

export default VariantsFieldsTest;
