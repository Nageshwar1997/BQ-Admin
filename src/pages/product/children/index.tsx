import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
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
import { Controller, useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';

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
    register,
    formState: { errors },
  } = form;
    console.log("🚀 ~ MediaFields ~ errors:", errors)

  const images = useWatch({ control, name: 'images' });
  const videos = useWatch({ control, name: 'videos' });
  const thumbnail = useWatch({ control, name: 'thumbnail' });

  const normalizeMedia = (media?: FileList | string[]) => {
    if (!media) return [];

    return media instanceof FileList ? Array.from(media) : media;
  };

  const imagePreviews = normalizeMedia(images).map((image) => ({
    type: 'image' as const,
    url: image instanceof File ? URL.createObjectURL(image) : image,
  }));
  console.log('🚀 ~ MediaFields ~ imagePreviews:', imagePreviews);

  const thumbnailPreviews = normalizeMedia(thumbnail).map((image) => ({
    type: 'image' as const,
    url: image instanceof File ? URL.createObjectURL(image) : image,
  }));

  const videosPreviews = normalizeMedia(videos).map((image) => ({
    type: 'video' as const,
    url: image instanceof File ? URL.createObjectURL(image) : image,
  }));
  console.log('🚀 ~ MediaFields ~ thumbnailPreviews:', thumbnailPreviews);
  return (
    <div className="grid gap-4">
      <FileInput
        fileInputProps={{ name: 'thumbnail', placeholder: 'Thumbnail', multiple: false }}
        register={register('thumbnail')}
        previews={thumbnailPreviews}
        handleRemoveImage={()=> {}}
        />
      <FileInput
        fileInputProps={{ name: 'images', placeholder: 'Images', multiple: true }}
        register={register('images')}
        previews={imagePreviews}
        handleRemoveImage={()=> {}}
        />
      <FileInput
        fileInputProps={{
          name: 'videos',
          placeholder: 'Videos',
          multiple: false,
          accept: 'video/*',
        }}
        register={register('videos')}
        previews={videosPreviews}
        handleRemoveImage={()=> {}}
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
