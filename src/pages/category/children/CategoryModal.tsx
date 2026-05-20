import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import Button from '@/components/ui/Button';
import Stepper, { type StepperStep } from '@/components/ui/Stepper';
import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import {
  CATEGORY_LEVELS_MAP,
  CATEGORY_MODAL_STEPS,
  QUERY_PARAMS_KEY_MAP,
} from '@/constants/common.constants';
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
import { Controller, useForm, useWatch, type FieldPath } from 'react-hook-form';
const CommonFields = ({
  register,
  errors,
  control,
  level,
  setValue,
}: {
  register: any;
  errors: any;
  control: any;
  level: TCategory['level'];
  setValue: any;
}) => (
  <>
    <Input
      label="Category name"
      register={register('name')}
      error={errors.name?.message}
      inputProps={{
        name: 'name',
        placeholder: 'Category name',
      }}
    />

    <Controller
      name="level"
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select
          label="Category level"
          options={['Main', 'Sub', 'Product'].map((name, i) => ({
            value: i + CATEGORY_LEVELS_MAP.L1,
            label: `L${i + CATEGORY_LEVELS_MAP.L1} - ${name} category`,
            disabled: i + 1 === level,
          }))}
          error={errors.level?.message}
          selectProps={{
            value,
            placeholder: 'Select category level',
            onChange: (value) => {
              onChange(value);

              setValue('mainCategory', undefined);
              setValue('subCategory', undefined);
              setValue('description', undefined);
            },
          }}
        />
      )}
    />
  </>
);

/* -------------------------------------------------------------------------- */
/*                              LEVEL 1 FIELDS                                */
/* -------------------------------------------------------------------------- */

const Level1Fields = ({ register, errors, control, level, setValue }: any) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        setValue={setValue}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              LEVEL 2 FIELDS                                */
/* -------------------------------------------------------------------------- */

const Level2Fields = ({
  register,
  errors,
  control,
  level,
  setValue,
  level1Cats,
  mainCategory,
}: any) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        setValue={setValue}
      />

      <Controller
        name="mainCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Main category"
            options={level1Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.mainCategory?.message}
            selectProps={{
              value: mainCategory,
              placeholder: 'Select main category',
              onChange: onChange,
            }}
          />
        )}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              LEVEL 3 FIELDS                                */
/* -------------------------------------------------------------------------- */

const Level3Fields = ({
  register,
  errors,
  control,
  level,
  setValue,
  level1Cats,
  level2Cats,
  mainCategory,
  subCategory,
}: any) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        setValue={setValue}
      />

      <Controller
        name="mainCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Main category"
            options={level1Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.mainCategory?.message}
            selectProps={{
              value: mainCategory,
              placeholder: 'Select main category',
              onChange: (value) => {
                onChange(value);

                setValue('subCategory', undefined);
              },
            }}
          />
        )}
      />

      <Controller
        name="subCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Sub-category"
            options={level2Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.subCategory?.message}
            selectProps={{
              value: subCategory,
              placeholder: 'Select sub-category',
              disabled: !mainCategory,
              onChange,
            }}
          />
        )}
      />

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
    </div>
  );
};

type TMode = typeof QUERY_PARAMS_KEY_MAP.category.edit | typeof QUERY_PARAMS_KEY_MAP.category.add;

const isL1 = (level: TCategory['level']) => level === CATEGORY_LEVELS_MAP.L1;
const isL2 = (level: TCategory['level']) => level === CATEGORY_LEVELS_MAP.L2;
const isL3 = (level: TCategory['level']) => level === CATEGORY_LEVELS_MAP.L3;

const STEP_FIELDS: FieldPath<TCategory>[][] = [
  ['name', 'level', 'mainCategory', 'subCategory', 'description'],
  ['confirmDetails'],
];

const DEFAULT_VALUES = FORM_DEFAULT_VALUES.category;

const TitleAndSubtitle = ({ title, description }: Omit<StepperStep, 'icon'>) => (
  <div className="text-left">
    <p className="text-primary text-sm font-semibold">{title}</p>
    {description && <p className="text-secondary text-xs">{description}</p>}
  </div>
);

const getCategoryName = (categories: ICategory[] | undefined, id?: string) =>
  categories?.find((cat) => cat._id === id)?.name || '-';

const getInitialData = (cat: ICategory, mainCatId?: string): TCategory => {
  switch (cat.level) {
    case CATEGORY_LEVELS_MAP.L1:
      return {
        activeStep: 0,
        confirmDetails: false,

        name: cat.name,
        level: CATEGORY_LEVELS_MAP.L1,
      };

    case CATEGORY_LEVELS_MAP.L2:
      return {
        activeStep: 0,
        confirmDetails: false,

        name: cat.name,
        level: CATEGORY_LEVELS_MAP.L2,

        mainCategory: cat.parent || '',
      };

    case CATEGORY_LEVELS_MAP.L3:
      return {
        activeStep: 0,
        confirmDetails: false,

        name: cat.name,
        level: CATEGORY_LEVELS_MAP.L3,

        mainCategory: mainCatId || '',
        subCategory: cat.parent || '',
        description: cat.description || '',
      };

    default:
      throw new Error('Invalid category level');
  }
};

