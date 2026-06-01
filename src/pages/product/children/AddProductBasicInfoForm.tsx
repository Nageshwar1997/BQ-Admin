import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { CATEGORY_LEVELS_MAP, EMPTY_ARRAY } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { PRODUCT_BASIC_INFO_INPUT_MAP_DATA } from '@/constants/input.constants';
import { productBasicInfoSchema } from '@/schemas/product.schema';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TBaseProduct, TProductBasicInfo } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

const AddProductBasicInfoForm = ({
  onNext,
  step,
}: {
  onNext: (key: keyof TBaseProduct, value: TBaseProduct[keyof TBaseProduct]) => void;
  step: TAddProductStepNumber;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<TProductBasicInfo>({ resolver: zodResolver(productBasicInfoSchema) });

  const l1Category = useWatch({ control, name: 'l1Category' });
  const l2Category = useWatch({ control, name: 'l2Category' });
  const l3Category = useWatch({ control, name: 'l3Category' });

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

  const onSubmit = (data: TProductBasicInfo) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    onNext('basicInfo', {
      ...data,
      l1CategoryName: l1Cats.find((cat) => cat._id === l1Category)?.name || '',
      l2CategoryName: l2Cats.find((cat) => cat._id === l2Category)?.name || '',
      l3CategoryName: l3Cats.find((cat) => cat._id === l3Category)?.name || '',
    });
  };

  return (
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[step]}
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 sm:grid-cols-2"
    >
      {PRODUCT_BASIC_INFO_INPUT_MAP_DATA.map((input) => (
        <Input
          key={input.name}
          label={input.label}
          register={register(input.name, {
            ...(input.type === 'number' && { valueAsNumber: true }),
          })}
          error={errors[input.name]?.message}
          inputProps={{ type: input.type, placeholder: input.placeholder }}
        />
      ))}
      <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
        <Controller
          name="l1Category"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Main category"
              error={errors.l1Category?.message}
              options={l1Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
              optionsPosition="top"
              selectProps={{
                value,
                placeholder: 'Select (L1) main category',
                onChange: (value) => {
                  onChange(value);

                  setValue('l2Category', '');
                  setValue('l3Category', '');
                },
              }}
            />
          )}
        />

        <Controller
          name="l2Category"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Sub-category"
              error={errors.l2Category?.message}
              options={l2Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
              optionsPosition="top"
              selectProps={{
                value,
                disabled: !l1Category,
                placeholder: 'Select (L2) sub-category',
                onChange: (value) => {
                  onChange(value);

                  setValue('l3Category', '');
                },
              }}
            />
          )}
        />

        <Controller
          name="l3Category"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Product category"
              error={errors.l3Category?.message}
              options={l3Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
              optionsPosition="top"
              selectProps={{
                value,
                disabled: !l2Category,
                placeholder: 'Select (L3) product category',
                onChange,
              }}
            />
          )}
        />
      </div>
    </form>
  );
};

export default AddProductBasicInfoForm;
