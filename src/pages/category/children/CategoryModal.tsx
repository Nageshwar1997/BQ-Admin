import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import Button from '@/components/ui/Button';
import Stepper, { type StepperStep } from '@/components/ui/Stepper';
import Checkbox from '@/components/ui/inputs/Checkbox';
import {
  CATEGORY_LEVELS_MAP,
  CATEGORY_MODAL_STEPS,
  QUERY_PARAMS_KEY_MAP,
} from '@/constants/common.constants';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { categorySchema, confirmDetailsSchema } from '@/schemas/product.schema';
import {
  useAddCategory,
  useGetCategoriesByParentLevel,
  useUpdateCategory,
} from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TCatModal } from '@/types/component.type';
import type { TCategory, TConfirmDetails } from '@/types/schema.type';
import { deepEqual, toaster } from '@/utils/common.util';
import { setErrorToForm } from '@/utils/form.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Level1Fields, Level2Fields, Level3Fields } from './CategoryFields';

type TMode = typeof QUERY_PARAMS_KEY_MAP.category.edit | typeof QUERY_PARAMS_KEY_MAP.category.add;

const isL1 = (level: TCategory['level']) => level === CATEGORY_LEVELS_MAP.L1;
const isL2 = (level: TCategory['level']) => level === CATEGORY_LEVELS_MAP.L2;
const isL3 = (level: TCategory['level']) => level === CATEGORY_LEVELS_MAP.L3;

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
  const base = { activeStep: 0, name: cat.name };
  switch (cat.level) {
    case CATEGORY_LEVELS_MAP.L2:
      return { ...base, level: CATEGORY_LEVELS_MAP.L2, mainCategory: cat.parent || '' };

    case CATEGORY_LEVELS_MAP.L3:
      return {
        ...base,
        level: CATEGORY_LEVELS_MAP.L3,
        mainCategory: mainCatId || '',
        subCategory: cat.parent || '',
        description: cat.description || '',
      };

    case CATEGORY_LEVELS_MAP.L1:
    default:
      return { ...base, level: CATEGORY_LEVELS_MAP.L1 };
  }
};

const getPayload = (data: TCategory) => {
  const { level, name } = data;
  switch (level) {
    case CATEGORY_LEVELS_MAP.L2:
      return { name, level, parent: data.mainCategory, description: undefined };

    case CATEGORY_LEVELS_MAP.L3:
      return { name, level, parent: data.subCategory, description: data.description };

    case CATEGORY_LEVELS_MAP.L1:
    default:
      return { name, level, parent: null, description: undefined };
  }
};