const getPayload = (data: TCategory) => {
  switch (data.level) {
    case CATEGORY_LEVELS_MAP.L1:
      return {
        name: data.name,
        level: data.level,
        parent: null,
        description: undefined,
      };

    case CATEGORY_LEVELS_MAP.L2:
      return {
        name: data.name,
        level: data.level,
        parent: data.mainCategory,
        description: undefined,
      };

    case CATEGORY_LEVELS_MAP.L3:
      return {
        name: data.name,
        level: data.level,
        parent: data.subCategory,
        description: data.description,
      };

    default:
      return null;
  }
};

const CategoryModal = (props: Partial<TCatModal> & { onClose?: () => void }) => {
  const { queryParams, removeParams } = useQueryParams();
  const category = props?.category;
  const mainCatId = props?.mainCatId;

  const mode = queryParams[QUERY_PARAMS_KEY_MAP.category.mode] as TMode;
  const isEditMode = mode === QUERY_PARAMS_KEY_MAP.category.edit && !!category;

  const {
    control,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    trigger,
  } = useForm<TCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_VALUES,
  });

  console.log("errors",errors)
console.log('isValid', isValid);
  const categoryValues = useWatch({ control });
  const activeStep = useWatch({ control, name: 'activeStep' });
  console.log("🚀 ~ CategoryModal ~ activeStep:", activeStep)
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
    level: CATEGORY_LEVELS_MAP.L1,
    enabled: !isL1(level),
  });

  const { data: level2Cats } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: mainCategory,
    enabled: level === CATEGORY_LEVELS_MAP.L3 && !!mainCategory,
  });

  const { data: level3Cats } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: subCategory,
    enabled: level === CATEGORY_LEVELS_MAP.L3 && !!subCategory,
  });

  const hierarchyPreview = useMemo(() => {
    switch (level) {
      case CATEGORY_LEVELS_MAP.L1:
        return 'This will be created as a main category.';

      case CATEGORY_LEVELS_MAP.L2:
        return `Under ${getCategoryName(level1Cats, mainCategory)}.`;

      case CATEGORY_LEVELS_MAP.L3:
        return `Under ${getCategoryName(level1Cats, mainCategory)} / ${getCategoryName(
          level2Cats,
          subCategory,
        )}.`;

      default:
        return '-';
    }
  }, [categoryValues, level, level1Cats, level2Cats]);

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
    if (!payload) {
      return toaster.error({
        title: 'No changes to save',
        description: 'Make changes and try again.',
      });
    }

    if (isEditMode) {
      await editCategoryAsync({ ...payload, _id: category._id });
    } else {
      await addCategoryAsync(payload);
    }
  };

  const stepFields = [
    {
      title: 'Category details',
      content: (
        <div className="grid gap-5">
          {isL1(level) && (
            <Level1Fields
              register={register}
              errors={errors}
              control={control}
              level={level}
              setValue={setValue}
            />
          )}

          {isL2(level) && (
            <Level2Fields
              register={register}
              errors={errors}
              control={control}
              level={level}
              setValue={setValue}
              level1Cats={level1Cats}
              mainCategory={mainCategory}
            />
          )}

          {isL3(level) && (
            <Level3Fields
              register={register}
              errors={errors}
              control={control}
              level={level}
              setValue={setValue}
              level1Cats={level1Cats}
              level2Cats={level2Cats}
              mainCategory={mainCategory}
              subCategory={subCategory}
            />
          )}

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
              {level && (
                <>
                  <p className="text-tertiary">
                    Parent:{' '}
                    <span className="text-primary">
                      {isL1(level)
                        ? 'Main category'
                        : isL2(level)
                          ? getCategoryName(level1Cats, mainCategory)
                          : getCategoryName(level2Cats, subCategory) || '-'}
                    </span>
                  </p>
                  {isL3(level) && 'description' in categoryValues && (
                    <p className="text-tertiary sm:col-span-2">
                      Description:{' '}
                      <span className="text-primary">{categoryValues.description || '-'}</span>
                    </p>
                  )}
                </>
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
      reset(DEFAULT_VALUES);
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
                // type: activeStep === CATEGORY_MODAL_STEPS.length - 1 ? 'submit' : 'button',
                type: 'submit',
                // onClick: activeStep === CATEGORY_MODAL_STEPS.length - 1 ? undefined : handleNext,
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
