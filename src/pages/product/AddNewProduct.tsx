import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import { ADD_PRODUCT_STEPS, CATEGORY_LEVELS_MAP, EMPTY_ARRAY } from '@/constants/common.constants';
import {
  productBasicInfoSchema,
  productDescriptionSchema,
  productMediaSchema,
  productSeoSchema,
  productTryOnSchema,
  productVariantsSchema,
} from '@/schemas/product.schema';
import { confirmDetailsSchema } from '@/schemas/shared.schema';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type {
  TConfirmDetails,
  TProductBasicInfo,
  TProductDescription,
  TProductMedia,
  TProductSeo,
  TProductTryOn,
  TProductVariants,
} from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  BasicInfoFields,
  ConfirmFields,
  DescriptionFields,
  MediaFields,
  SeoFields,
  TryOnFields,
  VariantsFields,
} from './children';

const FORM_IDS = [
  'product-basic-info-form',
  // 'product-category-inventory-form',
  'product-media-form',
  'product-description-form',
  'product-variants-form',
  'product-tryon-form',
  'product-seo-form',
  'product-confirm-form',
] as const;

const AddNewProduct = () => {
  const [activeStep, setActiveStep] = useState(1);

  const basicInfoForm = useForm<TProductBasicInfo>({
    resolver: zodResolver(productBasicInfoSchema),
  });

  // const categoryInventoryForm = useForm<TProductCategoryInventory>({
  //   resolver: zodResolver(productCategoryInventorySchema),
  // });

  const mediaForm = useForm<TProductMedia>({
    resolver: zodResolver(productMediaSchema),
  });

  const descriptionForm = useForm<TProductDescription>({
    resolver: zodResolver(productDescriptionSchema),
  });

  const variantsForm = useForm<TProductVariants>({
    resolver: zodResolver(productVariantsSchema),
  });

  const tryOnForm = useForm<TProductTryOn>({
    resolver: zodResolver(productTryOnSchema),
  });

  const seoFOrm = useForm<TProductSeo>({
    resolver: zodResolver(productSeoSchema),
  });

  const confirmForm = useForm<TConfirmDetails>({
    resolver: zodResolver(confirmDetailsSchema),
  });

  const l1Cat = useWatch({ control: basicInfoForm.control, name: 'l1Category' });
  const l2Cat = useWatch({ control: basicInfoForm.control, name: 'l2Category' });

  const { data: l1Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L1,
  });

  const { data: l2Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: l1Cat,
    enabled: !!l1Cat,
  });

  const { data: l3Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: l2Cat,
    enabled: !!l2Cat,
  });

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, ADD_PRODUCT_STEPS.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = async () => {
    const payload = {
      basicInfo: basicInfoForm.getValues(),
      // categoryInventory: categoryInventoryForm.getValues(),
      media: mediaForm.getValues(),
      description: descriptionForm.getValues(),
      variants: variantsForm.getValues(),
      tryOn: tryOnForm.getValues(),
      seo: seoFOrm.getValues(),
    };

    console.log(payload);
  };

  const stepFields = [
    {
      title: 'Basic information',
      description: 'Product title, brand and pricing',
      content: (
        <form onSubmit={basicInfoForm.handleSubmit(handleNext)} id={FORM_IDS[activeStep]}>
          <BasicInfoFields form={basicInfoForm} l1Cats={l1Cats} l2Cats={l2Cats} l3Cats={l3Cats} />
        </form>
      ),
    },

    // {
    //   title: 'Category and inventory',
    //   description: 'Category and stock details',
    //   content: (
    //     <form onSubmit={categoryInventoryForm.handleSubmit(handleNext)} id={FORM_IDS[activeStep]}>
    //       <CategoryInventoryFields
    //         form={categoryInventoryForm}
    //         l1Cats={l1Cats}
    //         l2Cats={l2Cats}
    //         l3Cats={l3Cats}
    //       />
    //     </form>
    //   ),
    // },

    {
      title: 'Media and gallery',
      description: 'Upload product media',
      content: (
        <form onSubmit={mediaForm.handleSubmit(handleNext)} id={FORM_IDS[activeStep]}>
          <MediaFields form={mediaForm} />
        </form>
      ),
    },

    {
      title: 'Description and details',
      description: 'Product descriptions and usage',
      content: (
        <form onSubmit={descriptionForm.handleSubmit(handleNext)} id={FORM_IDS[activeStep]}>
          <DescriptionFields form={descriptionForm} />
        </form>
      ),
    },
    {
      title: 'Variants and specifications',
      description: 'Product variants and specs',
      content: (
        <form onSubmit={variantsForm.handleSubmit(handleNext)} id={FORM_IDS[activeStep]}>
          <VariantsFields form={variantsForm} />
        </form>
      ),
    },

    {
      title: 'TryOn configuration',
      description: 'Configure TryOn assets',
      content: (
        <form onSubmit={tryOnForm.handleSubmit(handleNext)} id={FORM_IDS[activeStep]}>
          <TryOnFields form={tryOnForm} />
        </form>
      ),
    },

    {
      title: 'SEO and visibility',
      description: 'SEO related settings',
      content: (
        <form onSubmit={seoFOrm.handleSubmit(handleNext)} id={FORM_IDS[activeStep]}>
          <SeoFields form={seoFOrm} />
        </form>
      ),
    },

    {
      title: 'Confirm before save',
      description: 'Review all details',
      content: (
        <form onSubmit={confirmForm.handleSubmit(handleSaveDraft)} id={FORM_IDS[activeStep]}>
          <ConfirmFields
            form={confirmForm}
            values={{
              basicInfo: basicInfoForm.getValues(),
              // categoryInventory: categoryInventoryForm.getValues(),
              media: mediaForm.getValues(),
              description: descriptionForm.getValues(),
              variants: variantsForm.getValues(),
              tryOn: tryOnForm.getValues(),
              seo: seoFOrm.getValues(),
            }}
          />
        </form>
      ),
    },
  ];

  return (
    <div className="">
      <Navbar buttons={[{ content: 'Save Draft', leftIcon: { icon: 'solar:diskette-linear' } }]} />
      <Stepper
        steps={ADD_PRODUCT_STEPS}
        activeStep={activeStep}
        onStepClick={(step) => setActiveStep(step)}
        className="mt-4 p-4!"
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-primary text-sm font-semibold">{stepFields[activeStep].title}</p>

            <p className="text-secondary text-xs">{stepFields[activeStep].description}</p>
          </div>

          {stepFields[activeStep].content}

          <div className="flex justify-between gap-3">
            <Button
              pattern="secondary"
              content={activeStep === 0 ? 'Save draft' : 'Back'}
              buttonProps={{ onClick: activeStep === 0 ? handleSaveDraft : handleBack }}
            />

            <Button
              pattern="primary"
              content={activeStep === ADD_PRODUCT_STEPS.length - 1 ? 'Save' : 'Next'}
              buttonProps={{ type: 'submit', form: FORM_IDS[activeStep] }}
            />
          </div>
        </div>
      </Stepper>
    </div>
  );
};

export default AddNewProduct;
