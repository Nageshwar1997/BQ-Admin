import {
  FILE_EXTENSIONS,
  FILE_MIME,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  MB,
  PRODUCT_TYPE,
  PRODUCT_TYPE_MAP,
} from '@/constants/common.constants';
import { REGEX } from '@/constants/regex.constants';
import {
  array,
  boolean,
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
  productType: z_enum(PRODUCT_TYPE, { error: 'Product type is required.' }),
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

const sizeFormat = (size: number) => {
  const value = size / MB;

  return `${Number.isInteger(value) ? value : value.toFixed(2)}MB`;
};

export const thumbnailSchema = union([
  z_instanceof(File).superRefine((file, ctx) => {
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      ctx.addIssue({
        code: 'custom',
        message: `Thumbnail size is ${sizeFormat(file.size)}. Max allowed size is ${sizeFormat(MAX_IMAGE_FILE_SIZE)}.`,
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
  });

export const videoSchema = union([
  z_instanceof(File).superRefine((file, ctx) => {
    if (file.size > MAX_VIDEO_FILE_SIZE) {
      ctx.addIssue({
        code: 'custom',
        message: `Video size is ${sizeFormat(file.size)}. Max allowed size is ${sizeFormat(MAX_VIDEO_FILE_SIZE)}.`,
      });
    }
    const fileTypes: readonly string[] = FILE_MIME.video;
    if (!fileTypes.includes(file.type)) {
      ctx.addIssue({
        code: 'custom',
        message: `Video type must be one of: ${FILE_EXTENSIONS.video.join(', ')}.`,
      });
    }
  }),
  url({
    message: 'Invalid video URL.',
    normalize: true,
    pattern: REGEX.URL,
  }),
]);

export const imageItemSchema = union([
  z_instanceof(File),
  url({
    message: 'Invalid image URL.',
    normalize: true,
    pattern: REGEX.URL,
  }),
]);

export const imagesSchema = array(
  union([
    z_instanceof(File),
    url({ message: 'Invalid image URL.', normalize: true, pattern: REGEX.URL }),
  ]),
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
        }

        return;
      }

      if (item instanceof File) {
        if (item.size > MAX_IMAGE_FILE_SIZE) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `${imageLabel} size is ${sizeFormat(item.size)}. Max allowed size is ${sizeFormat(MAX_IMAGE_FILE_SIZE)}.`,
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
  });

const baseVariantSchema = object({
  type: z_enum(['color', 'text']),

  label: string({ error: 'Variant label is required.' }).min(1, 'Variant label is required.'),

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

  thumbnail: union([
    z_instanceof(File).superRefine((file, ctx) => {
      if (file.size > MAX_IMAGE_FILE_SIZE) {
        ctx.addIssue({
          code: 'custom',
          message: `Thumbnail size is ${sizeFormat(file.size)}. Max allowed size is ${sizeFormat(MAX_IMAGE_FILE_SIZE)}.`,
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
              message: `${imageLabel} size is ${sizeFormat(item.size)}. Max allowed size is ${sizeFormat(MAX_IMAGE_FILE_SIZE)}.`,
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
});

export const productMediaSchema = object({
  thumbnail: thumbnailSchema,
  images: imagesSchema,
  video: videoSchema.optional(),

  productType: z_enum(PRODUCT_TYPE, {
    error: 'Product type is required.',
  }),

  baseVariant: baseVariantSchema.optional(),

  variants: array(baseVariantSchema).optional(),
}).superRefine((data, ctx) => {
  if (data.productType === PRODUCT_TYPE_MAP.SIMPLE) {
    return;
  }

  if (!data.baseVariant) {
    ctx.addIssue({
      code: 'custom',
      path: ['baseVariant'],
      message: 'Base variant is required.',
    });
  }

  if (!data.variants?.length) {
    ctx.addIssue({
      code: 'custom',
      path: ['variants'],
      message: 'At least one variant is required.',
    });
  }
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

export const productVariantsSchema = object({
  variants: array(
    object({
      type: z_enum(['color', 'text']),

      label: string(),

      value: string(),

      originalPrice: number({ error: 'Original price is required.' }).min(
        1,
        'Original price must be greater than 0.',
      ),
      sellingPrice: number({ error: 'Selling price is required.' })
        .min(0, 'Selling price cannot be negative.')
        .optional(),
      stock: number().min(0, 'Stock cannot be negative.'),

      images: array(string()).optional(),
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

      if (data.type === 'color') {
        if (!data.label) {
          ctx.addIssue({
            code: 'custom',
            path: ['label'],
            message: 'Color label is required.',
          });
        } else {
          if (data.label.length < 2) {
            ctx.addIssue({
              code: 'custom',
              path: ['label'],
              message: 'Color label must be at least 2 characters.',
            });
          }

          if (data.label.length > 50) {
            ctx.addIssue({
              code: 'custom',
              path: ['label'],
              message: 'Color label cannot exceed 50 characters.',
            });
          }
        }

        const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(data.value);

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

      if (data.type === 'text') {
        if (!data.value.trim()) {
          ctx.addIssue({
            code: 'custom',
            path: ['value'],
            message: 'Variant value is required.',
          });
        }

        if (data.value.length < 1) {
          ctx.addIssue({
            code: 'custom',
            path: ['value'],
            message: 'Variant value must be at least 1 character.',
          });
        }

        if (data.value.length > 50) {
          ctx.addIssue({
            code: 'custom',
            path: ['value'],
            message: 'Variant value cannot exceed 50 characters.',
          });
        }
      }
    }),
  ).min(1, 'At least one variant is required.'),
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
