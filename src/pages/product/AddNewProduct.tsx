import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import { ADD_PRODUCT_STEPS, CATEGORY_LEVELS_MAP, EMPTY_ARRAY } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import {
  productBaseSchema,
  productBasicInfoSchema,
  productDescriptionAndContentSchema,
  productMediaAndGallerySchema,
  productStockAndVariantsSchema,
} from '@/schemas/product.schema';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type {
  TAddProductStepNumber,
  TProductQuillImageRefs,
  TProductQuillRefs,
} from '@/types/common.type';
import type { TQuillImageRef } from '@/types/component.type';
import type {
  TBaseProduct,
  TProductBasicInfo,
  TProductDescriptionAndContent,
  TProductMediaAndGallery,
  TProductStockAndVariants,
} from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import type Quill from 'quill';
import { useRef, useState } from 'react';
import { useForm, useWatch, type Path, type PathValue } from 'react-hook-form';
import AddProductBasicInfoFields from './children/AddProductBasicInfoFields';
import AddProductConfirmForm from './children/AddProductConfirmForm';
import AddProductDescriptionAndContentFields from './children/AddProductDescriptionAndContentFields';
import AddProductMediaAndGalleryFields from './children/AddProductMediaAndGalleryFields';
import AddProductTryOnForm from './children/AddProductTryOnForm';
import AddProductVariantsForm from './children/AddProductVariantsForm';

const AddNewProduct = () => {
  const [activeStep, setActiveStep] = useState<TAddProductStepNumber>(3);

  const quillRefs: TProductQuillRefs = {
    description: useRef<Quill | null>(null),
    ingredients: useRef<Quill | null>(null),
    instructions: useRef<Quill | null>(null),
    additional: useRef<Quill | null>(null),
  };

  const imageRefs: TProductQuillImageRefs = {
    description: useRef<TQuillImageRef[]>([]),
    ingredients: useRef<TQuillImageRef[]>([]),
    instructions: useRef<TQuillImageRef[]>([]),
    additional: useRef<TQuillImageRef[]>([]),
  };

  const { getValues, control } = useForm<TBaseProduct>({
    resolver: zodResolver(productBaseSchema),
  });

  const basicInfoForm = useForm<TProductBasicInfo>({
    resolver: zodResolver(productBasicInfoSchema),
  });

  const mediaAndGalleryForm = useForm<TProductMediaAndGallery>({
    resolver: zodResolver(productMediaAndGallerySchema),
  });

  const descriptionAndContentForm = useForm<TProductDescriptionAndContent>({
    resolver: zodResolver(productDescriptionAndContentSchema),
  });

  const stockAndVariantsForm = useForm<TProductStockAndVariants>({
    resolver: zodResolver(productStockAndVariantsSchema),
  });

  const l1Category = useWatch({ control: basicInfoForm.control, name: 'l1Category' });
  const l2Category = useWatch({ control: basicInfoForm.control, name: 'l2Category' });

  const { data: l1Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L1,
  });

  const { data: l2Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: l1Category,
    enabled: !!l1Category,
  });

  const { data: l3Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: l2Category,
    enabled: !!l2Category,
  });

  const baseProductValues = useWatch({ control });
  console.log('🚀 ~ AddNewProduct ~ baseProductValues:', baseProductValues);

  const handleNext = <K extends Path<TBaseProduct>>(
    _key?: K,
    _value?: PathValue<TBaseProduct, K>,
  ) => {
    setActiveStep(
      (prev) => (prev < ADD_PRODUCT_STEPS.length - 1 ? prev + 1 : prev) as TAddProductStepNumber,
    );
  };

  const onBasicInfoSubmit = (data: TProductBasicInfo) => {
    console.log('onBasicInfoSubmit data', data);
    handleNext();
  };

  const onMediaAndGallerySubmit = (data: TProductMediaAndGallery) => {
    console.log('onMediaAndGallerySubmit data', data);
    handleNext();
  };

  const onDescriptionAndContentSubmit = (data: TProductDescriptionAndContent) => {
    console.log('onDescriptionAndContentSubmit data', data);
    handleNext();
  };

  const onStockAndVariantsSubmit = (data: TProductStockAndVariants) => {
    console.log('onStockAndVariantsSubmit data', data);
    handleNext();
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev) as TAddProductStepNumber);
  };

  const handleSaveDraft = async () => {
    console.log('Save Draft');
  };

  const stepFields = [
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
    >
      <AddProductBasicInfoFields
        form={basicInfoForm}
        categories={{ L1: l1Cats, L2: l2Cats, L3: l3Cats }}
      />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={mediaAndGalleryForm.handleSubmit(onMediaAndGallerySubmit)}
    >
      <AddProductMediaAndGalleryFields form={mediaAndGalleryForm} />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={descriptionAndContentForm.handleSubmit(onDescriptionAndContentSubmit)}
    >
      <AddProductDescriptionAndContentFields
        form={descriptionAndContentForm}
        imageRefs={imageRefs}
        quillRefs={quillRefs}
      />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={stockAndVariantsForm.handleSubmit(onStockAndVariantsSubmit)}
    >
      <AddProductVariantsForm form={stockAndVariantsForm} />
    </form>,
    <form id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}>
      <AddProductTryOnForm step={activeStep} onNext={handleNext} />
    </form>,
    <form id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}>
      <AddProductConfirmForm step={activeStep} values={getValues()} />
    </form>,
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
              content={activeStep === ADD_PRODUCT_STEPS.length - 1 ? 'Save' : 'Save & Next'}
              buttonProps={{ type: 'submit', form: ADD_PRODUCT_FORM_ID_MAP[activeStep] }}
            />
          </div>
        </div>
      </Stepper>
    </div>
  );
};

export default AddNewProduct;
