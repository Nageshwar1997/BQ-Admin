import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import Button from '@/components/ui/Button';
import Stepper, { type StepperStep } from '@/components/ui/Stepper';
import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { CATEGORY_MODAL_STEPS, QUERY_PARAMS_KEY_MAP } from '@/constants/common.constants';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { categorySchema } from '@/schemas/product.schema';
import {
  useAddCategory,
  useEditCategory,
  useGetCategoriesByParentLevel,
} from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TCatModal } from '@/types/component.type';
import type { TCategory } from '@/types/schema.type';
import { deepEqual, toaster } from '@/utils/common.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch, type FieldPath } from 'react-hook-form';

type TMode = typeof QUERY_PARAMS_KEY_MAP.category.edit | typeof QUERY_PARAMS_KEY_MAP.category.add;

const STEP_FIELDS: FieldPath<TCategory>[][] = [
  ['name', 'level', 'mainCategory', 'subCategory', 'description'],
  ['confirmDetails'],
];

const TitleAndSubtitle = ({ title, description }: Omit<StepperStep, 'icon'>) => (
  <div className="text-left">
    <p className="text-primary text-sm font-semibold">{title}</p>
    {description && <p className="text-secondary text-xs">{description}</p>}
  </div>
);

const getCategoryName = (categories: ICategory[] | undefined, id?: string) =>
  categories?.find((cat) => cat._id === id)?.name || '-';

const getInitialData = (cat: ICategory, mainCatId?: string) => {
  return {
    name: cat.name,
    level: cat.level,
    mainCategory:
      cat.level === 2 && cat.parent ? cat.parent : cat.level === 3 && mainCatId ? mainCatId : '',
    subCategory: cat.level === 3 && cat.parent ? cat.parent : '',
    description: cat.description || '',
    activeStep: 0,
    confirmDetails: false,
  };
};

const getPayload = (data: TCategory) => {
  return {
    name: data.name.trim(),
    level: data.level,
    parent: data.level === 3 ? data.subCategory : data.level === 2 ? data.mainCategory : null,
    description: data.description,
  };
};

