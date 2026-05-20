import { CATEGORY_LEVELS, CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import { REGEX } from '@/constants/regex.constants';
import { appendCustomIssue, validateNumber, validateString } from '@/utils/zod.util';
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
export const categorySchema2 = object({
  activeStep: number('Active step is required.')
    .min(0, 'Active step must be at least 0.')
    .max(1, 'Active step must not exceed 1.'),
  name: string('Category name is required.')
    .min(2, 'Category name must be at least 2 characters.')
    .max(120, 'Category name must not exceed 120 characters.'),
  level: union(
    CATEGORY_LEVELS.map((l) =>
      literal(l, { message: `Category level must be ${CATEGORY_LEVELS.join('/')}.` }),
    ),
    { error: 'Category level is required.' },
  ),
  mainCategory: string('Main category is required.')
    .trim()
    .regex(REGEX.MONGODB_ID, 'Main category must be valid category.')
    .optional(),
  subCategory: string('Sub-category is required.')
    .trim()
    .regex(REGEX.MONGODB_ID, 'Sub-category must be valid category.')
    .optional(),
  description: string('Description is required.')
    .trim()
    .min(10, 'Description must be at least 10 characters.')
    .max(500, 'Description must not exceed 500 characters.')
    .optional(),
  confirmDetails: boolean('Please confirm category details before publishing.'),
}).superRefine((data) => {
  console.log('data', data);
});

export const categorySchema = object({
  activeStep: validateNumber({ field: 'activeStep', label: 'Active step', min: 0, max: 1 }),
  name: validateString({ field: 'name', label: 'Category name', min: 2, max: 120 }),
  level: union(
    CATEGORY_LEVELS.map((l) =>
      literal(l, { message: `Category level must be ${CATEGORY_LEVELS.join('/')}.` }),
    ),
    { error: 'Category level is required.' },
  ),
  mainCategory: validateString({
    field: 'mainCategory',
    label: 'Main category',
    nonEmpty: false,
    customRegex: { regex: REGEX.MONGODB_ID, message: 'must be valid category' },
  })?.optional(),
  subCategory: validateString({
    field: 'subCategory',
    label: 'Sub-category',
    nonEmpty: false,
    customRegex: { regex: REGEX.MONGODB_ID, message: 'must be valid category' },
  })?.optional(),
  description: validateString({
    field: 'description',
    label: 'Description',
    nonEmpty: false,
    min: 10,
    max: 150,
  })?.optional(),
  confirmDetails: boolean().refine(Boolean, 'Please confirm category details before saving.'),
}).superRefine((data, ctx) => {
  const { description, mainCategory, subCategory, level } = data;
  if (level === CATEGORY_LEVELS_MAP.L3) {
    if (!description) {
      appendCustomIssue(
        ctx,
        `Description is required for level ${CATEGORY_LEVELS_MAP.L3} category.`,
        'description',
      );
    }
    if (!mainCategory) {
      appendCustomIssue(
        ctx,
        `Main category is required for level ${CATEGORY_LEVELS_MAP.L3} category.`,
        'mainCategory',
      );
    }
    if (!subCategory) {
      appendCustomIssue(
        ctx,
        `Sub-category is required for level ${CATEGORY_LEVELS_MAP.L3} category.`,
        'subCategory',
      );
    }
  }
  if (level === CATEGORY_LEVELS_MAP.L2) {
    if (!mainCategory) {
      appendCustomIssue(
        ctx,
        `Main category is required for level ${CATEGORY_LEVELS_MAP.L2} category.`,
        'mainCategory',
      );
    }
  }
});
