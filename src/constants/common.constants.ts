import type { StepperStep } from '@/components/ui/Stepper';
import type { TApiProductPopulated } from '@/types/api.type';

export const LOADING_RINGS_DATA = [
  {
    border: { side: 'borderBottomWidth', color: 'red' },
    rotation: { rx: 45, ry: -45, z: 0 },
  },
  {
    border: { side: 'borderRightWidth', color: 'green' },
    rotation: { rx: 55, ry: 15, z: 90 },
  },
  {
    border: { side: 'borderTopWidth', color: 'blue' },
    rotation: { rx: 40, ry: 65, z: 180 },
  },
  {
    border: { side: 'borderLeftWidth', color: 'yellow' },
    rotation: { rx: 50, ry: -25, z: 270 },
  },
] as const;

export const BEAUTY_FACTS = [
  `The term <span class=gradient-text-accent>"Clean Beauty"</span> refers to skincare and makeup products made without harmful chemicals and toxins.`,
  `In <span class=gradient-text-accent>"1915"</span>, Maurice Levy invented the first <span class=gradient-text-accent>"twist-up lipstick"</span>, revolutionizing the beauty industry.`,
  `The first-ever commercial mascara, <span class=gradient-text-accent>"Maybelline Cake Mascara"</span>, was introduced in <span class=gradient-text-accent>"1917"</span>.`,
  `<span class=gradient-text-accent>BB Cream (2011)</span> became a global sensation by combining skincare and foundation into one product.`,
  `The first <span class=gradient-text-accent>cruelty-free certification</span> was introduced in <span class=gradient-text-accent>"1996"</span> to support ethical beauty practices.`,
  `<span class=gradient-text-accent>Vegan beauty</span> is on the rise, with brands formulating products without any animal-derived ingredients.`,
  `Dermatologists recommend <span class=gradient-text-accent>SPF 30+</span> for daily sun protection to prevent premature aging and skin damage.`,
  `<span class=gradient-text-accent>Serums</span> contain concentrated active ingredients that penetrate deeper into the skin for enhanced benefits.`,
  `<span class=gradient-text-accent>Micellar Water</span> is a gentle yet effective way to cleanse the skin without rinsing, perfect for all skin types.`,
  `The world's first <span class=gradient-text-accent>organic beauty brand</span> was founded in <span class=gradient-text-accent>1978</span>, paving the way for natural cosmetics.`,
  `Some beauty brands use <span class=gradient-text-accent>AI-powered tools</span> to personalize skincare recommendations based on user preferences.`,
  `<span class=gradient-text-accent>Hyaluronic Acid</span> is a powerful hydrating ingredient that can hold up to 1,000 times its weight in water.`,
  `<span class=gradient-text-accent>Retinol</span> is a dermatologist-approved ingredient known for reducing fine lines and improving skin texture.`,
  `<span class=gradient-text-accent>Green Beauty</span> focuses on sustainable packaging and eco-friendly formulations to reduce environmental impact.`,
  `<span class=gradient-text-accent>Sheet masks</span> originated in Indian and have become a staple in self-care and skincare routines worldwide.`,
  `The global <span class=gradient-text-accent>cosmetic industry</span> is expected to reach <span class=gradient-text-accent>$500 billion</span> by <span class=gradient-text-accent>2026</span>.`,
  `The first-ever <span class=gradient-text-accent>waterproof mascara</span> was developed in <span class=gradient-text-accent>1938</span> and changed the beauty game.`,
  `The first <span class=gradient-text-accent>liquid foundation</span> was launched in the <span class=gradient-text-accent>1950s</span>, offering a more natural finish.`,
  `The term "glass skin" was popularized by <span class=gradient-text-accent>Indian beauty</span> trends, emphasizing dewy, radiant skin.`,
  `The first commercial <span class=gradient-text-accent>lip gloss</span> was introduced by Max Factor in <span class=gradient-text-accent>1930</span>.`,
  `In the early <span class=gradient-text-accent>2000s</span>, mineral makeup became a sought-after trend for its natural ingredients and skin benefits.`,
  `The <span class=gradient-text-accent>Beauty Blender,</span> launched in <span class=gradient-text-accent>2007</span>, transformed the way people applied foundation.`,
  `<span class=gradient-text-accent>Facial oils</span> have gained popularity for their nourishing and hydrating properties, even for oily skin types.`,
  `Some brands are experimenting with <span class=gradient-text-accent>AI makeup try-ons</span> to help users choose the perfect shade before purchasing.`,
  `The concept of a <span class=gradient-text-accent>beauty subscription box</span> allows customers to try new products every month.`,
  `Some experts believe that <span class=gradient-text-accent>customized skincare</span> could be the future of the beauty industry.`,
  'Others caution about potential risks of certain <span class=gradient-text-accent>skincare ingredients,</span> such as parabens and sulfates.',
  `The development of <span class=gradient-text-accent>sustainable beauty</span> aims to reduce plastic waste and promote ethical sourcing.`,
  `Despite trends, timeless beauty practices like <span class=gradient-text-accent>hydration</span> and <span class=gradient-text-accent>healthy eating</span> remain essential for glowing skin.`,
  `The first known use of the term <span class=gradient-text-accent>"cosmeceuticals"</span> was in <span class=gradient-text-accent>1984</span> to describe skincare products with medical benefits.`,
  `<span class=gradient-text-accent>Fermented skincare</span> is gaining popularity for its probiotic benefits that improve skin health.`,
  `<span class=gradient-text-accent>Beauty influencers</span> have a huge impact on the cosmetic industry, shaping trends and product demands.`,
  '<span class=gradient-text-accent>AR beauty</span> apps are helping customers try on makeup virtually before making a purchase.',
  `The concept of <span class=gradient-text-accent>smart skincare devices</span> is transforming beauty routines with AI-powered technology.`,
  'Some companies are developing <span class=gradient-text-accent>biodegradable glitter</span> to make beauty more sustainable.',
  `The future of <span class=gradient-text-accent>clean beauty</span> is focused on transparency, sustainability, and effective formulations.`,
  `The first <span class=gradient-text-accent>fragrance-free makeup line</span> was launched in <span class=gradient-text-accent>1980</span> to cater to sensitive skin.`,
  `The term <span class=gradient-text-accent>dermocosmetics</span> is used for products that bridge the gap between skincare and dermatology.`,
  `The rise of <span class=gradient-text-accent>gender-neutral beauty</span> is redefining the industry with inclusive products for all.`,
  `<span class=gradient-text-accent>Biodegradable packaging</span> is becoming more common in the beauty industry to reduce waste.`,
  `<span class=gradient-text-accent>Refillable makeup</span> is a growing trend that allows users to reuse packaging and minimize waste.`,
  `The first commercial <span class=gradient-text-accent>nail polish</span> was inspired by automobile paint and introduced in <span class=gradient-text-accent>1932</span>.`,
  `The term <span class=gradient-text-accent>"blue beauty"</span> refers to eco-conscious products designed to protect ocean ecosystems.`,
  `<span class=gradient-text-accent>Glass packaging</span> is being used more in luxury beauty to reduce plastic waste and enhance sustainability.`,
];

