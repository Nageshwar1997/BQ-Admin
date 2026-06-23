// import usePathParams from '@/hooks/usePathParams';

import { MediaCarouselWithParentMedia } from '@/components/layout/carousels/MediaCarouselWithParentMedia';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import useQueryParams from '@/hooks/useQueryParams';
import type { TApiProductPopulated } from '@/types/api.type';
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
      sku: 'VEL-MAT-LIP-001-MAR',
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

  const { queryParams, setParams: _, removeParams: __ } = useQueryParams();

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

  return (
    <PageWrapper>
      <div className="flex gap-8">
        {/* LEFT SECTION */}
        <div className="relative w-full">
          <MediaCarouselWithParentMedia media={media} needButtonControls={false} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2">
            <span className="bg-razzle-dazzle-rose-c rounded-full px-2 pt-0.75 pb-0.5 text-sm">
              {(variant?.discount || product.discount).toFixed(
                Number.isInteger(variant?.discount || product.discount) ? 0 : 2,
              )}{' '}
              %
            </span>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="w-full">
          <div>
            <p className="mb-2 text-sm font-medium text-[#999] dark:text-[#bbb]">{product.brand}</p>
            <h1 className="mb-3 text-3xl font-bold text-black md:text-4xl dark:text-white">
              {product.title}
            </h1>
            <p className="text-base text-[#666] dark:text-[#999]">{product.shortDescription}</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductDetails;
