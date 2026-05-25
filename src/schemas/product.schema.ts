import { array, boolean, discriminatedUnion, literal, number, object, string } from 'zod';

/* -------------------------------------------------------------------------- */
/*                             STEP 1 : BASIC INFO                            */
/* -------------------------------------------------------------------------- */

export const productBasicInfoSchema = object({
  title: string()
    .min(2, 'Title must be at least 2 characters.')
    .max(150, 'Title cannot exceed 150 characters.'),

  brand: string()
    .min(2, 'Brand must be at least 2 characters.')
    .max(80, 'Brand cannot exceed 80 characters.'),

  baseSku: string()
    .min(3, 'Base SKU must be at least 3 characters.')
    .max(50, 'Base SKU cannot exceed 50 characters.'),

  price: number().min(1, 'Price must be greater than 0.'),

  discountedPrice: number().min(0, 'Discounted price cannot be negative.').optional(),
}).refine((data) => data.discountedPrice === undefined || data.discountedPrice <= data.price, {
  path: ['discountedPrice'],
  message: 'Discounted price cannot be greater than actual price.',
});

/* -------------------------------------------------------------------------- */
/*                       STEP 2 : CATEGORY & INVENTORY                        */
/* -------------------------------------------------------------------------- */

export const productCategoryInventorySchema = object({
  mainCategory: string().min(1, 'Main category is required.'),

  subCategory: string(),

  childCategory: string(),

  stock: number().min(0, 'Stock cannot be negative.'),

  lowStockThreshold: number().min(0, 'Low stock threshold cannot be negative.'),

  isPublished: boolean(),
});

/* -------------------------------------------------------------------------- */
/*                           STEP 3 : MEDIA & GALLERY                         */
/* -------------------------------------------------------------------------- */

export const productMediaSchema = object({
  thumbnail: string().min(1, 'Thumbnail is required.'),

  images: array(string()).min(1, 'At least one image is required.'),

  videos: array(string()).optional(),
});

/* -------------------------------------------------------------------------- */
/*                     STEP 4 : DESCRIPTION & DETAILS                         */
/* -------------------------------------------------------------------------- */

export const productDescriptionSchema = object({
  shortDescription: string()
    .min(10, 'Short description must be at least 10 characters.')
    .max(300, 'Short description cannot exceed 300 characters.'),

  description: string()
    .min(20, 'Description must be at least 20 characters.')
    .max(5000, 'Description cannot exceed 5000 characters.'),

  usageInstructions: string().optional(),

  ingredients: string().optional(),
});

/* -------------------------------------------------------------------------- */
/*                  STEP 5 : VARIANTS & SPECIFICATIONS                        */
/* -------------------------------------------------------------------------- */

const colorVariantSchema = object({
  type: literal('color'),

  label: string()
    .min(2, 'Color label must be at least 2 characters.')
    .max(50, 'Color label cannot exceed 50 characters.'),

  value: string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color code.'),

  sku: string()
    .min(3, 'SKU must be at least 3 characters.')
    .max(100, 'SKU cannot exceed 100 characters.'),

  price: number().min(1, 'Price must be greater than 0.'),

  discountedPrice: number().min(0, 'Discounted price cannot be negative.').optional(),

  stock: number().min(0, 'Stock cannot be negative.'),

  images: array(string()).optional(),
}).refine((data) => data.discountedPrice === undefined || data.discountedPrice <= data.price, {
  path: ['discountedPrice'],
  message: 'Discounted price cannot be greater than actual price.',
});

const textVariantSchema = object({
  type: literal('text'),

  value: string()
    .min(1, 'Variant value is required.')
    .max(50, 'Variant value cannot exceed 50 characters.'),

  sku: string()
    .min(3, 'SKU must be at least 3 characters.')
    .max(100, 'SKU cannot exceed 100 characters.'),

  price: number().min(1, 'Price must be greater than 0.'),

  discountedPrice: number().min(0, 'Discounted price cannot be negative.').optional(),

  stock: number().min(0, 'Stock cannot be negative.'),

  images: array(string()).optional(),
}).refine((data) => data.discountedPrice === undefined || data.discountedPrice <= data.price, {
  path: ['discountedPrice'],
  message: 'Discounted price cannot be greater than actual price.',
});

export const productVariantsSchema = object({
  variants: array(discriminatedUnion('type', [colorVariantSchema, textVariantSchema])).min(
    1,
    'At least one variant is required.',
  ),

  specifications: array(
    object({
      key: string()
        .min(1, 'Specification key is required.')
        .max(100, 'Specification key cannot exceed 100 characters.'),

      value: string()
        .min(1, 'Specification value is required.')
        .max(500, 'Specification value cannot exceed 500 characters.'),
    }),
  ).optional(),
});

/* -------------------------------------------------------------------------- */
/*                       STEP 6 : TRYON CONFIGURATION                         */
/* -------------------------------------------------------------------------- */

export const productTryOnSchema = object({
  enableTryOn: boolean(),

  model: string().optional(),

  assets: array(string()).optional(),
});

/* -------------------------------------------------------------------------- */
/*                       STEP 7 : SEO & VISIBILITY                            */
/* -------------------------------------------------------------------------- */

export const productSeoSchema = object({
  seoTitle: string().max(70, 'SEO title cannot exceed 70 characters.').optional(),

  seoDescription: string().max(160, 'SEO description cannot exceed 160 characters.').optional(),

  seoKeywords: array(string()).optional(),
});

/* -------------------------------------------------------------------------- */
/*                      STEP 8 : CONFIRM BEFORE SAVE                          */
/* -------------------------------------------------------------------------- */

export const productConfirmSchema = object({
  confirm: literal(true, {
    message: 'Please confirm details before saving.',
  }),
});
