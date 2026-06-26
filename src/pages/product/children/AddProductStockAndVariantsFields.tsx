import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import ColorInput from '@/components/ui/inputs/colorInput';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import { PRODUCT_VARIANT_ACTIONS, VARIANT_TYPE_MAP } from '@/constants/common.constants';
import { PRODUCT_VARIANT_INPUT_MAP_DATA, STOCKS_INPUT_MAP_DATA } from '@/constants/input.constants';
import type {
  TProductBasicInfo,
  TProductStockAndVariants,
  TProductWithoutVariant,
  TProductWithVariant,
} from '@/types/schema.type';
import { toaster } from '@/utils/common.util';
import { toErrorMessageArray } from '@/utils/form.util';
import {
  Controller,
  useFieldArray,
  useWatch,
  type FieldErrors,
  type UseFormReturn,
} from 'react-hook-form';

type Props = {
  form: UseFormReturn<TProductStockAndVariants>;
  defaultPrices: Pick<TProductBasicInfo, 'originalPrice' | 'sellingPrice'>;
};

const AddProductStockAndVariantsFields = ({ form, defaultPrices }: Props) => {
  const EMPTY_VARIANT: TProductWithVariant['variants'][number] = {
    type: VARIANT_TYPE_MAP.COLOR,
    label: '',
    value: '',
    originalPrice: defaultPrices.originalPrice ?? NaN,
    sellingPrice: defaultPrices.sellingPrice ?? NaN,
    stock: NaN,
    stockThreshold: NaN,
    thumbnail: undefined,
    images: [],
  };

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'variants' });

  const hasVariants = useWatch({ control: form.control, name: 'hasVariants' });

  const variants = useWatch({ control: form.control, name: 'variants' });

  return (
    <div className="grid gap-6">
      <Checkbox
        register={form.register('hasVariants')}
        error={form.formState.errors.hasVariants?.message}
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
          const error =
            'variants' in form.formState.errors
              ? form.formState.errors.variants?.[index]
              : undefined;
          return (
            <div
              key={field.id}
              className="border-smoke-eerie-invert/20 bg-smoke-eerie/50 grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
            >
              {PRODUCT_VARIANT_INPUT_MAP_DATA.map((input) => {
                const { name, type } = input;

                const isColorVariant = currentVariant?.type === VARIANT_TYPE_MAP.COLOR;

                if (name === 'value') {
                  if (type === 'color' && !isColorVariant) return null;
                  if (type === 'text' && isColorVariant) return null;
                }

                return type === 'radio' ? (
                  <Controller
                    key={`${name}-${type}`}
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
                            form.resetField(`variants.${index}.value`);
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
                    key={`${name}-${type}`}
                    name={`variants.${index}.${name}`}
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <ColorInput
                        label={input.label}
                        value={value}
                        onChange={onChange}
                        placeholder={input.placeholder}
                        error={error?.[name]?.message}
                      />
                    )}
                  />
                ) : type === 'file' ? (
                  <Controller
                    key={`${name}-${type}`}
                    control={form.control}
                    name={`variants.${index}.${name}`}
                    render={({ field }) => {
                      const { label, placeholder1, placeholder2 } = input;

                      const value = currentVariant?.[name];
                      const hasValue = Array.isArray(value) ? value.length > 0 : !!value;

                      const placeholder = hasValue ? placeholder2 : placeholder1;

                      const isImages = name === 'images';

                      return (
                        <FileInput
                          label={label}
                          fileInputProps={{
                            name,
                            placeholder,
                            value,
                            multiple: isImages,
                            onChange: ({ target: { files } }) => {
                              if (!files?.length) return;
                              const newValue = isImages
                                ? [...(currentVariant?.images || []), ...(Array.from(files) || [])]
                                : files[0];

                              field.onChange(newValue);
                            },
                          }}
                          errors={toErrorMessageArray<TProductStockAndVariants>(error?.[name])}
                          handleRemove={(imgIdx) => {
                            const oldImages = currentVariant?.images;

                            const nextValue = isImages
                              ? oldImages?.filter((_, currentIndex) => currentIndex !== imgIdx)
                              : undefined;

                            form.setValue(`variants.${index}.${name}`, nextValue, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                      );
                    }}
                  />
                ) : (
                  <Input
                    key={`${name}-${type}`}
                    label={input.label}
                    register={form.register(
                      `variants.${index}.${name}`,
                      input.type === 'number' ? { valueAsNumber: true } : {},
                    )}
                    error={error?.[name]?.message}
                    inputProps={{ placeholder: input.placeholder, type: input.type }}
                  />
                );
              })}
              <div className="flex items-center justify-center gap-2 sm:col-span-2">
                {PRODUCT_VARIANT_ACTIONS.map((action) => (
                  <Button
                    key={action.content}
                    pattern="outline"
                    content={action.content}
                    className={`border-none ${action.className}`}
                    buttonProps={{
                      type: 'button',
                      onClick: () => {
                        if (action.content === 'Remove') {
                          if (fields?.length === 1) {
                            form.setValue('hasVariants', false);
                          }
                          remove(index);
                        } else if (action.content === 'Clear') {
                          form.setValue(`variants.${index}`, EMPTY_VARIANT);
                          form.clearErrors(`variants.${index}`);
                        } else if (action.content === 'Add') {
                          const isInvalid =
                            !currentVariant.type ||
                            !currentVariant.label ||
                            !currentVariant.value ||
                            Number.isNaN(currentVariant.originalPrice) ||
                            Number.isNaN(currentVariant.sellingPrice) ||
                            Number.isNaN(currentVariant.stock) ||
                            Number.isNaN(currentVariant.stockThreshold) ||
                            !currentVariant.images?.length;

                          if (isInvalid) {
                            return toaster.warning({
                              title: 'Required',
                              description: 'Please fill all required fields.',
                            });
                          }
                        }
                      },
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {STOCKS_INPUT_MAP_DATA.map((input) => (
            <Input
              key={input.name}
              label={input.label}
              register={form.register(input.name, { valueAsNumber: true })}
              error={
                (form.formState.errors as FieldErrors<TProductWithoutVariant>)[input.name]?.message
              }
              inputProps={{ type: input.type, placeholder: input.placeholder }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddProductStockAndVariantsFields;
