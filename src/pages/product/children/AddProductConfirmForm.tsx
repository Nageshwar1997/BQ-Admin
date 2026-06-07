import Checkbox from '@/components/ui/inputs/Checkbox';
import type {
  TConfirmDetails,
  TProductBasicInfo,
  TProductDescriptionAndContent,
  TProductMediaAndGallery,
  TProductStockAndVariants,
  TProductTryOnConfiguration,
} from '@/types/schema.type';
import { type UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<TConfirmDetails>;
  values: {
    basicInfo: TProductBasicInfo;
    mediaAndGallery: TProductMediaAndGallery;
    descriptionAndContent: TProductDescriptionAndContent;
    stockAndVariants: TProductStockAndVariants;
    tryOnConfiguration: TProductTryOnConfiguration;
  };
};

const AddProductConfirmForm = ({ values: _, form }: Props) => {
  return (
    <div className="grid gap-4">
      <Checkbox
        register={form.register('confirm')}
        error={form.formState.errors.confirm?.message}
        content="I confirm the product details are correct"
        checkboxProps={{ name: 'confirm' }}
      />
    </div>
  );
};

export default AddProductConfirmForm;
