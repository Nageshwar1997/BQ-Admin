import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
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
    console.log("🚀 ~ AddProductTryOnForm ~ errors:", errors)

  const enableTryOn = useWatch({ control, name: 'enableTryOn' });
  const tryOnType = useWatch({ control, name: 'type' });

  const subTypes = useMemo(() => {
    return tryOnType ? TRY_ON_MAP[tryOnType] : [];
  }, [tryOnType]);

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
        register={register('enableTryOn')}
        error={errors.enableTryOn?.message}
        content="Enable TryOn"
        checkboxProps={{
          name: 'enableTryOn',
        }}
      />

      {enableTryOn && (
        <>
          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="TryOn type"
                error={'type' in errors ? errors.type?.message : undefined}
                options={TRY_ON_TYPES.map((type) => ({ label: type, value: type }))}
                selectProps={{
                  value,
                  placeholder: 'Select TryOn type',
                  onChange: (value) => {
                    onChange(value);
                    resetField('subType');
                  },
                }}
                optionsClassName="[&>ul>li>span]:lowercase [&>ul>li>span]:first-letter:capitalize"
                className="[&>div>span]:lowercase [&>div>span]:first-letter:capitalize"
              />
            )}
          />
          <Controller
            name="subType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="TryOn sub-type"
                error={'subType' in errors ? errors.subType?.message : undefined}
                options={subTypes.map((type) => ({ label: type, value: type }))}
                selectProps={{
                  value,
                  placeholder: 'Select TryOn sub-type',
                  onChange,
                }}
                optionsClassName="[&>ul>li>span]:lowercase [&>ul>li>span]:first-letter:capitalize"
                className="[&>div>span]:lowercase [&>div>span]:first-letter:capitalize"
              />
            )}
          />
          <Input
            label="TryOn model"
            register={register('model')}
            error={'model' in errors ? errors.model?.message : undefined}
            inputProps={{
              placeholder: 'Model URL',
            }}
          />

          <Input
            label="TryOn assets"
            register={register('assets.0')}
            error={'assets' in errors ? errors.assets?.message : undefined}
            inputProps={{
              placeholder: 'Asset URL',
            }}
          />
        </>
      )}
    </form>
  );
};

export default AddProductTryOnForm;
