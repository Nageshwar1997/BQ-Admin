import {
  FILE_EXTENSIONS,
  FILE_MIME,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  VARIANT_TYPE,
  VARIANT_TYPE_MAP,
} from '@/constants/common.constants';
import { TRY_ON_MAP, TRYON_TYPE } from '@/constants/form.constants';
import { REGEX } from '@/constants/regex.constants';
import { formatFileSize } from '@/utils/common.util';
import {
  array,
  custom,
  discriminatedUnion,
  literal,
  number,
  object,
  string,
  enum as z_enum,
} from 'zod';

/* -------------------------------------------------------------------------- */
/*                             STEP 1 : BASIC INFO                            */
/* -------------------------------------------------------------------------- */

export const productBasicInfoSchema = object({
  title: string({ error: 'Title is required.' })
    .nonempty('Title is required.')
    .min(2, 'Title must be at least 2 characters.')
    .max(150, 'Title cannot exceed 150 characters.')
    .regex(REGEX.SINGLE_SPACE, 'Title cannot contain consecutive spaces.'),

  brand: string({ error: 'Brand is required.' })
    .nonempty('Brand is required.')
    .min(2, 'Brand must be at least 2 characters.')
    .max(80, 'Brand cannot exceed 80 characters.'),

  originalPrice: number({ error: 'Original price is required.' })
    .nonnegative('Original price cannot be negative.')
    .positive('Original price must be greater than 0.'),

  sellingPrice: number({ error: 'Selling price is required.' })
    .nonnegative('Selling price cannot be negative.')
    .positive('Selling price must be greater than 0.'),

  l1Category: object(
    {
      id: string({ error: '(L1) Main category is required.' }).regex(
        REGEX.MONGODB_ID,
        '(L1) Main category must be a valid ID.',
      ),
      name: string({ error: '(L1) Main category is required.' }),
    },
    { error: '(L1) Main category is required.' },
  ),

  l2Category: object(
    {
      id: string({ error: '(L2) Sub-category is required.' }).regex(
        REGEX.MONGODB_ID,
        '(L2) Sub-category must be a valid ID.',
      ),
      name: string({ error: '(L2) Sub-category is required.' }),
    },
    { error: '(L2) Sub-category is required.' },
  ),

  l3Category: object(
    {
      id: string({ error: '(L3) Product category is required.' }).regex(
        REGEX.MONGODB_ID,
        '(L3) Product category must be a valid ID.',
      ),
      name: string({ error: '(L3) Product category is required.' }),
    },
    { error: '(L3) Product category is required.' },
  ),
}).refine((data) => !data.sellingPrice || data.sellingPrice <= data.originalPrice, {
  path: ['sellingPrice'],
  message: 'Selling price cannot be greater than original price.',
});

/* -------------------------------------------------------------------------- */
/*                           STEP 2 : MEDIA & GALLERY                         */
/* -------------------------------------------------------------------------- */

const thumbnailSchema = custom<File | string>((value) => !!value, {
  error: 'Thumbnail is required.',
}).superRefine((value, ctx) => {
  if (value instanceof File) {
    if (value.size > MAX_IMAGE_FILE_SIZE) {
      ctx.addIssue({
        code: 'custom',
        message: `Thumbnail size is ${formatFileSize(value.size)}. Max allowed size is ${formatFileSize(MAX_IMAGE_FILE_SIZE)}.`,
      });
    }

    const fileTypes: readonly string[] = FILE_MIME.image;

    if (!fileTypes.includes(value.type)) {
      ctx.addIssue({
        code: 'custom',
        message: `Thumbnail type must be one of: ${FILE_EXTENSIONS.image.join(', ')}.`,
      });
    }
  } else if (typeof value === 'string') {
    if (!value.trim()) {
      ctx.addIssue({ code: 'custom', message: 'Thumbnail URL cannot be empty.' });
    } else if (!REGEX.URL.test(value)) {
      ctx.addIssue({ code: 'custom', message: 'Invalid thumbnail URL.' });
    }
  } else {
    ctx.addIssue({ code: 'custom', message: 'Invalid thumbnail.' });
  }
});

