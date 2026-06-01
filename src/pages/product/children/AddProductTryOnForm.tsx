import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { productTryOnSchema } from '@/schemas/product.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TProductTryOn } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

const AddProductTryOnForm = ({
  onNext,
  step,
}: {
  onNext: () => void;
  step: TAddProductStepNumber;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TProductTryOn>({
    resolver: zodResolver(productTryOnSchema),
  });

  const enableTryOn = useWatch({ control, name: 'enableTryOn' });

  const onSubmit = (data: TProductTryOn) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    onNext();
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
          <Input
            label="TryOn model"
            register={register('model')}
            error={errors.model?.message}
            inputProps={{
              placeholder: 'Model URL',
            }}
          />

          <Input
            label="TryOn assets"
            register={register('assets.0')}
            error={errors.assets?.message}
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
