import { MediaCarouselWithParentMedia } from '@/components/layout/carousels/MediaCarouselWithParentMedia';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import { QuillContent } from '@/components/ui/QuillContent';
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
  if (!Object.keys(data).length) return null;
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

const DescriptionAndContent = ({ data }: { data: Props['values']['descriptionAndContent'] }) => {
  if (!Object.keys(data).length) return null;
  const { shortDescription, ...restData } = data;
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title="Basic Information" />
      <KeyValue label="Short description" value={shortDescription} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        {Object.entries(restData).map(([key, content]) => {
          if (!content) return null;
          return (
            <KeyValue
              key={key}
              label={key}
              value={<QuillContent content={content} className="lg:prose-sm!" />}
            />
          );
        })}
      </div>
    </section>
  );
};

const MediaAndGallery = ({ data }: { data: Props['values']['mediaAndGallery'] }) => {
  if (!Object.keys(data).length) return null;
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title="Media and Gallery" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        <KeyValue
          label="Thumbnail"
          value={
            <MediaCarouselWithParentMedia
              media={[{ type: 'image', url: data.thumbnail as string }]}
            />
          }
        />
        <KeyValue
          label={data.images.length > 1 ? 'Images' : 'Image'}
          value={
            <MediaCarouselWithParentMedia
              media={data.images.map((image) => ({ type: 'image', url: image as string }))}
            />
          }
        />
        {data?.video && (
          <KeyValue
            label="Video"
            value={
              <MediaCarouselWithParentMedia
                media={[{ type: 'video', url: data?.video as string }]}
                videoProps={{ autoPlay: false, muted: true, controls: true }}
              />
            }
          />
        )}
      </div>
    </section>
  );
};

const StockAndVariants = ({ data }: { data: Props['values']['stockAndVariants'] }) => {
  if (!Object.keys(data).length) return null;
  const { hasVariants } = data;

  const variants = hasVariants ? data.variants : undefined;
  const stocks = !hasVariants ? data : undefined;
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title={hasVariants ? 'Variants' : 'Stock'} />
      {stocks && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
          <KeyValue label="Stock" value={stocks?.stock} />
          <KeyValue label="Stock Threshold" value={stocks.stockThreshold} />
        </div>
      )}
      {variants &&
        variants.map((variant, index) => (
          <div
            key={index}
            className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6"
          >
            <KeyValue label="Label" value={variant.label} />
            <KeyValue
              label={variant.type === 'Color' ? 'Color' : 'Value'}
              value={
                variant.type === 'Color' ? (
                  <div style={{ backgroundColor: variant.value }} className="w-fit px-5 py-2" />
                ) : (
                  variant.value
                )
              }
            />
            <KeyValue label="Stock" value={variant?.stock} />
            <KeyValue label="Stock Threshold" value={variant.stockThreshold} />
            <KeyValue
              label="Selling Price"
              value={formatINRCurrency(variant.sellingPrice)}
              className="[&>div]:text-primary-green"
            />
            <KeyValue label="Original Price" value={formatINRCurrency(variant.originalPrice)} />
            {variant.thumbnail && (
              <KeyValue
                label="Thumbnail"
                value={
                  <MediaCarouselWithParentMedia
                    media={[{ type: 'image', url: variant.thumbnail as string }]}
                  />
                }
              />
            )}
            <KeyValue
              label={variant.images.length > 1 ? 'Images' : 'Image'}
              value={
                <MediaCarouselWithParentMedia
                  media={variant.images.map((image) => ({ type: 'image', url: image as string }))}
                />
              }
            />
          </div>
        ))}
    </section>
  );
};

const TryOnConfiguration = ({ data }: { data: Props['values']['tryOnConfiguration'] }) => {
  if (!Object.keys(data).length || !data.enabled || !data.tryon) return null;

  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <div className="flex items-center justify-between gap-4">
        <Heading title="Try-On" />
        <Button pattern="secondary" content="Try-On" className="w-fit! rounded-md py-2.5!" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        <KeyValue label="Category" value={data.tryon.category} />
        <KeyValue label="Sub-Category" value={data.tryon.subCategory} />
      </div>
    </section>
  );
};

const AddProductConfirmFieldAndReview = ({ values, form }: Props) => {
  const {
    basicInfo,
    mediaAndGallery,
    descriptionAndContent,
    stockAndVariants,
    tryOnConfiguration,
  } = values;
  return (
    <div className="grid gap-4">
      <BasicInfo data={basicInfo} />
      <MediaAndGallery data={mediaAndGallery} />
      <DescriptionAndContent data={descriptionAndContent} />
      <StockAndVariants data={stockAndVariants} />
      <TryOnConfiguration data={tryOnConfiguration} />
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
