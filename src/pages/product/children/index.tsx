import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { FILE_MIME } from '@/constants/common.constants';
import type {
  TConfirmDetails,
  TProductBasicInfo,
  TProductCategoryInventory,
  TProductDescription,
  TProductMedia,
  TProductSeo,
  TProductTryOn,
  TProductVariants,
} from '@/types/schema.type';
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

/* -------------------------------------------------------------------------- */
/*                          STEP 1 : BASIC INFO                               */
/* -------------------------------------------------------------------------- */

export const BasicInfoFields = ({ form }: { form: UseFormReturn<TProductBasicInfo> }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Title"
        register={register('title')}
        error={errors.title?.message}
        inputProps={{
          placeholder: 'Product title',
        }}
      />

      <Input
        label="Brand"
        register={register('brand')}
        error={errors.brand?.message}
        inputProps={{
          placeholder: 'Brand name',
        }}
      />

      <Input
        label="Price"
        register={register('price', {
          valueAsNumber: true,
        })}
        error={errors.price?.message}
        inputProps={{
          type: 'number',
          placeholder: '999',
        }}
      />

      <Input
        label="Discounted price"
        register={register('discountedPrice', {
          valueAsNumber: true,
        })}
        error={errors.discountedPrice?.message}
        inputProps={{
          type: 'number',
          placeholder: '799',
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                    STEP 2 : CATEGORY & INVENTORY                           */
/* -------------------------------------------------------------------------- */

export const CategoryInventoryFields = ({
  form,
}: {
  form: UseFormReturn<TProductCategoryInventory>;
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        name="l1Category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Main category"
            error={errors.l1Category?.message}
            options={[]}
            selectProps={{
              value,
              onChange,
              placeholder: 'Select (L1) main category',
            }}
          />
        )}
      />

      <Controller
        name="l2Category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Sub-category"
            error={errors.l2Category?.message}
            options={[]}
            selectProps={{
              value,
              onChange,
              placeholder: 'Select (L2) sub-category',
            }}
          />
        )}
      />

      <Controller
        name="l3Category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Product category"
            error={errors.l3Category?.message}
            options={[]}
            selectProps={{
              value,
              onChange,
              placeholder: 'Select (L3) product category',
            }}
          />
        )}
      />

      <Input
        label="Stock"
        register={register('stock', {
          valueAsNumber: true,
        })}
        error={errors.stock?.message}
        inputProps={{
          type: 'number',
          placeholder: '100',
        }}
      />

      {/* <Input
        label="Low stock threshold"
        register={register('lowStockThreshold', {
          valueAsNumber: true,
        })}
        error={errors.lowStockThreshold?.message}
        inputProps={{
          type: 'number',
          placeholder: '10',
        }}
      /> */}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                       STEP 3 : MEDIA & GALLERY                             */
/* -------------------------------------------------------------------------- */

