import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import { ADD_PRODUCT_STEPS } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import {
  productDescriptionSchema,
  productMediaSchema,
  productSeoSchema,
  productTryOnSchema,
  productVariantsSchema,
} from '@/schemas/product.schema';
import { confirmDetailsSchema } from '@/schemas/shared.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type {
  TConfirmDetails,
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
  ConfirmFields,
  DescriptionFields,
  MediaFields,
  SeoFields,
  TryOnFields,
  VariantsFields,
} from './children';

const AddNewProduct = () => {
  const [activeStep, setActiveStep] = useState<TAddProductStepNumber>(2);

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

  const handleNext = () => {
    setActiveStep(
      (prev) => (prev < ADD_PRODUCT_STEPS.length - 1 ? prev + 1 : prev) as TAddProductStepNumber,
    );
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev) as TAddProductStepNumber);
  };

  const handleSaveDraft = async () => {
    console.log('Save Draft');
  };

  const stepFields = [
    {
      title: 'Basic information',
      description: 'Product title, brand and pricing',
      content: <BasicInfoFields step={activeStep} onNext={handleNext} />,
    },

    {
      title: 'Media and gallery',
      description: 'Upload product media',
      content: (
        <form
          onSubmit={mediaForm.handleSubmit(handleNext)}
          id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
        >
          <MediaFields form={mediaForm} />
        </form>
      ),
    },

    {
      title: 'Description and details',
      description: 'Product descriptions and usage',
      content: (
        <form
          onSubmit={descriptionForm.handleSubmit(handleNext)}
          id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
        >
          <DescriptionFields form={descriptionForm} />
        </form>
      ),
    },
    {
      title: 'Variants and specifications',
      description: 'Product variants and specs',
      content: (
        <form
          onSubmit={variantsForm.handleSubmit(handleNext)}
          id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
        >
          <VariantsFields form={variantsForm} />
        </form>
      ),
    },

    {
      title: 'TryOn configuration',
      description: 'Configure TryOn assets',
      content: (
        <form
          onSubmit={tryOnForm.handleSubmit(handleNext)}
          id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
        >
          <TryOnFields form={tryOnForm} />
        </form>
      ),
    },

    {
      title: 'SEO and visibility',
      description: 'SEO related settings',
      content: (
        <form onSubmit={seoFOrm.handleSubmit(handleNext)} id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}>
          <SeoFields form={seoFOrm} />
        </form>
      ),
    },

    {
      title: 'Confirm before save',
      description: 'Review all details',
      content: (
        <form
          onSubmit={confirmForm.handleSubmit(handleSaveDraft)}
          id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
        >
          <ConfirmFields form={confirmForm} />
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
        onStepClick={(step) => setActiveStep(step as TAddProductStepNumber)}
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
              buttonProps={{ type: 'submit', form: ADD_PRODUCT_FORM_ID_MAP[activeStep] }}
            />
          </div>
        </div>
      </Stepper>
    </div>
  );
};

export default AddNewProduct;
