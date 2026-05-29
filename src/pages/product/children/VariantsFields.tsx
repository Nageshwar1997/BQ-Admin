import Button from '@/components/ui/Button';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { EMPTY_ARRAY, PRODUCT_TYPE } from '@/constants/common.constants';
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
          <div className="border-smoke-eerie-invert/20 bg-smoke-eerie/50 grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
            <Controller
              name={`variants.${index}.type`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Variant type"
                  error={errors.variants?.[index]?.type?.message}
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
              register={register(`variants.${index}.label`)}
              error={errors.variants?.[index]?.label?.message}
              inputProps={{ placeholder: 'Black' }}
            />

            <Input
              label={field?.type === 'color' ? 'Hex color code' : 'Variant value'}
              register={register(`variants.${index}.value`)}
              error={errors.variants?.[index]?.value?.message}
              inputProps={{ placeholder: field?.type === 'color' ? '#000000' : '50ml' }}
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
            <>
              <Input
                label="Stock threshold"
                register={register(`variants.${index}.stockThreshold`, {
                  valueAsNumber: true,
                })}
                error={errors.variants?.[index]?.stockThreshold?.message}
                inputProps={{ type: 'number', placeholder: '100' }}
              />
              <div className="flex h-min gap-4">
                <Button
                  pattern="outline"
                  content="Clear"
                  className="bg-primary-red border-none text-white"
                  buttonProps={{
                    type: 'button',
                    // onClick: () => resetField('baseVariant'),
                  }}
                />
                <Button
                  pattern="outline"
                  content="Add"
                  className="bg-primary-yellow border-none text-white"
                  buttonProps={{
                    type: 'button',
                  }}
                />
              </div>
            </>
          </div>
        );
      })}

      <Button
        pattern="primary"
        content="Add variant"
        buttonProps={{
          type: 'button',
          // onClick: () => append({}),
        }}
      />
    </div>
  );
};

export default VariantsFieldsTest;
