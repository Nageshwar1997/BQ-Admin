import { CATEGORY_LEVELS, CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import { REGEX } from '@/constants/regex.constants';
import { appendCustomIssue, validateNumber, validateString } from '@/utils/zod.util';
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
  }).optional(),
  subCategory: validateString({
    field: 'subCategory',
    label: 'Sub-category',
    nonEmpty: false,
    customRegex: { regex: REGEX.MONGODB_ID, message: 'must be valid category' },
  }).optional(),
  description: validateString({
    field: 'description',
    label: 'Description',
    nonEmpty: false,
    min: 10,
    max: 150,
  }).optional(),
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
