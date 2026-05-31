import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
import QuillInput from '@/components/ui/inputs/quillInput';
import Select from '@/components/ui/inputs/Select';
import { PRODUCT_BASIC_INFO_INPUT_MAP_DATA } from '@/constants/input.constants';
import type { ICategory } from '@/types/api.type';
import type {
  TConfirmDetails,
  TProductBasicInfo,
  TProductDescription,
  TProductMedia,
  TProductSeo,
  TProductTryOn,
  TProductVariants,
} from '@/types/schema.type';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';
import { TestMediaFields } from './MediaFields';
import VariantsFieldsTest from './VariantsFields';

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
      <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
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
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                    STEP 2 : CATEGORY & INVENTORY                           */
/* -------------------------------------------------------------------------- */

// export const CategoryInventoryFields = ({
//   form,
//   l1Cats,
//   l2Cats,
//   l3Cats,
// }: {
//   form: UseFormReturn<TProductCategoryInventory>;
//   l1Cats: ICategory[];
//   l2Cats: ICategory[];
//   l3Cats: ICategory[];
// }) => {
//   const {
//     register,
//     control,
//     formState: { errors },
//   } = form;

//   const l1Category = useWatch({ control, name: 'l1Category' });
//   const l2Category = useWatch({ control, name: 'l2Category' });

//   return (
//     <div className="grid gap-4 sm:grid-cols-2">
//       <Controller
//         name="l1Category"
//         control={control}
//         render={({ field: { onChange, value } }) => (
//           <Select
//             label="Main category"
//             error={errors.l1Category?.message}
//             options={l1Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
//             selectProps={{
//               value,
//               placeholder: 'Select (L1) main category',
//               onChange: (value) => {
//                 onChange(value);

//                 form.setValue('l2Category', '');
//                 form.setValue('l3Category', '');
//               },
//             }}
//           />
//         )}
//       />

//       <Controller
//         name="l2Category"
//         control={control}
//         render={({ field: { onChange, value } }) => (
//           <Select
//             label="Sub-category"
//             error={errors.l2Category?.message}
//             options={l2Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
//             selectProps={{
//               value,
//               disabled: !l1Category,
//               placeholder: 'Select (L2) sub-category',
//               onChange: (value) => {
//                 onChange(value);

//                 form.setValue('l3Category', '');
//               },
//             }}
//           />
//         )}
//       />

//       <Controller
//         name="l3Category"
//         control={control}
//         render={({ field: { onChange, value } }) => (
//           <Select
//             label="Product category"
//             error={errors.l3Category?.message}
//             options={l3Cats.map((cat) => ({
//               label: cat.name,
//               value: cat._id,
//             }))}
//             selectProps={{
//               value,
//               disabled: !l2Category,
//               placeholder: 'Select (L3) product category',
//               onChange,
//             }}
//           />
//         )}
//       />

//       {/* <Input
//         label="Stock"
//         register={register('stock', {
//           valueAsNumber: true,
//         })}
//         error={errors.stock?.message}
//         inputProps={{
//           type: 'number',
//           placeholder: '100',
//         }}
//       /> */}

//       {/* <Input
//         label="Low stock threshold"
//         register={register('lowStockThreshold', {
//           valueAsNumber: true,
//         })}
//         error={errors.lowStockThreshold?.message}
//         inputProps={{
//           type: 'number',
//           placeholder: '10',
//         }}
//       /> */}
//     </div>
//   );
// };

/* -------------------------------------------------------------------------- */
/*                       STEP 3 : MEDIA & GALLERY                             */
/* -------------------------------------------------------------------------- */

export const MediaFields = ({ form }: { form: UseFormReturn<TProductMedia> }) => {
  return <TestMediaFields form={form} />;
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
      <QuillInput />
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
  return <VariantsFieldsTest form={form} />;
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
    // categoryInventory: TProductCategoryInventory;
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