const CategoryModal = (props: Partial<TCatModal> & { onClose?: () => void }) => {
  const { queryParams, removeParams } = useQueryParams();
  const category = props?.category;
  const mainCatId = props?.mainCatId;

  const mode = queryParams[QUERY_PARAMS_KEY_MAP.category.mode] as TMode;
  const isEditMode = mode === QUERY_PARAMS_KEY_MAP.category.edit && !!category;

  const detailsForm = useForm<TCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_VALUES,
  });

  const confirmForm = useForm<TConfirmDetails>({
    resolver: zodResolver(confirmDetailsSchema),
    defaultValues: { confirm: false },
  });

  const categoryValues = useWatch({ control: detailsForm.control });
  const activeStep = useWatch({ control: detailsForm.control, name: 'activeStep' });
  const activeStepData = CATEGORY_MODAL_STEPS[activeStep];
  const level = useWatch({ control: detailsForm.control, name: 'level' });
  const mainCategory = useWatch({ control: detailsForm.control, name: 'mainCategory' });
  const subCategory = useWatch({ control: detailsForm.control, name: 'subCategory' });
  const name = useWatch({ control: detailsForm.control, name: 'name' });

  const setActiveStep = (step: number) => {
    detailsForm.setValue('activeStep', step, { shouldDirty: false, shouldTouch: false });
  };

  const { mutateAsync: addCategoryAsync } = useAddCategory();

  const { mutateAsync: updateCategoryAsync } = useUpdateCategory();

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

  const initialPayload = useMemo(() => {
    if (!isEditMode || !category) return null;
    return getPayload(getInitialData(category, mainCatId));
  }, [category, mainCatId, isEditMode]);

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
      detailsForm.setError('name', { message: 'Category already exists.' });
    }

    return isDuplicate;
  };

  const hasChanges = (data: TCategory) => {
    if (!initialPayload) return true;
    return !deepEqual(getPayload(data), initialPayload);
  };

  const handleNext = async (data: TCategory) => {
    const payload = getPayload(data);
    if ((isEditMode && !hasChanges(detailsForm.getValues())) || !payload) {
      return toaster.error({
        title: 'No changes to save',
        description: 'Make changes and try again.',
      });
    } else if (!isDuplicateCategory()) {
      setActiveStep(Math.min(activeStep + 1, CATEGORY_MODAL_STEPS.length - 1));
    }
  };

  const handleClose = () => {
    detailsForm.reset();
    confirmForm.reset();
    props?.onClose?.();
    removeParams([QUERY_PARAMS_KEY_MAP.category.mode]);
  };

  const handleSave = async () => {
    const values = detailsForm.getValues();
    const payload = getPayload(values);
    if (!payload) {
      return toaster.error({
        title: 'No changes to save',
        description: 'Make changes and try again.',
      });
    }

    if (isEditMode) {
      await updateCategoryAsync(
        { ...payload, _id: category._id },
        {
          onSuccess: () => handleClose(),
          onError: ({ fieldErrors }) => {
            setErrorToForm(detailsForm.setError, fieldErrors);
            detailsForm.setValue('activeStep', 0);
          },
        },
      );
    } else {
      await addCategoryAsync(payload, {
        onSuccess: () => handleClose(),
        onError: ({ fieldErrors }) => {
          setErrorToForm(detailsForm.setError, fieldErrors);
          detailsForm.setValue('activeStep', 0);
        },
      });
    }
  };

  const stepFields = [
    {
      title: 'Category details',
      content: (
        <form
          id="category-details-form"
          onSubmit={detailsForm.handleSubmit(handleNext)}
          className="grid gap-5"
        >
          {isL1(level) && (
            <Level1Fields
              register={detailsForm.register}
              errors={detailsForm.formState.errors}
              control={detailsForm.control}
              level={level}
              setValue={detailsForm.setValue}
              isLevelDisabled={isEditMode}
            />
          )}

          {isL2(level) && (
            <Level2Fields
              register={detailsForm.register}
              errors={detailsForm.formState.errors}
              control={detailsForm.control}
              level={level}
              setValue={detailsForm.setValue}
              level1Cats={level1Cats}
              mainCategory={mainCategory || ''}
              isLevelDisabled={isEditMode}
            />
          )}

          {isL3(level) && (
            <Level3Fields
              register={detailsForm.register}
              errors={detailsForm.formState.errors}
              control={detailsForm.control}
              level={level}
              setValue={detailsForm.setValue}
              level1Cats={level1Cats}
              level2Cats={level2Cats}
              mainCategory={mainCategory || ''}
              subCategory={subCategory || ''}
              isLevelDisabled={isEditMode}
            />
          )}

          <div className="border-primary/10 bg-platinum-black grid gap-3 rounded-lg border p-4 sm:grid-cols-[auto_1fr]">
            <div className="bg-primary/5 text-primary grid size-11 place-items-center rounded-lg">
              <Icon icon="streamline:hierarchy-10" className="size-5" />
            </div>

            <TitleAndSubtitle title="Hierarchy preview" description={hierarchyPreview} />
          </div>
        </form>
      ),
    },
    {
      title: 'Final review',
      content: (
        <form
          id="confirm-details-form"
          onSubmit={confirmForm.handleSubmit(handleSave)}
          className="flex flex-col gap-4"
        >
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
            </div>
          </div>
          <Checkbox
            register={confirmForm.register('confirm')}
            error={confirmForm.formState.errors.confirm?.message}
            content="I confirm the category details are correct"
            checkboxProps={{ name: 'confirm' }}
            containerClassName="[&_label+*]:whitespace-normal"
          />
        </form>
      ),
    },
  ];

  const handleReset = () => {
    confirmForm.reset();
    if (isEditMode) {
      detailsForm.reset(getInitialData(category, mainCatId));
    } else {
      detailsForm.reset(DEFAULT_VALUES);
    }
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
      <Stepper steps={CATEGORY_MODAL_STEPS} activeStep={activeStep} className="bg-secondary-invert">
        <div className="flex flex-col gap-5">
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
                type: 'submit',
                form: activeStep === 0 ? 'category-details-form' : 'confirm-details-form',
              }}
              className="sm:max-w-36"
            />
          </div>
        </div>
      </Stepper>
    </ModalWrapper>
  );
};

export default CategoryModal;
