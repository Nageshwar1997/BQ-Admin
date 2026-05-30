import Button from '@/components/ui/Button';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import Select from '@/components/ui/inputs/Select';
import {
  EMPTY_ARRAY,
  PRODUCT_TYPE_MAP,
  VARIANT_TYPE,
  VARIANT_TYPE_MAP,
} from '@/constants/common.constants';
import type { TProductVariants } from '@/types/schema.type';
import { toaster } from '@/utils/common.util';
import { useEffect } from 'react';
import {
  Controller,
  useFieldArray,
  useWatch,
  type FieldErrors,
  type UseFormReturn,
} from 'react-hook-form';

const EMPTY_VARIANT = {
  type: VARIANT_TYPE_MAP.COLOR,
  label: '',
  value: '',
  originalPrice: NaN,
  sellingPrice: NaN,
  stock: NaN,
  stockThreshold: NaN,
  thumbnail: undefined,
  images: [],
};

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
  console.log('🚀 ~ VariantsFieldsTest ~ errors:', errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });
  console.log('🚀 ~ VariantsFieldsTest ~ fields:', fields);

  const productType = useWatch({
    control,
    name: 'productType',
    defaultValue: PRODUCT_TYPE_MAP.SIMPLE,
  });

  const variants = useWatch({ control, name: 'variants' });

  useEffect(() => {
    if (productType === PRODUCT_TYPE_MAP.VARIABLE && !fields.length) {
      append(EMPTY_VARIANT);
    }
  }, [productType, fields.length, append]);
  return (
    <div className="flex flex-col gap-6">
      <Controller
        name="productType"
        control={control}
        defaultValue={PRODUCT_TYPE_MAP.SIMPLE}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Product type"
            error={errors.productType?.message}
            options={[
              { label: 'Simple without variants', value: PRODUCT_TYPE_MAP.SIMPLE },
              {
                label: 'Variable with variants',
                value: PRODUCT_TYPE_MAP.VARIABLE,
              },
            ]}
            selectProps={{
              value,
              placeholder: 'Select product type',
              disabled: fields.length > 1,
              onChange: (value) => {
                if (fields.length <= 1) {
                  onChange(value);
                  if (value === PRODUCT_TYPE_MAP.SIMPLE) {
                    form.resetField('variants');
                  }
                }
              },
            }}
          />
        )}
      />
      {productType === PRODUCT_TYPE_MAP.VARIABLE &&
        fields.map((field, index) => {
          const currentVariant = variants?.[index];
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
                    value={value ?? VARIANT_TYPE_MAP.COLOR}
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
                label={
                  currentVariant?.type === VARIANT_TYPE_MAP.COLOR
                    ? 'Hex color code'
                    : 'Variant value'
                }
                register={register(`variants.${index}.value`)}
                error={errors.variants?.[index]?.value?.message}
                inputProps={{
                  placeholder: currentVariant?.type === VARIANT_TYPE_MAP.COLOR ? '#000000' : '50ml',
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
                    label="Thumbnail"
                    fileInputProps={{
                      name,
                      placeholder: !!currentVariant?.thumbnail
                        ? 'Change thumbnail'
                        : 'Select thumbnail',
                      onChange: ({ target: { files } }) => onChange(files?.[0]),
                      value,
                    }}
                    errors={getErrorMessages(errors.variants?.[index]?.thumbnail)}
                    handleRemove={() =>
                      form.resetField(`variants.${index}.thumbnail`)
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name={`variants.${index}.images`}
                render={({ field: { name, onChange, value } }) => (
                  <FileInput
                    label="Images"
                    fileInputProps={{
                      name,
                      placeholder: currentVariant?.images?.length
                        ? 'Change images'
                        : 'Select images',
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

                      const nextValue = oldImages.filter(
                        (_, currentIndex) => currentIndex !== index,
                      );

                      form.setValue(`variants.${index}.images`, nextValue, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                )}
              />
              <div className="flex items-center justify-center gap-2 sm:col-span-2">
                <Button
                  pattern="outline"
                  content="Remove"
                  className="bg-electric-purple-c border-none"
                  buttonProps={{
                    type: 'button',
                    onClick: () => {
                      if (fields?.length === 1) {
                        form.setValue('productType', PRODUCT_TYPE_MAP.SIMPLE);
                      }
                      remove(index);
                    },
                  }}
                />
                <Button
                  pattern="outline"
                  content="Clear"
                  className="bg-primary-red border-none"
                  buttonProps={{
                    type: 'button',
                    onClick: () => {
                      form.setValue(`variants.${index}`, EMPTY_VARIANT);

                      form.clearErrors(`variants.${index}`);
                    },
                  }}
                />
                <Button
                  pattern="outline"
                  content="Add"
                  className="bg-primary-yellow border-none"
                  buttonProps={{
                    type: 'button',
                    onClick: () => {
                      const currentVariant = form.getValues(`variants.${index}`);
                      const {
                        images,
                        label,
                        originalPrice,
                        sellingPrice,
                        stock,
                        stockThreshold,
                        value,
                        type,
                      } = currentVariant || {};

                      if (!type) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please select a type to the variant',
                        });
                      }

                      if (!label) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please add a label to the variant',
                        });
                      }

                      if (!value) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please add a value to the variant',
                        });
                      }

                      if (Number.isNaN(originalPrice)) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please add an original price to the variant',
                        });
                      }
                      if (Number.isNaN(sellingPrice)) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please add an selling price to the variant',
                        });
                      }

                      if (
                        !Number.isNaN(originalPrice) &&
                        !Number.isNaN(originalPrice) &&
                        Number(originalPrice) < Number(sellingPrice)
                      ) {
                        return toaster.error({
                          title: 'Invalid',
                          description: 'Selling price must be greater than original price',
                        });
                      }

                      if (Number.isNaN(stock)) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please add a stock to the variant',
                        });
                      }

                      if (Number.isNaN(stockThreshold)) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please add a stock threshold to the variant',
                        });
                      }

                      if (!images?.length) {
                        return toaster.error({
                          title: 'Required',
                          description: 'Please add images to the variant',
                        });
                      }

                      append(EMPTY_VARIANT);
                    },
                  }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default VariantsFieldsTest;