const videoSchema = custom<File | string>((value) => !!value, {
  error: 'Video is required.',
}).superRefine((value, ctx) => {
  if (value instanceof File) {
    if (value.size > MAX_VIDEO_FILE_SIZE) {
      ctx.addIssue({
        code: 'custom',
        message: `Video size is ${formatFileSize(value.size)}. Max allowed size is ${formatFileSize(MAX_VIDEO_FILE_SIZE)}.`,
      });
    }

    const fileTypes: readonly string[] = FILE_MIME.video;

    if (!fileTypes.includes(value.type)) {
      ctx.addIssue({
        code: 'custom',
        message: `Video type must be one of: ${FILE_EXTENSIONS.video.join(', ')}.`,
      });
    }
  } else if (typeof value === 'string') {
    if (!value.trim()) {
      ctx.addIssue({ code: 'custom', message: 'Video URL cannot be empty.' });
    } else if (!REGEX.URL.test(value)) {
      ctx.addIssue({ code: 'custom', message: 'Invalid thumbnail URL.' });
    }
  } else {
    ctx.addIssue({ code: 'custom', message: 'Invalid video.' });
  }
});

const imagesSchema = array(
  custom<File | string>((value) => !!value, { error: 'Image is required.' }),
  { error: 'At least one image is required.' },
)
  .min(1, { message: 'At least one image is required.' })
  .max(10, { message: 'Maximum of 10 images are allowed.' })
  .superRefine((items, ctx) => {
    items.forEach((item, index) => {
      const imageLabel = `Image ${index + 1}`;

      if (typeof item === 'string') {
        if (!item.trim()) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `${imageLabel} URL cannot be empty.`,
          });
        } else if (!REGEX.URL.test(item)) {
          ctx.addIssue({ code: 'custom', path: [index], message: `${imageLabel} URL is invalid.` });
        }
      } else if (item instanceof File) {
        if (item.size > MAX_IMAGE_FILE_SIZE) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `${imageLabel} size is ${formatFileSize(item.size)}. Max allowed size is ${formatFileSize(MAX_IMAGE_FILE_SIZE)}.`,
          });
        }

        const fileTypes: readonly string[] = FILE_MIME.image;

        if (!fileTypes.includes(item.type)) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `${imageLabel} type must be one of: ${FILE_EXTENSIONS.image.join(', ')}.`,
          });
        }
      } else {
        ctx.addIssue({ code: 'custom', path: [index], message: `${imageLabel} is invalid.` });
      }
    });
  });

export const productMediaAndGallerySchema = object({
  thumbnail: thumbnailSchema,

  images: imagesSchema,

  video: videoSchema.optional(),
});

/* -------------------------------------------------------------------------- */
/*                     STEP 3 : DESCRIPTION & DETAILS                         */
/* -------------------------------------------------------------------------- */

export const productDescriptionAndContentSchema = object({
  shortDescription: string('Short description is required.')
    .nonempty('Short description is required.')
    .min(10, 'Short description must be at least 10 characters.')
    .max(300, 'Short description cannot exceed 300 characters.'),

  description: string('Description is required.')
    .nonempty('Description is required.')
    .refine((value) => value !== '<p><br></p>', 'Description is required.')
    .min(107, 'Description must be at least 100 characters.'),

  instructions: string()
    .optional()
    .refine(
      (value) =>
        value === undefined || value === '' || value === '<p><br></p>' || value.length >= 20,
      'Usage instructions must be at least 10 characters.',
    ),

  ingredients: string()
    .optional()
    .refine(
      (value) =>
        value === undefined || value === '' || value === '<p><br></p>' || value.length >= 20,
      'Ingredients must be at least 10 characters.',
    ),

  additional: string()
    .optional()
    .refine(
      (value) =>
        value === undefined || value === '' || value === '<p><br></p>' || value.length >= 20,
      'Additional details must be at least 10 characters.',
    ),
});

/* -------------------------------------------------------------------------- */
/*                  STEP 4 : VARIANTS & SPECIFICATIONS                        */
/* -------------------------------------------------------------------------- */

