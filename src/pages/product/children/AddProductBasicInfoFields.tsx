import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import type { CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import {
  PRODUCT_BASIC_INFO_INPUT_MAP_DATA,
  PRODUCT_CATEGORIES_SELECT_MAP_DATA,
} from '@/constants/input.constants';
import type { ICategory } from '@/types/api.type';
import type { TProductBasicInfo } from '@/types/schema.type';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

const AddProductBasicInfoFields = ({
  form,
  categories,
}: {
  form: UseFormReturn<TProductBasicInfo>;
  categories: Record<keyof typeof CATEGORY_LEVELS_MAP, ICategory[]>;
}) => {
  const {
    control,
    formState: { errors },
    register,
    setValue,
  } = form;

  const l1Category = useWatch({ control, name: 'l1Category' });
  const l2Category = useWatch({ control, name: 'l2Category' });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
        {PRODUCT_CATEGORIES_SELECT_MAP_DATA.map((select) => {
          const { label, name, placeholder } = select;
          const isL1 = name === 'l1Category';
          const isL2 = name === 'l2Category';
          const isL3 = name === 'l3Category';
          const cats = isL1 ? categories.L1 : isL2 ? categories.L2 : isL3 ? categories.L3 : [];

          const options = cats
            .map((cat) => !!cat && { label: cat.name, value: cat._id })
            .filter(Boolean);
          return (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label={label}
                  error={errors[name]?.message}
                  options={options}
                  optionsPosition="top"
                  selectProps={{
                    value,
                    placeholder,
                    disabled: isL1 ? !l1Category : isL2 ? !l2Category : !options.length,
                    onChange: (value) => {
                      if (isL1) {
                        setValue('l2Category', '');
                        setValue('l3Category', '');
                      }
                      if (isL2) {
                        setValue('l3Category', '');
                      }
                      onChange(value);
                    },
                  }}
                />
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AddProductBasicInfoFields;
