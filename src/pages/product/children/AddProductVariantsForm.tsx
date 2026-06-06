import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import ColorInput from '@/components/ui/inputs/colorInput';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import { EMPTY_ARRAY, VARIANT_TYPE_MAP } from '@/constants/common.constants';
import { PRODUCT_VARIANT_INPUT_MAP_DATA } from '@/constants/input.constants';
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
              {PRODUCT_VARIANT_INPUT_MAP_DATA.map((input) => {
                const { name, type } = input;
                return type === 'radio' ? (
                  <Controller
                    name={`variants.${index}.${name}`}
                    control={form.control}
                    defaultValue={input.defaultValue}
                    render={({ field: { onChange, value } }) => {
                      const { defaultValue, options } = input;
                      return (
                        <Radio
                          value={value ?? defaultValue}
                          onChange={(val) => {
                            onChange(val);
                            form.resetField(`variants.${index}.${name}`);
                          }}
                          options={options}
                          containerClassName="sm:col-span-2 max-w-xs w-full mx-auto mb-2"
                          error={error?.[name]?.message}
                        />
                      );
                    }}
                  />
                ) : type === 'color' ? (
                  <Controller
                    name={`variants.${index}.${name}`}
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <ColorInput
                        label="Variant color"
                        value={value}
                        onChange={onChange}
                        placeholder={input.placeholder}
                        error={error?.[name]?.message}
                      />
                    )}
                  />
                ) : type === 'file' ? (
                  <Controller
                    control={form.control}
                    name={`variants.${index}.${input.name}`}
                    render={({ field: { onChange, value } }) => {
                      const { label, placeholder1, placeholder2 } = input;

                      const currVal = currentVariant?.[name];
                      const hasValue = Array.isArray(currVal) ? currVal.length > 0 : !!currVal;
                      const placeholder = hasValue ? placeholder2 : placeholder1;
                      return (
                        <FileInput
                          label={label}
                          fileInputProps={{
                            name,
                            placeholder,
                            value,
                            onChange: ({ target: { files } }) => {
                              if (!files?.length) return;

                              const newFiles = Array.from(files);

                              if (name === 'thumbnail') {
                                onChange(newFiles?.[0]);
                              } else if (name === 'images') {
                                const oldFiles = field?.[name] || EMPTY_ARRAY;
                                onChange([...oldFiles, ...newFiles]);
                              }
                            },
                          }}
                          errors={toErrorMessageArray<TProductStockAndVariants>(error?.[name])}
                          handleRemove={() => resetField(`variants.${index}.${name}`)}
                        />
                      );
                    }}
                  />
                ) : (
                  <Input
                    label={input.label}
                    register={register(`variants.${index}.${input.name}`)}
                    error={error?.[input.name]?.message}
                    inputProps={{ placeholder: input.placeholder, type: input.type }}
                  />
                );
              })}

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
