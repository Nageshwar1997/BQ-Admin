import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import { ADD_PRODUCT_STEPS } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import type { TAddProductStepNumber } from '@/types/common.type';
import { useState } from 'react';
import AddProductBasicInfoForm from './children/AddProductBasicInfoForm';
import AddProductConfirmForm from './children/AddProductConfirmForm';
import AddProductDescriptionsForm from './children/AddProductDescriptionsForm';
import AddProductMediaForm from './children/AddProductMediaForm';
import AddProductSeoForm from './children/AddProductSeoForm';
import AddProductTryOnForm from './children/AddProductTryOnForm';
import AddProductVariantsForm from './children/AddProductVariantsForm';

const AddNewProduct = () => {
  const [activeStep, setActiveStep] = useState<TAddProductStepNumber>(2);

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
      content: <AddProductBasicInfoForm step={activeStep} onNext={handleNext} />,
    },

    {
      title: 'Media and gallery',
      description: 'Upload product media',
      content: <AddProductMediaForm step={activeStep} onNext={handleNext} />,
    },

    {
      title: 'Description and details',
      description: 'Product descriptions and usage',
      content: <AddProductDescriptionsForm step={activeStep} onNext={handleNext} />,
    },
    {
      title: 'Variants and specifications',
      description: 'Product variants and specs',
      content: <AddProductVariantsForm step={activeStep} onNext={handleNext} />,
    },

    {
      title: 'TryOn configuration',
      description: 'Configure TryOn assets',
      content: <AddProductTryOnForm step={activeStep} onNext={handleNext} />,
    },

    {
      title: 'SEO and visibility',
      description: 'SEO related settings',
      content: <AddProductSeoForm step={activeStep} onNext={handleNext} />,
    },

    {
      title: 'Confirm before save',
      description: 'Review all details',
      content: <AddProductConfirmForm step={activeStep} onNext={handleNext} />,
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
