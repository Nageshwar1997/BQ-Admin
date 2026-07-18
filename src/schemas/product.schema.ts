import { formatFileSize } from '@/utils/common.util';
import {
  FILE_FORMAT,
  FILE_MIME,
  MAX_SIZE,
  MB,
  REGEX,
  TRY_ON_CATEGORY_MAP,
  TRY_ON_MAP,
  VARIANT_TYPES,
  VARIANT_TYPES_MAP,
} from '@beautinique/shared-constants';
import {
  array,
  custom,
  discriminatedUnion,
  file,
  literal,
  number,
  object,
  string,
  union,
  url,
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
      _id: string({ error: '(L1) Main category is required.' }).regex(
        REGEX.MONGODB_ID,
        '(L1) Main category must be a valid ID.',
      ),
      name: string({ error: '(L1) Main category is required.' }),
    },
    { error: '(L1) Main category is required.' },
  ),

  l2Category: object(
    {
      _id: string({ error: '(L2) Sub-category is required.' }).regex(
        REGEX.MONGODB_ID,
        '(L2) Sub-category must be a valid ID.',
      ),
      name: string({ error: '(L2) Sub-category is required.' }),
    },
    { error: '(L2) Sub-category is required.' },
  ),

  l3Category: object(
    {
      _id: string({ error: '(L3) Product category is required.' }).regex(
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

const thumbnailFileSchema = file('Thumbnail is required')
  .mime(
    [...FILE_MIME.image],
    `Invalid thumbnail type. type must be one of: ${FILE_FORMAT.image.join(', ')}.`,
  )
  .max(
    MAX_SIZE.IMAGE,
    `Thumbnail size exceed. Max allowed thumbnail size is ${formatFileSize(MAX_SIZE.IMAGE)}.`,
  );

const thumbnailUrlSchema = url('Thumbnail is required').regex(REGEX.URL, 'Invalid thumbnail URL.');

const videoFileSchema = file('Thumbnail is required')
  .mime(
    [...FILE_MIME.video],
    `Invalid video type. type must be one of: ${FILE_FORMAT.video.join(', ')}.`,
  )
  .max(
    MAX_SIZE.VIDEO,
    `Video size exceed. Max allowed video size is ${formatFileSize(MAX_SIZE.VIDEO)}.`,
  );

const videoUrlSchema = url('Video is required').regex(REGEX.URL, 'Invalid video URL.');

const imageFileSchema = file('Thumbnail is required')
  .mime(
    [...FILE_MIME.image],
    `Invalid image type. type must be one of: ${FILE_FORMAT.image.join(', ')}.`,
  )
  .max(0.3 * MB, `image size exceed. Max allowed image size is ${formatFileSize(0.3 * MB)}.`);

const imageUrlSchema = url('Image is required').regex(REGEX.URL, 'Invalid image URL.');

const imagesSchema = array(union([imageFileSchema, imageUrlSchema]), 'Images are required.')
  .min(1, { message: 'At least one image is required.' })
  .max(10, { message: 'Maximum of 10 images are allowed.' });

export const productMediaAndGallerySchema = object({
  thumbnail: union([thumbnailFileSchema, thumbnailUrlSchema], 'Thumbnail is required'),
  images: imagesSchema,
  video: union([videoFileSchema, videoUrlSchema]).optional(),
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
  type: z_enum(VARIANT_TYPES, { error: 'Variant type is required.' }),

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
        if (value.size > MAX_SIZE.IMAGE) {
          ctx.addIssue({
            code: 'custom',
            message: `Variant thumbnail size is ${formatFileSize(value.size)}. Max allowed size is ${formatFileSize(MAX_SIZE.IMAGE)}.`,
          });
        }

        const fileTypes: readonly string[] = FILE_MIME.image;

        if (!fileTypes.includes(value.type)) {
          ctx.addIssue({
            code: 'custom',
            message: `Variant thumbnail type must be one of: ${FILE_FORMAT.image.join(', ')}.`,
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
          if (item.size > MAX_SIZE.IMAGE) {
            ctx.addIssue({
              code: 'custom',
              path: [index],
              message: `${imageLabel} size is ${formatFileSize(item.size)}. Max allowed size is ${formatFileSize(MAX_SIZE.IMAGE)}.`,
            });
          }

          const fileTypes: readonly string[] = FILE_MIME.image;

          if (!fileTypes.includes(item.type)) {
            ctx.addIssue({
              code: 'custom',
              path: [index],
              message: `${imageLabel} type must be one of: ${FILE_FORMAT.image.join(', ')}.`,
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

  if (data.type === VARIANT_TYPES_MAP.Color && data.value) {
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

  if (data.type === VARIANT_TYPES_MAP.Text && data.value) {
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
  'category',
  [
    object({
      category: literal(TRY_ON_CATEGORY_MAP.LIP),
      subCategory: z_enum(TRY_ON_MAP[TRY_ON_CATEGORY_MAP.LIP], {
        error: `TryOn sub-category is required.`,
      }),
    }),

    object({
      category: literal(TRY_ON_CATEGORY_MAP.EYE),
      subCategory: z_enum(TRY_ON_MAP[TRY_ON_CATEGORY_MAP.EYE], {
        error: `TryOn sub-category is required.`,
      }),
    }),

    object({
      category: literal(TRY_ON_CATEGORY_MAP.HAIR),
      subCategory: z_enum(TRY_ON_MAP[TRY_ON_CATEGORY_MAP.HAIR], {
        error: `TryOn sub-category is required.`,
      }),
    }),

    object({
      category: literal(TRY_ON_CATEGORY_MAP.FACE),
      subCategory: z_enum(TRY_ON_MAP[TRY_ON_CATEGORY_MAP.FACE], {
        error: `TryOn sub-category is required.`,
      }),
    }),

    object({
      category: literal(TRY_ON_CATEGORY_MAP.NAIL),
      subCategory: z_enum(TRY_ON_MAP[TRY_ON_CATEGORY_MAP.NAIL], {
        error: `TryOn sub-category is required.`,
      }),
    }),

    object({
      category: literal(TRY_ON_CATEGORY_MAP.SKIN),
      subCategory: z_enum(TRY_ON_MAP[TRY_ON_CATEGORY_MAP.SKIN], {
        error: `TryOn sub-category is required.`,
      }),
    }),
  ],
  { error: 'TryOn category is required.' },
);

export const productTryOnConfigurationSchema = discriminatedUnion(
  'enabled',
  [
    object({ enabled: literal(false), tryOn: enabledTryOnSchema.optional() }),
    object({ enabled: literal(true), tryOn: enabledTryOnSchema }),
  ],
  { error: 'TryOn is required.' },
);
