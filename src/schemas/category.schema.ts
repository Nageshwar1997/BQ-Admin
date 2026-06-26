import { CATEGORY_STEPPER_STEP_COUNT } from '@/constants/common.constants';
import { CATEGORY_LEVELS_MAP, REGEX } from '@beautinique/shared-constants';
import { literal, object, string, union } from 'zod';

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
