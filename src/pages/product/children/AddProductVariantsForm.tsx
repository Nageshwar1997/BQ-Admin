import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import { EMPTY_ARRAY, VARIANT_TYPE, VARIANT_TYPE_MAP } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { productVariantsSchema } from '@/schemas/product.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TBaseProduct, TProductVariants } from '@/types/schema.type';
import { toaster } from '@/utils/common.util';
import { toErrorMessageArray } from '@/utils/form.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';

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

const AddProductVariantsForm = ({
  onNext,
  step,
}: {
  onNext: (key: keyof TBaseProduct, value: TBaseProduct[keyof TBaseProduct]) => void;
  step: TAddProductStepNumber;
}) => {
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    register,
    resetField,
    setValue,
  } = useForm<TProductVariants>({ resolver: zodResolver(productVariantsSchema) });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  const hasVariants = useWatch({ control, name: 'hasVariants', defaultValue: true });

  const variants = useWatch({ control, name: 'variants' });

  const onSubmit = (data: TProductVariants) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    onNext('variants', data);
  };

  return (
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[step]}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Checkbox
          error={errors.hasVariants?.message}
          content="This product is available in multiple variants"
          checkboxProps={{
            name: 'confirm',
            checked: hasVariants,
            onChange: () => {
              if (fields.length) {
                return toaster.warning({
                  title: 'Please remove the variants first',
                  description: 'You cannot toggle this.',
                });
              }

              setValue('hasVariants', !hasVariants);
            },
          }}
        />
        {hasVariants && !fields?.length && (
          <Button
            pattern="tertiary"
            content="Add Variant"
            className="h-10 w-auto!"
            leftIcon={{ icon: 'solar:add-circle-linear' }}
            buttonProps={{ onClick: () => append(EMPTY_VARIANT) }}
          />
        )}
      </div>
      {hasVariants &&
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
                    errors={toErrorMessageArray<TProductVariants>(
                      errors.variants?.[index]?.thumbnail,
                    )}
                    handleRemove={() => resetField(`variants.${index}.thumbnail`)}
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
                    errors={toErrorMessageArray<TProductVariants>(errors.variants?.[index]?.images)}
                    handleRemove={(index) => {
                      const oldImages = field?.images || EMPTY_ARRAY;

                      const nextValue = oldImages.filter(
                        (_, currentIndex) => currentIndex !== index,
                      );

                      setValue(`variants.${index}.images`, nextValue, {
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
                        setValue('hasVariants', false);
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
                      setValue(`variants.${index}`, EMPTY_VARIANT);
                      clearErrors(`variants.${index}`);
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
                      const currentVariant = variants?.[index];
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
    </form>
  );
};

export default AddProductVariantsForm;
