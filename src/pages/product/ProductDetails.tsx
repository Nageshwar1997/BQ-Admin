// import usePathParams from '@/hooks/usePathParams';

import PageWrapper from '@/components/layout/containers/PageWrapper';
import type { TApiProductPopulated } from '@/types/api.type';

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
  ],
  thumbnail:
    'https://res.cloudinary.com/dqp7b3we7/image/upload/f_auto,q_auto/v1781770758/Beautinique/Images/Testing/2026/06/18/57817127-4c5f-4590-aeaf-383e81db6713.png',
  category: {
    name: 'Matte Lipstick',
    _id: "Test ",
    level: 3,
    description: "Description",
    parent: "parent",
    slug: "slug"
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

  return <PageWrapper>
    <div className="flex gap-8 border">
      {/* LEFT SECTION */}
      <div className="w-full">Left</div>
      {/* RIGHT SECTION */}
      <div className="w-full">Right</div>
    </div>
  </PageWrapper>;
};

export default ProductDetails;