export const USER_KEY = 'user' as const;

export const ROUTES = {
  DASHBOARD: '/',
  AUTH: {
    BASE: 'auth',
    FORGOT_PASSWORD: 'forgot-password',
    CHANGE_PASSWORD: 'change-password',
  },
  CATEGORIES: { BASE: 'categories' },
  PRODUCTS: {
    BASE: 'products',
    ADD: 'add',
    PRODUCT_ID: ':slug',
    CATEGORY_L1: ':categoryL1',
    CATEGORY_L2: ':categoryL2',
    CATEGORY_L3: ':categoryL3',
  },
  PROFILE: {
    BASE: 'profile',
  },
} as const;

export const TOOLTIP_GAP = 15 as const;
export const TOOLTIP_ANIMATION_DURATION = 400 as const;

export const SIDEBAR_DATA = [
  {
    title: 'Dashboard',
    icon: 'solar:widget-linear',
    path: ROUTES.DASHBOARD,
    handler: null,
  },
  {
    title: 'Profile',
    icon: 'solar:user-circle-linear',
    path: `/${ROUTES.PROFILE.BASE}`,
    handler: null,
  },
  {
    title: 'Categories',
    icon: 'solar:hanger-2-linear',
    path: `/${ROUTES.CATEGORIES.BASE}`,
    handler: null,
  },
  {
    title: 'Products',
    icon: 'solar:box-minimalistic-linear',
    path: `/${ROUTES.PRODUCTS.BASE}`,
    handler: null,
  },
  {
    title: 'Logout',
    icon: 'solar:logout-2-linear',
    handler: 'logout',
  },
] as const;

export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY = [];

export const QUERY_PARAMS_KEY_MAP = {
  category: {
    mode: 'mode', // To Set Mode (Edit or Add)
    add: 'add', // To Open Add Category Modal
    edit: 'edit', // To Open Edit Category Modal
    level: {
      l1: { search: 'search_1', sort: 'sort_1' }, // To Set Filter Query for Level 1 Category
      l2: { search: 'search_2', sort: 'sort_2' }, // To Set Filter Query for Level 2 Category
      l3: { search: 'search_3', sort: 'sort_3' }, // To Set Filter Query for Level 3 Category
    },
  },
  confirm: 'confirm', // To Open Confirm Modal
  sort: 'sort', // To Set Sort Order
} as const;

export const SORT_ORDER_MAP = { asc: 'asc', desc: 'desc' } as const;