const CategoryModal = (props: Partial<TCatModal> & { onClose?: () => void }) => {
  const { queryParams, removeParams } = useQueryParams();
  const category = props?.category;
  const mainCatId = props?.mainCatId;

  const mode = queryParams[QUERY_PARAMS_KEY_MAP.category.mode] as TMode;
  const isEditMode = mode === QUERY_PARAMS_KEY_MAP.category.edit && !!category;

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    trigger,
  } = useForm<TCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: FORM_DEFAULT_VALUES.category,
    mode: 'onChange',
  });

  const categoryValues = useWatch({ control });
  const activeStep = useWatch({ control, name: 'activeStep' });
  const activeStepData = CATEGORY_MODAL_STEPS[activeStep];
  const level = useWatch({ control, name: 'level' });
  const mainCategory = useWatch({ control, name: 'mainCategory' });
  const subCategory = useWatch({ control, name: 'subCategory' });
  const name = useWatch({ control, name: 'name' });

  const setActiveStep = (step: number) => {
    setValue('activeStep', step, { shouldDirty: false, shouldTouch: false });
  };

  const { mutateAsync: addCategoryAsync } = useAddCategory();

  const { mutateAsync: editCategoryAsync } = useEditCategory();

  const { data: level1Cats } = useGetCategoriesByParentLevel({
    level: 1,
    enabled: level !== 1,
  });

  const { data: level2Cats } = useGetCategoriesByParentLevel({
    level: 2,
    parent: mainCategory,
    enabled: level === 3 && !!mainCategory,
  });

  const { data: level3Cats } = useGetCategoriesByParentLevel({
    level: 3,
    parent: subCategory,
    enabled: level === 3 && !!subCategory,
  });

  const hierarchyPreview = useMemo(() => {
    if (level === 1) return 'This will be created as a main category.';
    if (level === 2) {
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

    if (level === 1) {
      categories = level1Cats;
    } else if (level === 2) {
      categories = level2Cats;
    } else if (level === 3) {
      categories = level3Cats;
    }

    const isDuplicate =
      categories?.some((cat) => cat.name.trim().toLowerCase() === trimmedName) || false;

    if (isDuplicate) {
      setError('name', { message: 'Category already exists.' });
    }

    return isDuplicate;
  };

  const hasChanges = (data: TCategory) => {
    if (!initialPayload) return true;
    return !deepEqual(getPayload(data), initialPayload);
  };

  const handleStepChange = async (nextStep: number) => {
    if (nextStep <= activeStep) {
      setActiveStep(nextStep);
      return;
    }

    const fieldsToValidate = STEP_FIELDS.slice(0, nextStep).flat();
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (!isValid) return;

    if (isEditMode && !hasChanges(getValues())) {
      return toaster.error({
        title: 'No changes to save',
        description: 'Make changes and try again.',
      });
    } else if (!isDuplicateCategory()) {
      setActiveStep(nextStep);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(STEP_FIELDS[activeStep], { shouldFocus: true });

    if (!isValid) return;
    if (isEditMode && !hasChanges(getValues())) {
      return toaster.error({
        title: 'No changes to save',
        description: 'Make changes and try again.',
      });
    } else if (!isDuplicateCategory()) {
      setActiveStep(Math.min(activeStep + 1, CATEGORY_MODAL_STEPS.length - 1));
    }
  };

  const initialPayload = useMemo(() => {
    if (!isEditMode || !category) return null;
    return getPayload(getInitialData(category, mainCatId));
  }, [category, mainCatId, isEditMode]);

  const handleSave = async (data: TCategory) => {
    const payload = getPayload(data);
    if (isEditMode) {
      await editCategoryAsync({ ...payload, _id: category._id });
    } else {
      await addCategoryAsync(payload);
    }
  };

  const resetParentFields = (selectedLevel: TCategory['level']) => {
    if (selectedLevel === 1) {
      setValue('mainCategory', '', { shouldValidate: true });
      setValue('subCategory', '', { shouldValidate: true });
    }

    if (selectedLevel === 2) {
      setValue('subCategory', '', { shouldValidate: true });
    }

    if (selectedLevel === 3) {
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
                value: i + 1,
                label: `L${i + 1} - ${name} category`,
              }))}
              error={errors.level?.message}
              selectProps={{
                name: 'level',
                value: level,
                placeholder: 'Select category level',
                onChange: ({ currentTarget: { value } }) =>
                  resetParentFields(Number(value) as TCategory['level']),
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
                disabled: level === 1,
                placeholder: level === 1 ? `Not required for L1` : 'Select main category',
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
                disabled: level !== 3 || !mainCategory,
                placeholder:
                  level !== 3
                    ? 'Only required for L3'
                    : mainCategory
                      ? 'Select sub-category'
                      : 'Select main category first',
              }}
            />
            {level === 3 && (
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
            <TitleAndSubtitle title="Hierarchy preview" description={hierarchyPreview} />
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
                <span className="text-primary">
                  {categoryValues.level === 1
                    ? 'Main category'
                    : categoryValues.level === 2
                      ? getCategoryName(level1Cats, categoryValues.mainCategory)
                      : getCategoryName(level2Cats, categoryValues.subCategory) || '-'}
                </span>
              </p>
              {categoryValues.level === 3 && (
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

  const handleReset = () => {
    if (isEditMode) {
      reset(getInitialData(category, mainCatId));
    } else {
      reset(FORM_DEFAULT_VALUES.category);
    }
  };

  const handleClose = () => {
    reset();
    props?.onClose?.();
    removeParams([QUERY_PARAMS_KEY_MAP.category.mode]);
  };

  useEffect(() => {
    handleReset();
  }, [category, mainCatId]);

  return (
    <ModalWrapper
      isOpen={
        mode === QUERY_PARAMS_KEY_MAP.category.edit || mode === QUERY_PARAMS_KEY_MAP.category.add
      }
      onClose={handleClose}
      header={{ showCloseIcon: true, title: isEditMode ? 'Edit category' : 'Add new category' }}
      containerProps={{ className: 'p-4!' }}
      closeOnOutsideClick={false}
      className="bg-secondary-invert [&>div]:first:bg-secondary-invert max-w-lg! [&>div>div]:px-0"
    >
      <Stepper
        steps={CATEGORY_MODAL_STEPS}
        activeStep={activeStep}
        onStepClick={handleStepChange}
        className="bg-secondary-invert"
      >
        <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-5">
          <TitleAndSubtitle
            title={stepFields[activeStep].title}
            description={activeStepData.description}
          />

          {stepFields[activeStep].content}

          <div className="flex justify-between gap-3">
            <Button
              pattern="secondary"
              content={activeStep === 0 ? 'Reset' : 'Back'}
              leftIcon={{
                icon: activeStep === 0 ? 'solar:restart-linear' : 'solar:arrow-left-linear',
              }}
              buttonProps={{
                onClick: () =>
                  activeStep === 0 ? handleReset() : setActiveStep(Math.max(activeStep - 1, 0)),
              }}
              className="sm:max-w-36"
            />
            <Button
              pattern="primary"
              content={activeStep === CATEGORY_MODAL_STEPS.length - 1 ? 'Save' : 'Next'}
              rightIcon={
                activeStep === CATEGORY_MODAL_STEPS.length - 1
                  ? { icon: 'solar:diskette-linear' }
                  : { icon: 'solar:arrow-right-linear' }
              }
              buttonProps={{
                type: activeStep === CATEGORY_MODAL_STEPS.length - 1 ? 'submit' : 'button',
                onClick: activeStep === CATEGORY_MODAL_STEPS.length - 1 ? undefined : handleNext,
              }}
              className="sm:max-w-36"
            />
          </div>
        </form>
      </Stepper>
    </ModalWrapper>
  );
};

export default CategoryModal;
