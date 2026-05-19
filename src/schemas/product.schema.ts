import { CATEGORY_LEVELS, CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import { boolean, literal, number, object, string, union } from 'zod';

const requiredText = (field: string, min = 2, max = 100) =>
  string()
    .trim()
    .nonempty(`${field} is required.`)
    .min(min, `${field} must be at least ${min} characters.`)
    .max(max, `${field} must not exceed ${max} characters.`);

const requiredSelect = (field: string) => string().trim().nonempty(`${field} is required.`);

const positiveNumberText = (field: string) =>
  string()
    .trim()
    .nonempty(`${field} is required.`)
    .refine((value) => Number.isFinite(Number(value)), `${field} must be a valid number.`)
    .refine((value) => Number(value) > 0, `${field} must be greater than 0.`);

export const addProductSchema = object({
  title: requiredText('Product name', 3, 120),
  brand: requiredText('Brand name', 2, 80),
  mainCategory: requiredSelect('Main category'),
  subCategory: requiredSelect('Sub-category'),
  productCategory: requiredSelect('Product category'),
  mrp: positiveNumberText('MRP'),
  salePrice: positiveNumberText('Sale price'),
  stock: string()
    .trim()
    .nonempty('Stock is required.')
    .refine((value) => Number.isInteger(Number(value)), 'Stock must be a whole number.')
    .refine((value) => Number(value) > 0, 'Stock must be greater than 0.'),
  imageUrl: string().trim().url('Product image URL must be valid.'),
  confirmDetails: boolean().refine(Boolean, 'Please confirm product details before publishing.'),
}).refine((data) => Number(data.salePrice) <= Number(data.mrp), {
  path: ['salePrice'],
  message: 'Sale price cannot be greater than MRP.',
});
// CATEGORY_LEVELS_MAP.L
export const categorySchema = object({
  activeStep: number(),
  name: requiredText('Category name', 2, 80),
  level: union(
    CATEGORY_LEVELS.map((l) => literal(l)),
    { error: 'Category level is required.' },
  ),
  mainCategory: string().trim(),
  subCategory: string().trim(),
  description: string().trim().optional().nullable(),
  confirmDetails: boolean().refine(Boolean, 'Please confirm category details before saving.'),
})
  .refine((data) => data.level === CATEGORY_LEVELS_MAP.L1 || !!data.mainCategory, {
    path: ['mainCategory'],
    message: `Main category is required for level ${CATEGORY_LEVELS_MAP.L2} and level ${CATEGORY_LEVELS_MAP.L3} categories.`,
  })
  .refine((data) => data.level !== CATEGORY_LEVELS_MAP.L3 || !!data.subCategory, {
    path: ['subCategory'],
    message: `Sub-category is required for level ${CATEGORY_LEVELS_MAP.L3} categories.`,
  })
  .refine(
    (data) =>
      data.level !== CATEGORY_LEVELS_MAP.L3 || (data.description && data.description.length >= 10),
    {
      path: ['description'],
      message: `Description is required for level ${CATEGORY_LEVELS_MAP.L3} categories and must be at least 10 characters.`,
    },
  );
