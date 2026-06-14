import { CATEGORY_LEVELS_MAP, CATEGORY_STEPPER_STEP_COUNT } from '@/constants/common.constants';
import { REGEX } from '@/constants/regex.constants';
import { boolean, literal, object, string, union } from 'zod';

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

/* -------------------------------------------------------------------------- */
/*                               COMMON SCHEMA                                */
/* -------------------------------------------------------------------------- */

const baseCategorySchema = object({
  activeStep: union(
    CATEGORY_STEPPER_STEP_COUNT.map((step) =>
      literal(step, { message: `Active step must be ${CATEGORY_STEPPER_STEP_COUNT.join('/')}.` }),
    ),
    { error: 'Category level is required.' },
  ),

  name: string({ error: 'Category name is required.' })
    .nonempty('Category name is required.')
    .min(2, 'Category name must be at least 2 characters.')
    .max(120, 'Category name cannot exceed 120 characters.')
    .regex(REGEX.SINGLE_SPACE, 'Category name cannot contain consecutive spaces.'),

  mainCategory: string({ error: 'Main category is required.' })
    .nonempty('Main category is required.')
    .regex(REGEX.MONGODB_ID, 'Main category must be a valid ID.'),

  subCategory: string({ error: 'Sub-category is required.' })
    .nonempty('Sub-category is required.')
    .regex(REGEX.MONGODB_ID, 'Sub-category must be a valid ID.'),

  description: string({ error: 'Description is required.' })
    .nonempty('Short description is required.')
    .min(10, 'Short description must be at least 10 characters.')
    .max(150, 'Short description cannot exceed 150 characters.')
    .regex(REGEX.SINGLE_SPACE, 'Short description cannot contain consecutive spaces.'),
});

/* -------------------------------------------------------------------------- */
/*                               LEVEL 1 SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const l1CategorySchema = baseCategorySchema.pick({ name: true, activeStep: true }).extend({
  level: literal(CATEGORY_LEVELS_MAP.L1),
});

/* -------------------------------------------------------------------------- */
/*                               LEVEL 2 SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const l2CategorySchema = baseCategorySchema
  .pick({ name: true, activeStep: true, mainCategory: true })
  .extend({ level: literal(CATEGORY_LEVELS_MAP.L2) });

/* -------------------------------------------------------------------------- */
/*                               LEVEL 3 SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const l3CategorySchema = baseCategorySchema
  .pick({ name: true, activeStep: true, mainCategory: true, subCategory: true, description: true })
  .extend({ level: literal(CATEGORY_LEVELS_MAP.L3) });

/* -------------------------------------------------------------------------- */
/*                              COMBINED SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const categorySchema = union([l1CategorySchema, l2CategorySchema, l3CategorySchema]);
