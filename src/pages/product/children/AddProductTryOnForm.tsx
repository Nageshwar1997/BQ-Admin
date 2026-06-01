import Checkbox from '@/components/ui/inputs/Checkbox';
import Select from '@/components/ui/inputs/Select';
import { ADD_PRODUCT_FORM_ID_MAP, TRY_ON_MAP, TRY_ON_TYPES } from '@/constants/form.constants';
import { productTryOnSchema } from '@/schemas/product.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TBaseProduct, TProductTryOn } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

const AddProductTryOnForm = ({
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
    resetField,
  } = useForm<TProductTryOn>({
    resolver: zodResolver(productTryOnSchema),
  });

  const enabled = useWatch({ control, name: 'enabled' });
  const tryOn = useWatch({ control, name: 'tryon' });

  const subTypes = useMemo(() => {
    return tryOn?.type ? TRY_ON_MAP[tryOn.type] : [];
  }, [tryOn?.type]);

  const onSubmit = (data: TProductTryOn) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    onNext('tryOn', data);
  };

  return (
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[step]}
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <Checkbox
        register={register('enabled')}
        error={errors.enabled?.message}
        content="Enable TryOn"
        checkboxProps={{ name: 'enabled', onChange: () => resetField('tryon') }}
      />
      {enabled && (
        <>
          <Controller
            name="tryon.type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="TryOn type"
                error={'tryon' in errors ? errors.tryon?.type?.message : undefined}
                options={TRY_ON_TYPES.map((type) => ({ label: type, value: type }))}
                selectProps={{
                  value,
                  placeholder: 'Select TryOn type',
                  onChange: (value) => {
                    onChange(value);
                    resetField('tryon.subType');
                  },
                }}
                optionsClassName="[&>ul>li>span]:lowercase [&>ul>li>span]:first-letter:capitalize"
                className="[&>div>span]:lowercase [&>div>span]:first-letter:capitalize"
              />
            )}
          />
          <Controller
            name="tryon.subType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="TryOn sub-type"
                error={'tryon' in errors ? errors.tryon?.subType?.message : undefined}
                options={subTypes.map((type) => ({ label: type, value: type }))}
                selectProps={{
                  value,
                  placeholder: 'Select TryOn sub-type',
                  onChange,
                  disabled: !tryOn?.type,
                }}
                optionsClassName="[&>ul>li>span]:lowercase [&>ul>li>span]:first-letter:capitalize"
                className="[&>div>span]:lowercase [&>div>span]:first-letter:capitalize"
              />
            )}
          />
        </>
      )}
    </form>
  );
};

export default AddProductTryOnForm;
