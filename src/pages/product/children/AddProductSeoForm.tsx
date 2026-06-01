import Input from '@/components/ui/inputs/Input';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { productSeoSchema } from '@/schemas/product.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TProductSeo } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const AddProductSeoForm = ({
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
  } = useForm<TProductSeo>({
    resolver: zodResolver(productSeoSchema),
  });

  const onSubmit = (data: TProductSeo) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    onNext();
  };

  return (
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[step]}
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <Input
        label="SEO title"
        register={register('seoTitle')}
        error={errors.seoTitle?.message}
        inputProps={{
          placeholder: 'SEO title',
        }}
      />

      <Input
        label="SEO description"
        register={register('seoDescription')}
        error={errors.seoDescription?.message}
        inputProps={{
          placeholder: 'SEO description',
        }}
      />

      <Input
        label="SEO keyword"
        register={register('seoKeywords.0')}
        error={errors.seoKeywords?.message}
        inputProps={{
          placeholder: 'Keyword',
        }}
      />
    </form>
  );
};

export default AddProductSeoForm;
