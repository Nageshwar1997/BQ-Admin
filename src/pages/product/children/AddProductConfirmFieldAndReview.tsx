import Checkbox from '@/components/ui/inputs/Checkbox';
import type { TClassName } from '@/types/component.type';
import type {
  TConfirmDetails,
  TProductBasicInfo,
  TProductDescriptionAndContent,
  TProductMediaAndGallery,
  TProductStockAndVariants,
  TProductTryOnConfiguration,
} from '@/types/schema.type';
import { formatINRCurrency } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
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

const Heading = ({ title }: { title: string }) => (
  <div className="text-primary flex items-center gap-2">
    <h4 className="font-semibold">{title}</h4>
    <Icon icon="solar:pen-2-linear" className="[&>g]:stroke-2" />
  </div>
);

const KeyValue = ({
  label,
  value,
  className = '',
}: { label: string; value: string | ReactNode } & TClassName) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-tertiary/70 text-xs font-medium tracking-tight uppercase">{label}</p>
      <div className="text-primary text-sm">{value}</div>
    </div>
  );
};

const BasicInfo = ({ data }: { data: Props['values']['basicInfo'] }) => {
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title="Basic Information" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        <KeyValue label="Title" value={data.title} />
        <KeyValue label="Brand" value={data.brand} />
        <KeyValue
          label="Selling Price"
          value={formatINRCurrency(data.sellingPrice)}
          className="[&>div]:text-primary-green"
        />
        <KeyValue label="Original Price" value={formatINRCurrency(data.originalPrice)} />
        <KeyValue label="Main Category" value={data.l1Category.name} />
        <KeyValue label="Sub-Category" value={data.l2Category.name} />
        <KeyValue label="Product Category" value={data.l3Category.name} />
      </div>
    </section>
  );
};

const MediaAndGallery = ({ data: _ }: { data: Props['values']['mediaAndGallery'] }) => {
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title="Media and Gallery" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        {/* <KeyValue label="Title" value={data.title} />
        <KeyValue label="Brand" value={data.brand} />
        <KeyValue
          label="Selling Price"
          value={formatINRCurrency(data.sellingPrice)}
          className="[&>div]:text-primary-green"
        />
        <KeyValue label="Original Price" value={formatINRCurrency(data.originalPrice)} />
        <KeyValue label="Main Category" value={data.l1CategoryName} />
        <KeyValue label="Sub-Category" value={data.l2CategoryName} />
        <KeyValue label="Product Category" value={data.l3CategoryName} /> */}
      </div>
    </section>
  );
};

const AddProductConfirmFieldAndReview = ({ values, form }: Props) => {
  const { basicInfo, mediaAndGallery } = values;
  console.log('🚀 ~ AddProductConfirmFieldAndReview ~ mediaAndGallery:', mediaAndGallery);
  return (
    <div className="grid gap-4">
      <BasicInfo data={basicInfo} />
      <MediaAndGallery data={mediaAndGallery} />
      <Checkbox
        register={form.register('confirm')}
        error={form.formState.errors.confirm?.message}
        content="I confirm the product details are correct"
        checkboxProps={{ name: 'confirm' }}
      />
    </div>
  );
};

export default AddProductConfirmFieldAndReview;
