import Checkbox from '@/components/ui/inputs/Checkbox';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { confirmDetailsSchema } from '@/schemas/shared.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TConfirmDetails } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const AddProductConfirmForm = ({
  onNext,
  step,
}: {
  onNext: () => void;
  step: TAddProductStepNumber;
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TConfirmDetails>({
    resolver: zodResolver(confirmDetailsSchema),
  });

  const onSubmit = (data: TConfirmDetails) => {
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
        register={register('confirm')}
        error={errors.confirm?.message}
        content="I confirm the product details are correct"
        checkboxProps={{ name: 'confirm' }}
      />
    </form>
  );
};

export default AddProductConfirmForm;