const variantSchema = object({
  type: z_enum(VARIANT_TYPE, { error: 'Variant type is required.' }),

  label: string({ error: 'Variant label is required.' })
    .nonempty('Variant label is required.')
    .min(2, 'Variant label must be at least 2 characters.')
    .max(100, 'Variant label cannot exceed 100 characters.'),

  value: string({ error: 'Variant value is required.' }).nonempty('Variant value is required.'),

  originalPrice: number({ error: 'Original price is required.' })
    .nonnegative('Original price cannot be negative.')
    .positive('Original price must be greater than 0.'),
  sellingPrice: number({ error: 'Selling price is required.' })
    .nonnegative('Selling price cannot be negative.')
    .positive('Selling price must be greater than 0.'),

  stock: number({ error: 'Stock is required' })
    .int('Stock must be a whole number.')
    .min(1, 'Stock must be greater than 0.')
    .max(100, 'Stock cannot exceed 100.'),

  stockThreshold: number({ error: 'Stock threshold is required' })
    .int('Stock threshold must be a whole number.')
    .min(1, 'Stock threshold must be greater than 0.')
    .max(10, 'Stock threshold cannot exceed 10.'),

  thumbnail: custom<File | string>((value) => !!value, { error: 'Variant thumbnail is required.' })
    .superRefine((value, ctx) => {
      if (value instanceof File) {
        if (value.size > MAX_IMAGE_FILE_SIZE) {
          ctx.addIssue({
            code: 'custom',
            message: `Variant thumbnail size is ${formatFileSize(value.size)}. Max allowed size is ${formatFileSize(MAX_IMAGE_FILE_SIZE)}.`,
          });
        }

        const fileTypes: readonly string[] = FILE_MIME.image;

        if (!fileTypes.includes(value.type)) {
          ctx.addIssue({
            code: 'custom',
            message: `Variant thumbnail type must be one of: ${FILE_EXTENSIONS.image.join(', ')}.`,
          });
        }
      } else if (typeof value === 'string') {
        if (!value.trim()) {
          ctx.addIssue({ code: 'custom', message: 'Variant thumbnail URL cannot be empty.' });
        } else if (!REGEX.URL.test(value)) {
          ctx.addIssue({ code: 'custom', message: 'Invalid variant thumbnail URL.' });
        }
      } else {
        ctx.addIssue({ code: 'custom', message: 'Invalid variant thumbnail.' });
      }
    })
    .optional(),

  images: array(
    custom<File | string>((value) => !!value, { error: 'Variant image is required.' }),
    { error: 'At least one variant image is required.' },
  )
    .min(1, { message: 'At least one variant image is required.' })
    .max(10, { message: 'Maximum of 10 variant images are allowed.' })
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        const imageLabel = `Variant-image ${index + 1}`;

        if (typeof item === 'string') {
          if (!item.trim()) {
            ctx.addIssue({
              code: 'custom',
              path: [index],
              message: `${imageLabel} URL cannot be empty.`,
            });
          } else if (!REGEX.URL.test(item)) {
            ctx.addIssue({
              code: 'custom',
              path: [index],
              message: `${imageLabel} URL is invalid.`,
            });
          }
        } else if (item instanceof File) {
          if (item.size > MAX_IMAGE_FILE_SIZE) {
            ctx.addIssue({
              code: 'custom',
              path: [index],
              message: `${imageLabel} size is ${formatFileSize(item.size)}. Max allowed size is ${formatFileSize(MAX_IMAGE_FILE_SIZE)}.`,
            });
          }

          const fileTypes: readonly string[] = FILE_MIME.image;

          if (!fileTypes.includes(item.type)) {
            ctx.addIssue({
              code: 'custom',
              path: [index],
              message: `${imageLabel} type must be one of: ${FILE_EXTENSIONS.image.join(', ')}.`,
            });
          }
        } else {
          ctx.addIssue({ code: 'custom', path: [index], message: `${imageLabel} is invalid.` });
        }
      });
    }),
}).superRefine((data, ctx) => {
  /* -------------------------------------------------------------------------- */
  /*                               COMMON CHECKS                                 */
  /* -------------------------------------------------------------------------- */

  if (data.sellingPrice !== undefined && data.sellingPrice > data.originalPrice) {
    ctx.addIssue({
      code: 'custom',
      path: ['sellingPrice'],
      message: 'Selling price cannot be greater than original price.',
    });
  }

  if (data.stockThreshold >= data.stock) {
    ctx.addIssue({
      code: 'custom',
      path: ['stockThreshold'],
      message: 'Stock threshold must be less than stock.',
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                               COLOR VARIANT                                */
  /* -------------------------------------------------------------------------- */

  if (data.type === VARIANT_TYPE_MAP.COLOR && data.value) {
    const isValidHex = REGEX.HEX_CODE.test(data.value);
    if (!isValidHex) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Invalid hex color code.',
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                TEXT VARIANT                                */
  /* -------------------------------------------------------------------------- */

  if (data.type === VARIANT_TYPE_MAP.TEXT && data.value) {
    if (data.value.trim().length > 50) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Variant value cannot exceed 50 characters.',
      });
    }
    if (data.value.trim().length < 2) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Variant value must be at least 2 character.',
      });
    }
  }
});

