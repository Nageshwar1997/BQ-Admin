import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { EMPTY_ARRAY, FILE_MIME, PRODUCT_TYPE } from '@/constants/common.constants';
import { PRODUCT_BASIC_INFO_INPUT_MAP_DATA } from '@/constants/input.constants';
import type { ICategory } from '@/types/api.type';
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

export const BasicInfoFields = ({
  form,
  l1Cats,
  l2Cats,
  l3Cats,
}: {
  form: UseFormReturn<TProductBasicInfo>;
  l1Cats: ICategory[];
  l2Cats: ICategory[];
  l3Cats: ICategory[];
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const l1Category = useWatch({ control, name: 'l1Category' });
  const l2Category = useWatch({ control, name: 'l2Category' });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PRODUCT_BASIC_INFO_INPUT_MAP_DATA.map((input) => (
        <Input
          key={input.name}
          label={input.label}
          register={register(input.name, {
            ...(input.type === 'number' && { valueAsNumber: true }),
          })}
          error={errors[input.name]?.message}
          inputProps={{ type: input.type, placeholder: input.placeholder }}
        />
      ))}
      <Controller
        name="l1Category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Main category"
            error={errors.l1Category?.message}
            options={l1Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
            optionsPosition="top"
            selectProps={{
              value,
              placeholder: 'Select (L1) main category',
              onChange: (value) => {
                onChange(value);

                form.setValue('l2Category', '');
                form.setValue('l3Category', '');
              },
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
            options={l2Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
            optionsPosition="top"
            selectProps={{
              value,
              disabled: !l1Category,
              placeholder: 'Select (L2) sub-category',
              onChange: (value) => {
                onChange(value);

                form.setValue('l3Category', '');
              },
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
            options={l3Cats.map((cat) => ({
              label: cat.name,
              value: cat._id,
            }))}
            optionsPosition="top"
            selectProps={{
              value,
              disabled: !l2Category,
              placeholder: 'Select (L3) product category',
              onChange,
            }}
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
            optionsPosition="top"
            options={PRODUCT_TYPE.map((value) => ({ label: value, value }))}
            selectProps={{ value, placeholder: 'Select product type', onChange }}
          />
        )}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                    STEP 2 : CATEGORY & INVENTORY                           */
/* -------------------------------------------------------------------------- */

export const CategoryInventoryFields = ({
  form,
  l1Cats,
  l2Cats,
  l3Cats,
}: {
  form: UseFormReturn<TProductCategoryInventory>;
  l1Cats: ICategory[];
  l2Cats: ICategory[];
  l3Cats: ICategory[];
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const l1Category = useWatch({ control, name: 'l1Category' });
  const l2Category = useWatch({ control, name: 'l2Category' });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        name="l1Category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Main category"
            error={errors.l1Category?.message}
            options={l1Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
            selectProps={{
              value,
              placeholder: 'Select (L1) main category',
              onChange: (value) => {
                onChange(value);

                form.setValue('l2Category', '');
                form.setValue('l3Category', '');
              },
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
            options={l2Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
            selectProps={{
              value,
              disabled: !l1Category,
              placeholder: 'Select (L2) sub-category',
              onChange: (value) => {
                onChange(value);

                form.setValue('l3Category', '');
              },
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
            options={l3Cats.map((cat) => ({
              label: cat.name,
              value: cat._id,
            }))}
            selectProps={{
              value,
              disabled: !l2Category,
              placeholder: 'Select (L3) product category',
              onChange,
            }}
          />
        )}
      />

      {/* <Input
        label="Stock"
        register={register('stock', {
          valueAsNumber: true,
        })}
        error={errors.stock?.message}
        inputProps={{
          type: 'number',
          placeholder: '100',
        }}
      /> */}

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

  const images = useWatch({ control, name: 'images' });
  const thumbnail = useWatch({ control, name: 'thumbnail' });
  const video = useWatch({ control, name: 'video' });

  return (
    <div className="grid gap-4">
      <Controller
        control={control}
        name="thumbnail"
        render={({ field: { name, onChange, value } }) => (
          <FileInput
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
            fileInputProps={{
              name,
              placeholder: images.length ? 'Change images' : 'Select images',
              multiple: true,
              disabled: images.length >= 10,
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
              label="Original Price"
              register={register(`variants.${index}.originalPrice`, {
                valueAsNumber: true,
              })}
              error={errors.variants?.[index]?.originalPrice?.message}
              inputProps={{
                type: 'number',
                placeholder: '999',
              }}
            />

            <Input
              label="Discounted price"
              register={register(`variants.${index}.sellingPrice`, {
                valueAsNumber: true,
              })}
              error={errors.variants?.[index]?.sellingPrice?.message}
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
              originalPrice: 0,
              sellingPrice: 0,
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