export const CATEGORY_MODAL_STEPS: StepperStep[] = [
  { title: 'Category info', description: 'Name and hierarchy', icon: 'solar:hanger-2-linear' },
  {
    title: 'Review',
    description: 'Confirm before save',
    icon: 'solar:checklist-minimalistic-linear',
  },
];

export const ADD_PRODUCT_STEPS: StepperStep[] = [
  {
    title: 'Basic information',
    description: 'Set product title, pricing, brand and category details',
    icon: 'solar:tag-price-linear',
  },
  {
    title: 'Media and gallery',
    description: 'Upload product images, thumbnail and video',
    icon: 'solar:gallery-linear',
  },
  {
    title: 'Description and details',
    description:
      'Add short description, full description, usage instructions, ingredients and additional details',
    icon: 'solar:document-text-linear',
  },
  {
    title: 'Product variants and stock',
    description: 'Set product type and Configure variants, pricing and stock',
    icon: 'solar:list-check-linear',
  },
  {
    title: 'TryOn configuration',
    description: 'Setup TryOn category and configure TryOn details',
    icon: 'solar:face-scan-square-linear',
  },
  {
    title: 'Review and confirm',
    description: 'Verify all details before saving product',
    icon: 'solar:check-circle-linear',
  },
];

export const CATEGORY_LEVELS_MAP = { L1: 1, L2: 2, L3: 3 } as const;
export const CATEGORY_LEVELS = Object.values(CATEGORY_LEVELS_MAP);

export const CATEGORY_STEPPER_STEP_COUNT = [0, 1] as const;

export const KB = 1024;
export const MB = KB * 1024;
export const GB = MB * 1024;

export const MAX_IMAGE_FILE_SIZE = 2 * MB; // 2MB
export const MAX_VIDEO_FILE_SIZE = 50 * MB; // 50MB
export const FILE_MIME = {
  image: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'image/svg+xml',
    'image/avif',
    'image/gif',
    'image/heic',
    'image/heif',
  ],
  video: [
    'video/mp4',
    'video/webm',
    'video/quicktime', // mov
    'video/x-matroska', // mkv
    'video/matroska', // mkv
    'video/ogg', // ogg
    'application/vnd.apple.mpegurl', // m3u8
    'application/x-mpegURL', // m3u8 fallback
  ],
} as const;

export const FILE_EXTENSIONS = {
  image: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg', 'heic', 'heif'],
  video: ['mp4', 'webm', 'mov', 'mkv', 'ogg', 'm3u8'],
} as const;

export const TOAST_TYPES = [
  'success',
  'error',
  'warning',
  'progress',
  'loading',
  'default',
  'custom',
] as const;

export const TOAST_TYPE = Object.fromEntries(TOAST_TYPES.map((type) => [type, type])) as {
  [K in (typeof TOAST_TYPES)[number]]: K;
};

export const VIDEO_PLACEHOLDER = '/images/Video-Placeholder.webp';

export const VARIANT_TYPE_MAP = { COLOR: 'Color', TEXT: 'Text' } as const;

export const VARIANT_TYPE = Object.values(VARIANT_TYPE_MAP);

export const PRODUCT_VARIANT_ACTIONS = [
  { content: 'Remove', className: 'bg-electric-purple-c' },
  { content: 'Clear', className: 'bg-primary-red' },
  { content: 'Add', className: 'bg-primary-yellow' },
] as const;

export const product: TApiProductPopulated = {
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAPf_062JKWOBQr9rKxfyjLtlwzCn6Wwx_fJ6vQDIAgQ&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxrWsdJFvBx8g6CtZnXj9S9xcOtMmEysWTAz1M-HSrxg&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR8Lf_XMIGZBtayJpJNPFmmCALIgEqjfv2qj3bedJAQw&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvgvfPocDqVi-wSk5zVBZlrQyn1wPTbVcNzxCkjuMtsA&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBB4LQTn0vRq4ydPLp-uTj_lEUHOHYWUU18JlCq5KuMw&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrnoeCDSTNv_vdY7dQ3yRL9g0bGCq9ZsTFWUiki63hrQ&s',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwO0wY2zmLQ-AFOwPUfj_GWNfC4AVxIUeIKEocoo0a9g&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRanF6GQIUoXHkdMxSEjn1M0-apMwKj6vkYUvIU_LD41A&s',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXCsW10nAjoXFTDiXZW7Y-fPj9YPUX0aDKyIj-R9lhYw&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcEtgwsl_RXzvDz017Iajjg475FaZTXdUgp5-WP_qZSw&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzJiL2savWoGa11xgA0dE_0XjhbdeZokBLo_dScmZJKg&s=10',
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1QXI4lXK8Rnwo9U39d9W9pitoerhgpnJU1_EkGBspsA&s=10',
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