export const MediaFields = ({ form }: { form: UseFormReturn<TProductMedia> }) => {
  const {
    control,
    formState: { errors },
    resetField,
    setValue,
  } = form;
  console.log('🚀 ~ MediaFields ~ errors:', errors);

  const images = useWatch({ control, name: 'images' });

  return (
    <div className="grid gap-4">
      <Controller
        control={control}
        name="thumbnail"
        render={({ field: { name, onChange, value } }) => (
          <FileInput
            fileInputProps={{
              name,
              placeholder: 'Thumbnail',
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
            fileInputProps={{
              name,
              placeholder: 'Images',
              multiple: true,
              onChange: (event) => {
                const files = Array.from(event.target.files || []);
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
            fileInputProps={{
              name,
              placeholder: 'Videos',
              accept: FILE_MIME.video.join(','),
              onChange: ({ target: { files } }) => onChange(files?.[0]),
              value,
            }}
            errors={getErrorMessages(errors.video)}
            handleRemove={() => resetField('video', { defaultValue: undefined })}
          />
        )}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                  STEP 4 : DESCRIPTION & DETAILS                            */
/* -------------------------------------------------------------------------- */

export const DescriptionFields = ({ form }: { form: UseFormReturn<TProductDescription> }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4">
      <Input
        label="Short description"
        register={register('shortDescription')}
        error={errors.shortDescription?.message}
        inputProps={{
          placeholder: 'Short description',
        }}
      />

      <Input
        label="Description"
        register={register('description')}
        error={errors.description?.message}
        inputProps={{
          placeholder: 'Full description',
        }}
      />

      <Input
        label="Usage instructions"
        register={register('usageInstructions')}
        error={errors.usageInstructions?.message}
        inputProps={{
          placeholder: 'Usage instructions',
        }}
      />

      <Input
        label="Ingredients"
        register={register('ingredients')}
        error={errors.ingredients?.message}
        inputProps={{
          placeholder: 'Ingredients',
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                STEP 5 : VARIANTS & SPECIFICATIONS                          */
/* -------------------------------------------------------------------------- */

export const VariantsFields = ({ form }: { form: UseFormReturn<TProductVariants> }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field, index) => {
        const type = watch(`variants.${index}.type`);

        return (
          <div
            key={field.id}
            className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
          >
            <Controller
              name={`variants.${index}.type`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Variant type"
                  error={errors.variants?.[index]?.type?.message}
                  options={[
                    {
                      label: 'Color',
                      value: 'color',
                    },
                    {
                      label: 'Text',
                      value: 'text',
                    },
                  ]}
                  selectProps={{
                    value,
                    onChange,
                    placeholder: 'Select variant type',
                  }}
                />
              )}
            />

            {type === 'color' && (
              <Input
                label="Color label"
                register={register(`variants.${index}.label`)}
                error={
                  'label' in (errors.variants?.[index] || {})
                    ? errors.variants?.[index]?.label?.message
                    : undefined
                }
                inputProps={{
                  placeholder: 'Black',
                }}
              />
            )}

            <Input
              label={type === 'color' ? 'Hex code' : 'Variant value'}
              register={register(`variants.${index}.value`)}
              error={errors.variants?.[index]?.value?.message}
              inputProps={{
                placeholder: type === 'color' ? '#000000' : '50ml',
              }}
            />

            <Input
              label="Price"
              register={register(`variants.${index}.price`, {
                valueAsNumber: true,
              })}
              error={errors.variants?.[index]?.price?.message}
              inputProps={{
                type: 'number',
                placeholder: '999',
              }}
            />

            <Input
              label="Discounted price"
              register={register(`variants.${index}.discountedPrice`, {
                valueAsNumber: true,
              })}
              error={errors.variants?.[index]?.discountedPrice?.message}
              inputProps={{
                type: 'number',
                placeholder: '799',
              }}
            />

            <Input
              label="Stock"
              register={register(`variants.${index}.stock`, {
                valueAsNumber: true,
              })}
              error={errors.variants?.[index]?.stock?.message}
              inputProps={{
                type: 'number',
                placeholder: '100',
              }}
            />

            <div className="flex justify-end sm:col-span-2">
              <Button
                pattern="secondary"
                content="Remove variant"
                buttonProps={{
                  type: 'button',
                  disabled: fields.length === 1,
                  onClick: () => remove(index),
                }}
              />
            </div>
          </div>
        );
      })}

      <Button
        pattern="primary"
        content="Add variant"
        buttonProps={{
          type: 'button',
          onClick: () =>
            append({
              type: 'text',
              label: '',
              value: '',
              price: 0,
              discountedPrice: 0,
              stock: 0,
              images: [],
            }),
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                    STEP 6 : TRYON CONFIGURATION                            */
/* -------------------------------------------------------------------------- */

export const TryOnFields = ({ form }: { form: UseFormReturn<TProductTryOn> }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const enableTryOn = watch('enableTryOn');

  return (
    <div className="grid gap-4">
      <Checkbox
        register={register('enableTryOn')}
        error={errors.enableTryOn?.message}
        content="Enable TryOn"
        checkboxProps={{
          name: 'enableTryOn',
        }}
      />

      {enableTryOn && (
        <>
          <Input
            label="TryOn model"
            register={register('model')}
            error={errors.model?.message}
            inputProps={{
              placeholder: 'Model URL',
            }}
          />

          <Input
            label="TryOn assets"
            register={register('assets.0')}
            error={errors.assets?.message}
            inputProps={{
              placeholder: 'Asset URL',
            }}
          />
        </>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                     STEP 7 : SEO & VISIBILITY                              */
/* -------------------------------------------------------------------------- */

export const SeoFields = ({ form }: { form: UseFormReturn<TProductSeo> }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4">
      <Input
        label="SEO title"
        register={register('seoTitle')}
        error={errors.seoTitle?.message}
        inputProps={{
          placeholder: 'SEO title',
        }}
      />

      <Input
        label="SEO description"
        register={register('seoDescription')}
        error={errors.seoDescription?.message}
        inputProps={{
          placeholder: 'SEO description',
        }}
      />

      <Input
        label="SEO keyword"
        register={register('seoKeywords.0')}
        error={errors.seoKeywords?.message}
        inputProps={{
          placeholder: 'Keyword',
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                   STEP 8 : CONFIRM BEFORE SAVE                             */
/* -------------------------------------------------------------------------- */

export const ConfirmFields = ({
  form,
}: {
  form: UseFormReturn<TConfirmDetails>;
  values: {
    basicInfo: TProductBasicInfo;
    categoryInventory: TProductCategoryInventory;
    media: TProductMedia;
    description: TProductDescription;
    variants: TProductVariants;
    tryOn: TProductTryOn;
    seo: TProductSeo;
  };
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Checkbox
      register={register('confirm')}
      error={errors.confirm?.message}
      content="I confirm the product details are correct"
      checkboxProps={{
        name: 'confirm',
      }}
    />
  );
};
