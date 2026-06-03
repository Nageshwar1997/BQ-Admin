import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import ColorInput from '@/components/ui/inputs/colorInput';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import { EMPTY_ARRAY, VARIANT_TYPE, VARIANT_TYPE_MAP } from '@/constants/common.constants';
import type { TProductStockAndVariants } from '@/types/schema.type';
import { toaster } from '@/utils/common.util';
import { toErrorMessageArray } from '@/utils/form.util';
import { Controller, useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';

type Props = { form: UseFormReturn<TProductStockAndVariants> };

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

const AddProductVariantsForm = ({ form }: Props) => {
  const {
    clearErrors,
    control,
    formState: { errors },
    register,
    resetField,
    setValue,
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  const hasVariants = useWatch({ control, name: 'hasVariants' });

  const variants = useWatch({ control, name: 'variants' });

  return (
    <div className="grid gap-6">
      <Checkbox
        register={register('hasVariants')}
        error={errors.hasVariants?.message}
        content={
          <div className="grid">
            <p>Product has variants</p>
            {!fields.length && (
              <p className="text-rose-c text-[10px]">
                If variants are added, stock and threshold will be managed per variant.
              </p>
            )}
          </div>
        }
        checkboxProps={{
          name: 'hasVariants',
          disabled: !!fields.length,
          onChange: () => {
            if (!fields.length) {
              append(EMPTY_VARIANT);
            }
          },
        }}
        tooltip={{
          title: 'Variants exist',
          description: 'Remove all variants to disable.',
          required: !!fields.length,
          placement: 'right',
        }}
      />

      {hasVariants ? (
        fields.map((field, index) => {
          const currentVariant = variants?.[index];
          const error = 'variants' in errors ? errors.variants?.[index] : undefined;
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
                    error={error?.type?.message}
                  />
                )}
              />
              <Input
                label="Variant name"
                register={register(`variants.${index}.label`)}
                error={error?.label?.message}
                inputProps={{ placeholder: 'Black' }}
              />
              <Input
                label={
                  currentVariant?.type === VARIANT_TYPE_MAP.COLOR
                    ? 'Hex color code'
                    : 'Variant value'
                }
                register={register(`variants.${index}.value`)}
                error={error?.value?.message}
                inputProps={{
                  placeholder: currentVariant?.type === VARIANT_TYPE_MAP.COLOR ? '#000000' : '50ml',
                }}
              />
              <ColorInput
                value="#fff"
                onChange={(val) => {
                  console.log('COLOR VAL', val);
                }}
              />
              <Input
                label="Original Price"
                register={register(`variants.${index}.originalPrice`, { valueAsNumber: true })}
                error={error?.originalPrice?.message}
                inputProps={{ type: 'number', placeholder: '999' }}
              />
              <Input
                label="Discounted price"
                register={register(`variants.${index}.sellingPrice`, { valueAsNumber: true })}
                error={error?.sellingPrice?.message}
                inputProps={{ type: 'number', placeholder: '799' }}
              />
              <Input
                label="Stock"
                register={register(`variants.${index}.stock`, { valueAsNumber: true })}
                error={error?.stock?.message}
                inputProps={{ type: 'number', placeholder: '100' }}
              />
              <Input
                label="Stock threshold"
                register={register(`variants.${index}.stockThreshold`, {
                  valueAsNumber: true,
                })}
                error={error?.stockThreshold?.message}
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
                    errors={toErrorMessageArray<TProductStockAndVariants>(error?.thumbnail)}
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
                    errors={toErrorMessageArray<TProductStockAndVariants>(error?.images)}
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
        })
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stock"
            register={register('stock', { valueAsNumber: true })}
            error={'stock' in errors ? errors.stock?.message : undefined}
            inputProps={{ type: 'number', placeholder: '100' }}
          />
          <Input
            label="Stock threshold"
            register={register('stockThreshold', { valueAsNumber: true })}
            error={'stockThreshold' in errors ? errors.stockThreshold?.message : undefined}
            inputProps={{ type: 'number', placeholder: '100' }}
          />
        </div>
      )}
    </div>
  );
};

export default AddProductVariantsForm;
