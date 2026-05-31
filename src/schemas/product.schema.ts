import {
  FILE_EXTENSIONS,
  FILE_MIME,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  PRODUCT_TYPE,
  PRODUCT_TYPE_MAP,
  VARIANT_TYPE,
  VARIANT_TYPE_MAP,
} from '@/constants/common.constants';
import { REGEX } from '@/constants/regex.constants';
import { formatFileSize } from '@/utils/common.util';
import {
  array,
  boolean,
  custom,
  literal,
  number,
  object,
  string,
  union,
  url,
  enum as z_enum,
  instanceof as z_instanceof,
} from 'zod';

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

  originalPrice: number({ error: 'Original price is required.' }).min(
    1,
    'Original price must be greater than 0.',
  ),
  sellingPrice: number({ error: 'Selling price is required.' })
    .min(0, 'Selling price cannot be negative.')
    .optional(),
  l1Category: string({ error: '(L1) Main category is required.' }).regex(
    REGEX.MONGODB_ID,
    '(L1) Main category must be a valid ID.',
  ),
  l2Category: string({ error: '(L2) Sub-category is required.' }).regex(
    REGEX.MONGODB_ID,
    '(L2) Sub-category must be a valid ID.',
  ),
  l3Category: string({ error: '(L3) Product category is required.' }).regex(
    REGEX.MONGODB_ID,
    '(L3) Product category must be a valid ID.',
  ),
}).refine((data) => !data.sellingPrice || data.sellingPrice <= data.originalPrice, {
  path: ['sellingPrice'],
  message: 'Selling price cannot be greater than original price.',
});

/* -------------------------------------------------------------------------- */
/*                       STEP 2 : CATEGORY & INVENTORY                        */
/* -------------------------------------------------------------------------- */

// export const productCategoryInventorySchema = object({
//   l1Category: string().min(1, '(L1) Main category is required.'),
//   l2Category: string().min(1, '(L2) Sub-category is required.'),
//   l3Category: string().min(1, '(L3) Product category is required.'),
//   stock: number().min(0, 'Stock cannot be negative.'),
// });

/* -------------------------------------------------------------------------- */
/*                           STEP 3 : MEDIA & GALLERY                         */
/* -------------------------------------------------------------------------- */

export const thumbnailSchema = custom<File | string>((value) => !!value, {
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

export const videoSchema = custom<File | string>((value) => !!value, {
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

export const imagesSchema = array(
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

export const productMediaSchema = object({
  thumbnail: thumbnailSchema,
  images: imagesSchema,
  video: videoSchema.optional(),
});

/* -------------------------------------------------------------------------- */
/*                     STEP 4 : DESCRIPTION & DETAILS                         */
/* -------------------------------------------------------------------------- */

export const productDescriptionSchema = object({
  shortDescription: string('Short description is required.')
    .min(10, 'Short description must be at least 10 characters.')
    .max(300, 'Short description cannot exceed 300 characters.'),
  description: string('Description is required.')
    .refine((value) => value !== '<p><br></p>', 'Description is required.')
    .min(107, 'Description must be at least 100 characters.'),
  instructions: string().min(20, 'Usage instructions must be at least 10 characters.').optional(),
  ingredients: string().min(20, 'Ingredients must be at least 10 characters.').optional(),
  additional: string().min(20, 'Additional details must be at least 10 characters.').optional(),
});

/* -------------------------------------------------------------------------- */
/*                  STEP 5 : VARIANTS & SPECIFICATIONS                        */
/* -------------------------------------------------------------------------- */

export const productVariantsSchema = object({
  productType: z_enum(PRODUCT_TYPE, { error: 'Product type is required.' }),
  variants: array(
    object({
      type: z_enum(VARIANT_TYPE, { error: 'Variant type is required.' }),

      label: string({ error: 'Variant label is required.' })
        .min(1, 'Variant label is required.')
        .min(2, 'Variant label must be at least 2 characters.')
        .max(100, 'Variant label cannot exceed 100 characters.'),

      value: string({ error: 'Variant value is required.' }).min(1, 'Variant value is required.'),

      originalPrice: number({
        error: 'Original price is required.',
      }).min(1, 'Original price must be greater than 0.'),

      sellingPrice: number({
        error: 'Selling price is required.',
      }).min(1, 'Selling price must be greater than 0.'),

      stock: number({
        error: 'Stock is required.',
      })
        .min(1, 'Stock must be greater than 0.')
        .max(100, 'Stock cannot exceed 100.'),
      stockThreshold: number({
        error: 'Stock threshold is required.',
      })
        .min(1, 'Stock threshold must be greater than 0.')
        .max(10, 'Stock threshold cannot exceed 10.'),
      thumbnail: union([
        z_instanceof(File).superRefine((file, ctx) => {
          if (file.size > MAX_IMAGE_FILE_SIZE) {
            ctx.addIssue({
              code: 'custom',
              message: `Thumbnail size is ${formatFileSize(file.size)}. Max allowed size is ${formatFileSize(MAX_IMAGE_FILE_SIZE)}.`,
            });
          }
          const fileTypes: readonly string[] = FILE_MIME.image;
          if (!fileTypes.includes(file.type)) {
            ctx.addIssue({
              code: 'custom',
              message: `Thumbnail type must be one of: ${FILE_EXTENSIONS.image.join(', ')}.`,
            });
          }
        }),
        url({
          message: 'Invalid thumbnail URL.',
          normalize: true,
          pattern: REGEX.URL,
        }),
      ])
        .optional()
        .superRefine((value, ctx) => {
          if (!value) {
            ctx.addIssue({
              code: 'custom',
              message: 'Thumbnail is required.',
            });
          }
        }),
      images: array(
        union([
          z_instanceof(File),
          url({
            message: 'Invalid image URL.',
            normalize: true,
            pattern: REGEX.URL,
          }),
        ]),
        {
          error: 'At least one image is required.',
        },
      )
        .min(1, 'At least one image is required.')
        .max(10, 'Maximum of 10 images are allowed.')
        .superRefine((items, ctx) => {
          items.forEach((item, index) => {
            const imageLabel = `Image ${index + 1}`;

            if (item instanceof File) {
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
    }),
  ).optional(),
}).superRefine((data, ctx) => {
  if (
    data.productType === PRODUCT_TYPE_MAP.VARIABLE &&
    (!data.variants || data.variants.length === 0)
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'At least 1 variant is required.',
    });
  }
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
