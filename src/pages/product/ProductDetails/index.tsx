// import usePathParams from '@/hooks/usePathParams';

import { MediaCarouselWithParentMedia } from '@/components/layout/carousels/MediaCarouselWithParentMedia';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import useQueryParams from '@/hooks/useQueryParams';
import type { TApiProductPopulated } from '@/types/api.type';
import { formatINRCurrency } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';

// import { useGetProductBySlug } from '@/services/product-service/product.service.query';
const product: TApiProductPopulated = {
  _id: '6b1000000000000000000001',
  title: 'Velvet Matte Lipstick',
  sku: 'VEL-MAT-LIP-001',
  brand: 'Beautinique',
  originalPrice: 699,
  sellingPrice: 549,
  discount: 21,
  shortDescription: 'Premium matte lipstick with long lasting bold color.',
  description:
    '<p>Premium matte lipstick with smooth application and intense color payoff for everyday elegance.</p><p><img src="https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781770987/Beautinique/Images/Testing/2026/06/18/614d1910-315c-44a3-9620-7bc26243b420.png"></p>',
  instructions:
    '<p>Apply directly on clean lips for a flawless matte finish.</p><p><img src="https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771118/Beautinique/Images/Testing/2026/06/18/68c41fe4-96e1-44a2-94aa-52395ed768f4.png"></p>',
  ingredients:
    '<p>Vitamin E, Beeswax, Castor Oil, Natural Pigments.</p><p><img src="https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771119/Beautinique/Images/Testing/2026/06/18/8b2a919c-4a5a-4ca9-bb83-402c1b1e07f4.png"></p>',
  additional:
    '<p>Cruelty free and dermatologically tested formula.</p><p><img src="https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771118/Beautinique/Images/Testing/2026/06/18/55490436-901e-4e58-8809-a4b4484b6e2b.png"></p>',
  slug: 'velvet-matte-lipstick',
  images: [
    'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781770767/Beautinique/Images/Testing/2026/06/18/88494140-7a24-45b9-9df0-5830e63efc94.png',
    'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781770767/Beautinique/Images/Testing/2026/06/18/88494140-7a24-45b9-9df0-5830e63efc94.png',
    'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
  ],
  thumbnail:
    'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781770758/Beautinique/Images/Testing/2026/06/18/57817127-4c5f-4590-aeaf-383e81db6713.png',
  category: {
    name: 'Matte Lipstick',
    _id: 'Test ',
    level: 3,
    description: 'Description',
    parent: 'parent',
    slug: 'slug',
  },
  seller: '69f1dbc072e24bc004daa827',
  returnCount: 4,
  reviews: [],
  totalReviews: 145,
  averageRating: 4.8,
  totalRating: 696,
  hasVariants: true,
  variants: [
    {
      sku: 'VEL-MAT-LIP-001-RUB',
      type: 'Color',
      label: 'Ruby Red',
      value: '#C21833',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 60,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-BER',
      type: 'Color',
      label: 'Berry Bliss',
      value: '#9B2E4F',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 45,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-NUD',
      type: 'Color',
      label: 'Nude Silk',
      value: '#C4887D',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 38,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-002-MAR',
      type: 'Color',
      label: 'Maroon Dream',
      value: '#4A1C1C',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 52,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-RUB',
      type: 'Color',
      label: 'Ruby Red',
      value: '#C21833',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 60,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-BER',
      type: 'Color',
      label: 'Berry Bliss',
      value: '#9B2E4F',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 45,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-NUD',
      type: 'Color',
      label: 'Nude Silk',
      value: '#C4887D',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 38,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-003-MAR',
      type: 'Color',
      label: 'Maroon Dream',
      value: '#4A1C1C',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 52,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-RUB',
      type: 'Color',
      label: 'Ruby Red',
      value: '#C21833',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 60,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-BER',
      type: 'Color',
      label: 'Berry Bliss',
      value: '#9B2E4F',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 45,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-NUD',
      type: 'Color',
      label: 'Nude Silk',
      value: '#C4887D',
      originalPrice: 699,
      sellingPrice: 549,
      discount: 21,
      stock: 38,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
    {
      sku: 'VEL-MAT-LIP-001-MAR',
      type: 'Text',
      label: 'Maroon Dream',
      value: '#4A1C1C',
      originalPrice: 100,
      sellingPrice: 90,
      discount: 10,
      stock: 52,
      stockThreshold: 10,
      images: [
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771372/Beautinique/Images/Testing/2026/06/18/b00931cc-b620-4bb2-bba7-fb5ae3a3a94d.png',
      ],
      thumbnail:
        'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781771403/Beautinique/Images/Testing/2026/06/18/2b9d853e-e728-4444-b64c-a97a259409f0.png',
      _id: '6b1000000000000000000101',
    },
  ],
  status: 'PUBLISHED',
  history: {
    approvedBy: '69f1dbc072e24bc004daa827',
    approvedAt: '2026-06-18T14:01:18.278Z',
  },
  tryOn: {
    configured: true,
    enabled: true,
    category: 'LIP',
    subCategory: 'MATTE',
  },
  createdAt: '2026-06-18T14:01:18.391Z',
  updatedAt: '2026-06-18T14:01:18.391Z',
  soldCount: 235,
};
const ProductDetails = () => {
  // const { pathParams } = usePathParams();
  // const { data: product } = useGetProductBySlug(pathParams.slug || '');

  const { queryParams, setParams, removeParams: __ } = useQueryParams();

  const media = useMemo(() => {
    const images = product.images.map((img) => ({ url: img, type: 'image' as const }));

    if (product.video) {
      return [...images, { url: product.video, type: 'video' as const }];
    }

    return images;
  }, [product]);

  const variant = useMemo(() => {
    return product.variants.find((variant) => variant.sku === queryParams.v);
  }, [queryParams.v]);

  const { discount, originalPrice, sellingPrice } = useMemo(() => {
    return {
      discount: variant?.discount || product.discount,
      sellingPrice: variant?.sellingPrice || product.sellingPrice,
      originalPrice: variant?.originalPrice || product.originalPrice,
    };
  }, [variant?.discount, product.discount]);

  return (
    <PageWrapper>
      <div className="flex gap-8">
        {/* LEFT SECTION */}
        <div className="relative w-full">
          <MediaCarouselWithParentMedia media={media} needButtonControls={false} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2">
            <span className="bg-razzle-dazzle-rose-c rounded-full px-2 pt-0.75 pb-0.5 text-sm">
              {discount.toFixed(Number.isInteger(discount) ? 0 : 2)} %
            </span>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex w-full min-w-0 flex-col gap-6">
          <div>
            <p className="text-tertiary mb-1 text-sm font-medium">{product.brand}</p>
            <h1 className="text-primary mb-2 text-3xl font-bold md:text-4xl">{product.title}</h1>
            <p className="text-secondary/80 text-base">{product.shortDescription}</p>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => {
                const fillPercentage = Math.max(
                  0,
                  Math.min(100, (product.averageRating - index) * 100),
                );

                return (
                  <div key={index} className="relative size-5">
                    <Icon
                      icon="solar:star-linear"
                      className="text-silver-jet-2 absolute inset-0 size-5"
                    />

                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fillPercentage}%` }}
                    >
                      <Icon icon="solar:star-bold" className="text-primary-yellow size-5" />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-secondary leading-none font-semibold">
              {product.averageRating}
            </span>
            <span className="text-tertiary text-sm">({product.totalReviews} reviews)</span>
          </div>
          {/* Price */}
          <div className="bg-tertiary-invert/50 rounded-xl p-4">
            <div className="flex items-baseline gap-4">
              <span className="text-razzle-dazzle-rose-c text-4xl font-bold">
                {formatINRCurrency(sellingPrice)}
              </span>
              <span className="text-tertiary/60 text-xl line-through">
                {formatINRCurrency(originalPrice)}
              </span>
            </div>
            <p className="text-jade-c mt-2 text-sm font-medium">
              Save {formatINRCurrency(originalPrice - sellingPrice)} (
              {discount.toFixed(Number.isInteger(discount) ? 0 : 2)}% off)
            </p>
          </div>
          {/* Variants */}
          {product.hasVariants && product.variants.length > 0 && (
            <div className="space-y-2">
              {!!variant && (
                <p className="text-sm">
                  <span className="font-semibold">Variant:</span> {variant.label}
                </p>
              )}
              <ScrollableGradientContainer direction="horizontal" containerClassName="max-h-fit">
                <div className="flex items-center gap-3">
                  {product.variants.map((v, index) => {
                    const isColor = v.type === 'Color';
                    const active = variant?.sku === v.sku;
                    return (
                      <div
                        key={`variant-${index}`}
                        role="button"
                        className={`cursor-pointer text-center text-[11px]/3.5 ${active ? 'text-tertiary' : 'text-tertiary/80'}`}
                        onClick={() => setParams({ v: v.sku })}
                      >
                        {isColor ? (
                          <div className={`flex flex-col items-center gap-1`}>
                            <div
                              className={`size-12 shrink-0 rounded-full border-2 ${active ? 'border-primary' : 'border-primary/30'}`}
                              style={{ backgroundColor: v.value }}
                            />
                            <p className="line-clamp-2 max-w-12 wrap-break-word">{v.label}</p>
                          </div>
                        ) : (
                          <div className={`flex flex-col items-center gap-1`}>
                            <div
                              className={`line-clamp-2 flex h-12 max-w-20 flex-col items-center justify-center rounded-md border-2 px-2 wrap-break-word ${active ? 'border-primary' : 'border-primary/30'}`}
                            >
                              {v.value}
                            </div>
                            <p className="line-clamp-2 max-w-20 wrap-break-word">{v.label}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollableGradientContainer>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductDetails;
