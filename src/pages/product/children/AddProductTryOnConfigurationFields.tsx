import Checkbox from '@/components/ui/inputs/Checkbox';
import Select from '@/components/ui/inputs/Select';
import { TRY_ON_MAP, TRY_ON_TYPES } from '@/constants/form.constants';
import { PRODUCT_TRYON_INPUT_MAP_DATA } from '@/constants/input.constants';
import type { TProductTryOnConfiguration } from '@/types/schema.type';
import { useMemo } from 'react';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<TProductTryOnConfiguration>;
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

  const subTypes = useMemo(() => {
    return tryOn?.type ? TRY_ON_MAP[tryOn.type] : [];
  }, [tryOn?.type]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {PRODUCT_TRYON_INPUT_MAP_DATA.map((input) => {
        if (input.type === 'select' && !enabled) return null;
        return input.type === 'select' ? (
          <Controller
            name={`tryon.${input.name}`}
            control={control}
            render={({ field: { onChange, value } }) => {
              const options = input.name === 'subType' ? subTypes : TRY_ON_TYPES;
              return (
                <Select
                  label={input.label}
                  error={'tryon' in errors ? errors.tryon?.[input.name]?.message : undefined}
                  options={options.map((type) => ({ label: type, value: type }))}
                  selectProps={{
                    value,
                    placeholder: input.placeholder,
                    disabled: input.name === 'subType' && !tryOn?.type,
                    onChange: (value) => {
                      if (input.name === 'type') {
                        resetField('tryon.subType');
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
            register={register('enabled')}
            error={errors.enabled?.message}
            content="Enable TryOn"
              checkboxProps={{ name: 'enabled', onChange: () => resetField('tryon') }}
              containerClassName='col-span-2'
          />
        );
      })}
    </div>
  );
};

export default AddProductTryOnConfigurationFields;
