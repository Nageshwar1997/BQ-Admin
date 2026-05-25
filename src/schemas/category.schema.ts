import { CATEGORY_LEVELS, CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import {
  DESCRIPTION_OPTIONS,
  MAIN_CATEGORY_OPTIONS,
  SUB_CATEGORY_OPTIONS,
} from '@/constants/zod.constantss';
import { validateNumber, validateString } from '@/utils/zod.util';
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
  activeStep: validateNumber({
    field: 'activeStep',
    label: 'Active step',
    min: 0,
    max: 1,
    isPositive: false,
    isInt: true,
  }),
  level: union(
    CATEGORY_LEVELS.map((level) =>
      literal(level, { message: `Category level must be ${CATEGORY_LEVELS.join('/')}.` }),
    ),
    { error: 'Category level is required.' },
  ),
  name: validateString({ field: 'name', label: 'Category name', min: 2, max: 120 }),
  mainCategory: validateString({ ...MAIN_CATEGORY_OPTIONS, nonEmpty: false }).optional(),
  subCategory: validateString({ ...SUB_CATEGORY_OPTIONS, nonEmpty: false }).optional(),
  description: validateString({ ...DESCRIPTION_OPTIONS, nonEmpty: false }).optional(),
});

/* -------------------------------------------------------------------------- */
/*                               LEVEL 1 SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const l1CategorySchema = baseCategorySchema.extend({
  level: literal(CATEGORY_LEVELS_MAP.L1),
});

/* -------------------------------------------------------------------------- */
/*                               LEVEL 2 SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const l2CategorySchema = baseCategorySchema.extend({
  level: literal(CATEGORY_LEVELS_MAP.L2),

  mainCategory: validateString(MAIN_CATEGORY_OPTIONS),
});

/* -------------------------------------------------------------------------- */
/*                               LEVEL 3 SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const l3CategorySchema = baseCategorySchema.extend({
  level: literal(CATEGORY_LEVELS_MAP.L3),
  mainCategory: validateString(MAIN_CATEGORY_OPTIONS),
  subCategory: validateString(SUB_CATEGORY_OPTIONS),
  description: validateString(DESCRIPTION_OPTIONS),
});

/* -------------------------------------------------------------------------- */
/*                              COMBINED SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const categorySchema = union([
  l1CategorySchema,
  l2CategorySchema,
  l3CategorySchema,
]);

/* -------------------------------------------------------------------------- */
/*                              CONFIRM DETAILS SCHEMA                               */
/* -------------------------------------------------------------------------- */

export const confirmDetailsSchema = object({
  confirm: boolean().refine(Boolean, 'Please confirm details before saving.'),
});
