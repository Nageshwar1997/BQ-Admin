import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Stepper, { type StepperStep } from '@/components/ui/Stepper';
import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
// import Select from '@/components/ui/inputs/Select';
import { CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import { addProductSchema } from '@/schemas/product.schema';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TAddProduct } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch, type FieldPath } from 'react-hook-form';

const ADD_PRODUCT_STEPS: StepperStep[] = [
  {
    title: 'Product info',
    description: 'Name, brand and category',
    icon: 'solar:box-minimalistic-linear',
  },
  {
    title: 'Pricing',
    description: 'MRP, sale price and stock',
    icon: 'solar:tag-price-linear',
  },
  {
    title: 'Media',
    description: 'Images and preview assets',
    icon: 'solar:gallery-linear',
  },
  {
    title: 'Review',
    description: 'Check details and publish',
    icon: 'solar:checklist-minimalistic-linear',
  },
];

const STEP_FIELDS: FieldPath<TAddProduct>[][] = [
  ['title', 'brand', 'mainCategory', 'subCategory', 'productCategory'],
  ['mrp', 'salePrice', 'stock'],
  ['imageUrl'],
  ['confirmDetails'],
];

const AddProduct = () => {
  const [activeStep, setActiveStep] = useState(0);
  const activeStepData = ADD_PRODUCT_STEPS[activeStep];

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    // setValue,
    trigger,
  } = useForm<TAddProduct>({
    resolver: zodResolver(addProductSchema),
    defaultValues: FORM_DEFAULT_VALUES.addProduct,
    mode: 'onChange',
  });

  const mainCategory = useWatch({ control, name: 'mainCategory' });
  const subCategory = useWatch({ control, name: 'subCategory' });
  const productValues = useWatch({ control });

  const { data: level1Cats } = useGetCategoriesByParentLevel({ level: CATEGORY_LEVELS_MAP.L1 });
  const { data: level2Cats } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: mainCategory,
    enabled: !!mainCategory,
  });
  const { data: level3Cats } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: subCategory,
    enabled: !!subCategory,
  });

  const getCategoryName = (categories: ICategory[] | undefined, id?: string) =>
    categories?.find((cat) => cat._id === id)?.name || '-';

  const handleStepChange = async (nextStep: number) => {
    if (nextStep <= activeStep) {
      setActiveStep(nextStep);
      return;
    }

    const fieldsToValidate = STEP_FIELDS.slice(0, nextStep).flat();
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (isValid) setActiveStep(nextStep);
  };

  const handleNext = async () => {
    const isValid = await trigger(STEP_FIELDS[activeStep], { shouldFocus: true });
    if (isValid) setActiveStep((step) => Math.min(step + 1, ADD_PRODUCT_STEPS.length - 1));
  };

  const handlePublish = (data: TAddProduct) => {
    console.log({
      ...data,
      mrp: Number(data.mrp),
      salePrice: Number(data.salePrice),
      stock: Number(data.stock),
    });
  };

  const handleSaveDraft = () => {
    const data = getValues();
    console.log({
      ...data,
      mrp: data.mrp ? Number(data.mrp) : '',
      salePrice: data.salePrice ? Number(data.salePrice) : '',
      stock: data.stock ? Number(data.stock) : '',
    });
  };

  const stepFields = [
    {
      title: 'Product details',
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Product name"
            register={register('title')}
            error={errors.title?.message}
            inputProps={{ name: 'title', placeholder: 'Product name' }}
          />
          <Input
            label="Brand name"
            register={register('brand')}
            error={errors.brand?.message}
            inputProps={{ name: 'brand', placeholder: 'Brand name' }}
          />
          {/* <Select
            key={'Main Category'}
            label="Main category"
            register={register('mainCategory')}
            options={level1Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.mainCategory?.message}
            selectProps={{
              name: 'mainCategory',
              value: mainCategory,
              placeholder: 'Select main category',
              onChange: () => {
                setValue('subCategory', '');
                setValue('productCategory', '');
              },
            }}
          /> */}
          {/* <Select
            key={'Sub Category'}
            label="Sub-category"
            register={register('subCategory')}
            options={level2Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.subCategory?.message}
            selectProps={{
              name: 'subCategory',
              value: subCategory,
              disabled: !mainCategory,
              placeholder: mainCategory ? 'Select sub-category' : 'Select main category first',
              onChange: () => setValue('productCategory', ''),
            }}
          /> */}
          {/* <Select
            key={'Product Category'}
            label="Product category"
            register={register('productCategory')}
            options={level3Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.productCategory?.message}
            selectProps={{
              name: 'productCategory',
              value: productValues.productCategory,
              disabled: !subCategory,
              placeholder: subCategory ? 'Select product category' : 'Select sub-category first',
            }}
          /> */}
        </div>
      ),
    },
    {
      title: 'Pricing and stock',
      content: (
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="MRP"
            register={register('mrp')}
            error={errors.mrp?.message}
            inputProps={{ name: 'mrp', type: 'number', placeholder: 'MRP' }}
          />
          <Input
            label="Sale price"
            register={register('salePrice')}
            error={errors.salePrice?.message}
            inputProps={{ name: 'salePrice', type: 'number', placeholder: 'Sale price' }}
          />
          <Input
            label="Stock"
            register={register('stock')}
            error={errors.stock?.message}
            inputProps={{ name: 'stock', type: 'number', placeholder: 'Stock' }}
          />
        </div>
      ),
    },
    {
      title: 'Product media',
      content: (
        <div className="grid gap-4">
          <Input
            label="Product image URL"
            register={register('imageUrl')}
            error={errors.imageUrl?.message}
            inputProps={{
              name: 'imageUrl',
              placeholder: 'https://example.com/product-image.jpg',
            }}
          />
          <div className="border-primary/10 bg-primary-invert flex min-h-36 items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <div>
              <p className="text-primary text-sm font-semibold">Upload product images</p>
              <p className="text-secondary mt-1 text-xs">Gallery uploader can be connected here.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Final review',
      content: (
        <div className="flex flex-col gap-4">
          <div className="border-primary/10 bg-primary-invert rounded-lg border p-4">
            <p className="text-primary text-sm font-semibold">Ready to publish</p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <p className="text-secondary">
                Product: <span className="text-primary">{productValues.title || '-'}</span>
              </p>
              <p className="text-secondary">
                Brand: <span className="text-primary">{productValues.brand || '-'}</span>
              </p>
              <p className="text-secondary">
                Main category:{' '}
                <span className="text-primary">
                  {getCategoryName(level1Cats, productValues.mainCategory)}
                </span>
              </p>
              <p className="text-secondary">
                Sub-category:{' '}
                <span className="text-primary">
                  {getCategoryName(level2Cats, productValues.subCategory)}
                </span>
              </p>
              <p className="text-secondary">
                Product category:{' '}
                <span className="text-primary">
                  {getCategoryName(level3Cats, productValues.productCategory)}
                </span>
              </p>
              <p className="text-secondary">
                MRP: <span className="text-primary">{productValues.mrp || '-'}</span>
              </p>
              <p className="text-secondary">
                Sale price: <span className="text-primary">{productValues.salePrice || '-'}</span>
              </p>
              <p className="text-secondary">
                Stock: <span className="text-primary">{productValues.stock || '-'}</span>
              </p>
            </div>
          </div>
          <Checkbox
            register={register('confirmDetails')}
            error={errors.confirmDetails?.message}
            content="I confirm the product details are correct"
            checkboxProps={{ name: 'confirmDetails' }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Navbar
        buttons={[
          {
            content: 'Save Draft',
            pattern: 'secondary',
            className: 'whitespace-nowrap',
            leftIcon: { icon: 'solar:diskette-linear', className: 'size-4 md:size-5' },
            buttonProps: { onClick: handleSaveDraft },
          },
        ]}
        className="[&>:nth-last-child(2)]:border-b-silver/30 [&>:nth-last-child(2)]:border-b [&>div]:py-2"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 md:p-6">
        <div>
          <p className="text-secondary text-xs font-semibold tracking-wide uppercase">Products</p>
          <h1 className="text-primary mt-1 text-2xl font-semibold">Add Product</h1>
        </div>

        <Stepper steps={ADD_PRODUCT_STEPS} activeStep={activeStep} onStepClick={handleStepChange}>
          <form onSubmit={handleSubmit(handlePublish)} className="flex flex-col gap-5">
            <div>
              <p className="text-primary text-base font-semibold">{stepFields[activeStep].title}</p>
              <p className="text-secondary mt-1 text-xs">{activeStepData.description}</p>
            </div>

            {stepFields[activeStep].content}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                pattern="outline"
                content="Back"
                leftIcon={{ icon: 'solar:arrow-left-linear', className: 'size-4' }}
                buttonProps={{
                  disabled: activeStep === 0,
                  onClick: () => setActiveStep((step) => Math.max(step - 1, 0)),
                }}
                className="sm:max-w-36"
              />
              <Button
                pattern="primary"
                content={activeStep === ADD_PRODUCT_STEPS.length - 1 ? 'Publish' : 'Next'}
                rightIcon={
                  activeStep === ADD_PRODUCT_STEPS.length - 1
                    ? { icon: 'solar:check-read-linear', className: 'size-4' }
                    : { icon: 'solar:arrow-right-linear', className: 'size-4' }
                }
                buttonProps={{
                  type: activeStep === ADD_PRODUCT_STEPS.length - 1 ? 'submit' : 'button',
                  onClick: activeStep === ADD_PRODUCT_STEPS.length - 1 ? undefined : handleNext,
                }}
                className="sm:max-w-36"
              />
            </div>
          </form>
        </Stepper>
      </div>
    </div>
  );
};

export default AddProduct;
