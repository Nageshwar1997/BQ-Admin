import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import Button from '@/components/ui/Button';
import Stepper, { type StepperStep } from '@/components/ui/Stepper';
import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { addCategorySchema } from '@/schemas/product.schema';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TAddCategory } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useForm, useWatch, type FieldPath } from 'react-hook-form';

const isL1 = (level: TAddCategory['level']) => Number(level) === 1;
const isL2 = (level: TAddCategory['level']) => Number(level) === 2;
const isL3 = (level: TAddCategory['level']) => Number(level) === 3;

const ADD_CATEGORY_STEPS: StepperStep[] = [
  {
    title: 'Category info',
    description: 'Name and hierarchy',
    icon: 'solar:hanger-2-linear',
  },
  {
    title: 'Review',
    description: 'Confirm before saving',
    icon: 'solar:checklist-minimalistic-linear',
  },
];

const STEP_FIELDS: FieldPath<TAddCategory>[][] = [
  ['name', 'level', 'mainCategory', 'subCategory', 'description'],
  ['confirmDetails'],
];

const getCategoryName = (categories: ICategory[] | undefined, id?: string) =>
  categories?.find((cat) => cat._id === id)?.name || '-';

const AddCategoryModal = () => {
  const { queryParams, removeParams } = useQueryParams();

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    setError,
    setValue,
    trigger,
  } = useForm<TAddCategory>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: FORM_DEFAULT_VALUES.addCategory,
    mode: 'onChange',
  });

  const categoryValues = useWatch({ control });
  const activeStep = useWatch({ control, name: 'activeStep' });
  const activeStepData = ADD_CATEGORY_STEPS[activeStep];
  const level = useWatch({ control, name: 'level' });
  const mainCategory = useWatch({ control, name: 'mainCategory' });
  const subCategory = useWatch({ control, name: 'subCategory' });
  const name = useWatch({ control, name: 'name' });

  const setActiveStep = (step: number) => {
    setValue('activeStep', step, { shouldDirty: false, shouldTouch: false });
  };

  const { data: level1Cats } = useGetCategoriesByParentLevel({
    level: 1,
    enabled: !isL1(level),
  });

  const { data: level2Cats } = useGetCategoriesByParentLevel({
    level: 2,
    parentId: mainCategory,
    enabled: isL3(level) && !!mainCategory,
  });

  const { data: level3Cats } = useGetCategoriesByParentLevel({
    level: 3,
    parentId: subCategory,
    enabled: isL3(level) && !!subCategory,
  });

  const hierarchyPreview = useMemo(() => {
    if (isL1(level)) return 'This will be created as a main category.';
    if (isL2(level)) {
      return `Under ${getCategoryName(level1Cats, categoryValues.mainCategory)}.`;
    }
    return `Under ${getCategoryName(level1Cats, categoryValues.mainCategory)} / ${getCategoryName(
      level2Cats,
      categoryValues.subCategory,
    )}.`;
  }, [categoryValues.mainCategory, categoryValues.subCategory, level, level1Cats, level2Cats]);

  const isDuplicateCategory = () => {
    const trimmedName = name.trim().toLowerCase();

    if (!trimmedName) return false;

    let categories: ICategory[] | undefined = [];

    if (isL1(level)) {
      categories = level1Cats;
    } else if (isL2(level)) {
      categories = level2Cats;
    } else if (isL3(level)) {
      categories = level3Cats;
    }

    const isDuplicate = categories?.some((cat) => cat.name.trim().toLowerCase() === trimmedName);

    if (isDuplicate) {
      setError('name', { message: 'Category already exists.' });
    }

    return isDuplicate;
  };

  const handleStepChange = async (nextStep: number) => {
    if (nextStep <= activeStep) {
      setActiveStep(nextStep);
      return;
    }

    const fieldsToValidate = STEP_FIELDS.slice(0, nextStep).flat();
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    const isDuplicate = isDuplicateCategory();

    if (isValid && !isDuplicate) {
      setActiveStep(nextStep);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(STEP_FIELDS[activeStep], {
      shouldFocus: true,
    });

    const isDuplicate = isDuplicateCategory();

    if (isValid && !isDuplicate) {
      setActiveStep(Math.min(activeStep + 1, ADD_CATEGORY_STEPS.length - 1));
    }
  };

  const getPayload = (data: TAddCategory) => {
    return {
      name: data.name.trim(),
      level: data.level,
      parent: isL3(data.level) ? data.subCategory : isL2(data.level) ? data.mainCategory : null,
      description: isL3(data.level) ? data.description.trim() : undefined,
    };
  };

  const handleSaveCategory = (data: TAddCategory) => {
    console.log('Add category payload:', getPayload(data));
  };

  const resetParentFields = (selectedLevel: TAddCategory['level']) => {
    if (isL1(selectedLevel)) {
      setValue('mainCategory', '', { shouldValidate: true });
      setValue('subCategory', '', { shouldValidate: true });
    }

    if (isL2(selectedLevel)) {
      setValue('subCategory', '', { shouldValidate: true });
    }

    if (isL3(selectedLevel)) {
      setValue('description', '', { shouldValidate: true });
    }
  };

  const stepFields = [
    {
      title: 'Category details',
      content: (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Category name"
              register={register('name')}
              error={errors.name?.message}
              inputProps={{
                name: 'name',
                placeholder: 'Category name',
              }}
            />
            <Select
              label="Category level"
              register={register('level')}
              options={['Main', 'Sub', 'Product'].map((name, i) => ({
                value: String(i + 1),
                label: `L${i + 1} - ${name} category`,
              }))}
              error={errors.level?.message}
              selectProps={{
                name: 'level',
                value: level,
                placeholder: 'Select category level',
                onChange: ({ currentTarget: { value } }) =>
                  resetParentFields(value as TAddCategory['level']),
              }}
            />
            <Select
              label="Main category"
              register={register('mainCategory')}
              options={level1Cats?.map((cat: ICategory) => ({ label: cat.name, value: cat._id }))}
              error={errors.mainCategory?.message}
              selectProps={{
                name: 'mainCategory',
                value: categoryValues.mainCategory,
                disabled: isL1(level),
                placeholder: isL1(level) ? `Not required for level 1` : 'Select main category',
                onChange: () => setValue('subCategory', '', { shouldValidate: true }),
              }}
            />
            <Select
              label="Sub-category"
              register={register('subCategory')}
              options={level2Cats?.map((cat: ICategory) => ({ label: cat.name, value: cat._id }))}
              error={errors.subCategory?.message}
              selectProps={{
                name: 'subCategory',
                value: categoryValues.subCategory,
                disabled: !isL3(level) || !mainCategory,
                placeholder: !isL3(level)
                  ? 'Only required for level 3'
                  : mainCategory
                    ? 'Select sub-category'
                    : 'Select main category first',
              }}
            />
            {isL3(level) && (
              <Input
                label="Description"
                register={register('description')}
                error={errors.description?.message}
                containerClassName="sm:col-span-2"
                inputProps={{
                  name: 'description',
                  placeholder: 'Short description for this product category',
                }}
              />
            )}
          </div>

          <div className="border-primary/10 bg-platinum-black grid gap-3 rounded-lg border p-4 sm:grid-cols-[auto_1fr]">
            <div className="bg-primary/5 text-primary grid size-11 place-items-center rounded-lg">
              <Icon icon="streamline:hierarchy-10" className="size-5" />
            </div>
            <div>
              <p className="text-primary text-sm font-semibold">Hierarchy preview</p>
              <p className="text-secondary mt-1 text-xs">{hierarchyPreview}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Final review',
      content: (
        <div className="flex flex-col gap-4">
          <div className="border-primary/10 bg-platinum-black rounded-lg border p-4">
            <p className="text-primary text-sm font-semibold">Ready to save</p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <p className="text-tertiary">
                Name: <span className="text-primary">{categoryValues.name || '-'}</span>
              </p>
              <p className="text-tertiary">
                Level: <span className="text-primary">Level {categoryValues.level || '-'}</span>
              </p>
              <p className="text-tertiary">
                Parent:{' '}
                {categoryValues.level && (
                  <span className="text-primary">
                    {isL1(categoryValues.level)
                      ? 'Main category'
                      : isL2(categoryValues.level)
                        ? getCategoryName(level1Cats, categoryValues.mainCategory)
                        : getCategoryName(level2Cats, categoryValues.subCategory) || '-'}
                  </span>
                )}
              </p>
              {categoryValues.level && isL3(categoryValues.level) && (
                <p className="text-tertiary sm:col-span-2">
                  Description:{' '}
                  <span className="text-primary">{categoryValues.description || '-'}</span>
                </p>
              )}
            </div>
          </div>
          <Checkbox
            register={register('confirmDetails')}
            error={errors.confirmDetails?.message}
            content="I confirm the category details are correct"
            checkboxProps={{ name: 'confirmDetails' }}
            containerClassName="[&_label+*]:whitespace-normal"
          />
        </div>
      ),
    },
  ];

  return (
    <ModalWrapper
      isOpen={queryParams.category === 'add'}
      onClose={() => removeParams(['category'])}
      header={{ showCloseIcon: true, title: 'Add new category' }}
      containerProps={{ className: 'p-4!' }}
      closeOnOutsideClick={false}
      className="bg-secondary-invert [&>div]:first:bg-secondary-invert max-w-lg! [&>div>div]:px-0"
    >
      <Stepper
        steps={ADD_CATEGORY_STEPS}
        activeStep={activeStep}
        onStepClick={handleStepChange}
        className="bg-secondary-invert"
      >
        <form onSubmit={handleSubmit(handleSaveCategory)} className="flex flex-col gap-5">
          <div>
            <p className="text-primary text-base font-semibold">{stepFields[activeStep].title}</p>
            <p className="text-secondary mt-1 text-xs">{activeStepData.description}</p>
          </div>

          {stepFields[activeStep].content}

          <div className="flex justify-between gap-3">
            <Button
              pattern="secondary"
              content="Back"
              leftIcon={{ icon: 'solar:arrow-left-linear' }}
              buttonProps={{
                disabled: activeStep === 0,
                onClick: () => setActiveStep(Math.max(activeStep - 1, 0)),
              }}
              className="sm:max-w-36"
            />
            <Button
              pattern="primary"
              content={activeStep === ADD_CATEGORY_STEPS.length - 1 ? 'Save' : 'Next'}
              rightIcon={
                activeStep === ADD_CATEGORY_STEPS.length - 1
                  ? { icon: 'solar:diskette-linear' }
                  : { icon: 'solar:arrow-right-linear' }
              }
              buttonProps={{
                type: activeStep === ADD_CATEGORY_STEPS.length - 1 ? 'submit' : 'button',
                onClick: activeStep === ADD_CATEGORY_STEPS.length - 1 ? undefined : handleNext,
                disabled: !isDirty || !!errors.confirmDetails?.message,
              }}
              className="sm:max-w-36"
            />
          </div>
        </form>
      </Stepper>
    </ModalWrapper>
  );
};

export default AddCategoryModal;
