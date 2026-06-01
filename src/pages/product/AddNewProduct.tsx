import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import { ADD_PRODUCT_STEPS } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { productBaseSchema } from '@/schemas/product.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TBaseProduct } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch, type Path, type PathValue } from 'react-hook-form';
import AddProductBasicInfoForm from './children/AddProductBasicInfoForm';
import AddProductConfirmForm from './children/AddProductConfirmForm';
import AddProductDescriptionsForm from './children/AddProductDescriptionsForm';
import AddProductMediaForm from './children/AddProductMediaForm';
import AddProductSeoForm from './children/AddProductSeoForm';
import AddProductTryOnForm from './children/AddProductTryOnForm';
import AddProductVariantsForm from './children/AddProductVariantsForm';

const AddNewProduct = () => {
  const [activeStep, setActiveStep] = useState<TAddProductStepNumber>(0);

  const { getValues, setValue, control } = useForm<TBaseProduct>({
    resolver: zodResolver(productBaseSchema),
  });

  const baseProductValues = useWatch({ control });
  console.log('🚀 ~ AddNewProduct ~ baseProductValues:', baseProductValues);

  const handleNext = <K extends Path<TBaseProduct>>(key: K, value: PathValue<TBaseProduct, K>) => {
    setValue(key, value);

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
    <AddProductBasicInfoForm step={activeStep} onNext={handleNext} />,
    <AddProductMediaForm step={activeStep} onNext={handleNext} />,
    <AddProductDescriptionsForm step={activeStep} onNext={handleNext} />,
    <AddProductVariantsForm step={activeStep} onNext={handleNext} />,
    <AddProductTryOnForm step={activeStep} onNext={handleNext} />,
    <AddProductSeoForm step={activeStep} onNext={handleNext} />,
    <AddProductConfirmForm step={activeStep} values={getValues()} />,
  ];

  return (
    <div className="h-full w-full">
      <Navbar buttons={[{ content: 'Save Draft', leftIcon: { icon: 'solar:diskette-linear' } }]} />
      <Stepper
        steps={ADD_PRODUCT_STEPS}
        activeStep={activeStep}
        // TODO: Remove onStepClick after done
        onStepClick={(step) => setActiveStep(step as TAddProductStepNumber)}
        className="mt-4 p-4!"
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-primary text-sm font-semibold">
              {ADD_PRODUCT_STEPS[activeStep].title}
            </p>

            <p className="text-secondary text-xs">{ADD_PRODUCT_STEPS[activeStep].description}</p>
          </div>

          {stepFields[activeStep]}

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