export const withoutVariantsSchema = object({
  hasVariants: literal(false),

  stock: number({ error: 'Stock is required' })
    .int('Stock must be a whole number.')
    .min(1, 'Stock must be greater than 0.')
    .max(100, 'Stock cannot exceed 100.'),

  stockThreshold: number({ error: 'Stock threshold is required' })
    .int('Stock threshold must be a whole number.')
    .min(1, 'Stock threshold must be greater than 0.')
    .max(10, 'Stock threshold cannot exceed 10.'),
}).superRefine((data, ctx) => {
  if (data.stockThreshold >= data.stock) {
    ctx.addIssue({
      code: 'custom',
      path: ['stockThreshold'],
      message: 'Stock threshold must be less than stock.',
    });
  }
});

export const withVariantsSchema = object({
  hasVariants: literal(true),

  variants: array(variantSchema, { error: 'At least one variant is required.' })
    .nonempty('At least one variant is required.')
    .min(1, 'Minimum one variant is required.'),
});

export const productStockAndVariantsSchema = discriminatedUnion(
  'hasVariants',
  [withoutVariantsSchema, withVariantsSchema],
  { error: 'Please specify whether product has variants.' },
);

/* -------------------------------------------------------------------------- */
/*                       STEP 5 : TRYON CONFIGURATION                         */
/* -------------------------------------------------------------------------- */

const enabledTryOnSchema = discriminatedUnion(
  'type',
  [
    object({
      type: literal(TRYON_TYPE.LIP),
      subType: z_enum(TRY_ON_MAP[TRYON_TYPE.LIP], { error: `TryOn sub-type is required.` }),
    }),

    object({
      type: literal(TRYON_TYPE.EYE),
      subType: z_enum(TRY_ON_MAP[TRYON_TYPE.EYE], { error: `TryOn sub-type is required.` }),
    }),

    object({
      type: literal(TRYON_TYPE.HAIR),
      subType: z_enum(TRY_ON_MAP[TRYON_TYPE.HAIR], { error: `TryOn sub-type is required.` }),
    }),

    object({
      type: literal(TRYON_TYPE.FACE),
      subType: z_enum(TRY_ON_MAP[TRYON_TYPE.FACE], { error: `TryOn sub-type is required.` }),
    }),

    object({
      type: literal(TRYON_TYPE.NAIL),
      subType: z_enum(TRY_ON_MAP[TRYON_TYPE.NAIL], { error: `TryOn sub-type is required.` }),
    }),

    object({
      type: literal(TRYON_TYPE.SKIN),
      subType: z_enum(TRY_ON_MAP[TRYON_TYPE.SKIN], { error: `TryOn sub-type is required.` }),
    }),
  ],
  { error: 'TryOn type is required.' },
);

export const productTryOnConfigurationSchema = discriminatedUnion(
  'enabled',
  [
    object({ enabled: literal(false) }),
    object({ enabled: literal(true), tryon: enabledTryOnSchema }),
  ],
  { error: 'TryOn is required.' },
);
