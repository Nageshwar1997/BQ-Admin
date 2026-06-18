import Checkbox from '@/components/ui/inputs/Checkbox';
import Select from '@/components/ui/inputs/Select';
import { TRY_ON_CATEGORIES, TRY_ON_MAP } from '@/constants/form.constants';
import { PRODUCT_TRYON_INPUT_MAP_DATA } from '@/constants/input.constants';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TProductTryOnConfiguration } from '@/types/schema.type';
import { useMemo } from 'react';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<TProductTryOnConfiguration>;
  onEdit: (step: TAddProductStepNumber) => void;
};
const AddProductTryOnConfigurationFields = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
    register,
    resetField,
  } = form;

  const enabled = useWatch({ control, name: 'enabled' });
  const tryOn = useWatch({ control, name: 'tryon' });

  const subCategories = useMemo(() => {
    return tryOn?.category ? TRY_ON_MAP[tryOn.category] : [];
  }, [tryOn?.category]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {PRODUCT_TRYON_INPUT_MAP_DATA.map((input) => {
        if (input.type === 'select' && !enabled) return null;
        return input.type === 'select' ? (
          <Controller
            key={input.name}
            name={`tryon.${input.name}`}
            control={control}
            render={({ field: { onChange, value } }) => {
              const options = input.name === 'subCategory' ? subCategories : TRY_ON_CATEGORIES;
              console.log('🚀 ~ AddProductTryOnConfigurationFields ~ options:', options);
              return (
                <Select
                  label={input.label}
                  error={'tryon' in errors ? errors.tryon?.[input.name]?.message : undefined}
                  options={options.map((category) => ({ label: category, value: category }))}
                  selectProps={{
                    value,
                    placeholder: input.placeholder,
                    disabled: input.name === 'subCategory' && !tryOn?.category,
                    onChange: (value) => {
                      if (input.name === 'category') {
                        resetField('tryon.subCategory');
                      }
                      onChange(value);
                    },
                  }}
                  optionsClassName="[&>ul>li>span]:lowercase [&>ul>li>span]:first-letter:capitalize"
                  className="[&>div>span]:lowercase [&>div>span]:first-letter:capitalize"
                />
              );
            }}
          />
        ) : (
          <Checkbox
            key={input.name}
            register={register('enabled')}
            error={errors.enabled?.message}
            content="Enable TryOn"
            checkboxProps={{ name: 'enabled', onChange: () => resetField('tryon') }}
            containerClassName="col-span-2"
          />
        );
      })}
    </div>
  );
};

export default AddProductTryOnConfigurationFields;
