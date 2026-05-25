import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import { ADD_PRODUCT_STEPS } from '@/constants/common.constants';
import {
  productBasicInfoSchema,
  productCategoryInventorySchema,
  productDescriptionSchema,
  productMediaSchema,
  productSeoSchema,
  productTryOnSchema,
  productVariantsSchema,
} from '@/schemas/product.schema';
import { confirmDetailsSchema } from '@/schemas/shared.schema';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  BasicInfoFields,
  CategoryInventoryFields,
  ConfirmFields,
  DescriptionFields,
  MediaFields,
  SeoFields,
  TryOnFields,
  VariantsFields,
} from './children';

const AddNewProduct = () => {
  const [activeStep, setActiveStep] = useState(0);

  const form1 = useForm<TProductBasicInfo>({
    resolver: zodResolver(productBasicInfoSchema),
    defaultValues: {
      title: '',
      brand: '',
      discountedPrice: 0,
      price: 0,
    },
  });

  const form2 = useForm<TProductCategoryInventory>({
    resolver: zodResolver(productCategoryInventorySchema),
    defaultValues: {
      stock: 0,
      l1Category: '',
      l2Category: '',
      l3Category: '',
    },
  });

  const form3 = useForm<TProductMedia>({
    resolver: zodResolver(productMediaSchema),
    defaultValues: {
      images: [],
      thumbnail: '',
      videos: [],
    },
  });

  const form4 = useForm<TProductDescription>({
    resolver: zodResolver(productDescriptionSchema),
    defaultValues: {
      description: '',
      ingredients: '',
      shortDescription: '',
      usageInstructions: '',
    },
  });

  const form5 = useForm<TProductVariants>({
    resolver: zodResolver(productVariantsSchema),
    defaultValues: {
      variants: [],
    },
  });

  const form6 = useForm<TProductTryOn>({
    resolver: zodResolver(productTryOnSchema),
    defaultValues: {
      assets: [],
      enableTryOn: false,
      model: '',
    },
  });

  const form7 = useForm<TProductSeo>({
    resolver: zodResolver(productSeoSchema),
    defaultValues: {
      seoDescription: '',
      seoKeywords: [],
      seoTitle: '',
    },
  });

  const form8 = useForm<TConfirmDetails>({
    resolver: zodResolver(confirmDetailsSchema),
    defaultValues: {
      confirm: false,
    },
  });

  const forms = [form1, form2, form3, form4, form5, form6, form7, form8];

  const handleNext = async () => {
    const currentForm = forms[activeStep];

    const isValid = await currentForm.trigger();

    if (!isValid) return;

    setActiveStep((prev) => Math.min(prev + 1, ADD_PRODUCT_STEPS.length - 1));
  };
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = async () => {
    const payload = {
      basicInfo: form1.getValues(),
      categoryInventory: form2.getValues(),
      media: form3.getValues(),
      description: form4.getValues(),
      variants: form5.getValues(),
      tryOn: form6.getValues(),
      seo: form7.getValues(),
    };

    console.log(payload);
  };

  const stepFields = [
    {
      title: 'Basic information',
      description: 'Product title, brand and pricing',
      content: (
        <form id="product-basic-info-form">
          <BasicInfoFields form={form1} />
        </form>
      ),
    },

    {
      title: 'Category and inventory',
      description: 'Category and stock details',
      content: (
        <form id="product-category-inventory-form">
          <CategoryInventoryFields form={form2} />
        </form>
      ),
    },

    {
      title: 'Media and gallery',
      description: 'Upload product media',
      content: (
        <form id="product-media-form">
          <MediaFields form={form3} />
        </form>
      ),
    },

    {
      title: 'Description and details',
      description: 'Product descriptions and usage',
      content: (
        <form id="product-description-form">
          <DescriptionFields form={form4} />
        </form>
      ),
    },
    {
      title: 'Variants and specifications',
      description: 'Product variants and specs',
      content: (
        <form id="product-variants-form">
          <VariantsFields form={form5} />
        </form>
      ),
    },

    {
      title: 'TryOn configuration',
      description: 'Configure TryOn assets',
      content: (
        <form id="product-tryon-form">
          <TryOnFields form={form6} />
        </form>
      ),
    },

    {
      title: 'SEO and visibility',
      description: 'SEO related settings',
      content: (
        <form id="product-seo-form">
          <SeoFields form={form7} />
        </form>
      ),
    },

    {
      title: 'Confirm before save',
      description: 'Review all details',
      content: (
        <form id="product-confirm-form">
          <ConfirmFields
            form={form8}
            values={{
              basicInfo: form1.getValues(),
              categoryInventory: form2.getValues(),
              media: form3.getValues(),
              description: form4.getValues(),
              variants: form5.getValues(),
              tryOn: form6.getValues(),
              seo: form7.getValues(),
            }}
          />
        </form>
      ),
    },
  ];

  return (
    <Stepper
      steps={ADD_PRODUCT_STEPS}
      activeStep={activeStep}
      onStepClick={(step) => setActiveStep(step)}
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
            buttonProps={{
              onClick: activeStep === 0 ? handleSaveDraft : handleBack,
            }}
          />

          <Button
            pattern="primary"
            content={activeStep === ADD_PRODUCT_STEPS.length - 1 ? 'Save' : 'Next'}
            buttonProps={{
              onClick: activeStep === ADD_PRODUCT_STEPS.length - 1 ? handleSaveDraft : handleNext,
            }}
          />
        </div>
      </div>
    </Stepper>
  );
};

export default AddNewProduct;
