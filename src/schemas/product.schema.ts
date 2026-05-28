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

  price: number().min(1, 'Price must be greater than 0.'),

  discountedPrice: number().min(0, 'Discounted price cannot be negative.').optional(),
}).refine((data) => data.discountedPrice === undefined || data.discountedPrice <= data.price, {
  path: ['discountedPrice'],
  message: 'Discounted price cannot be greater than actual price.',
});

/* -------------------------------------------------------------------------- */
/*                       STEP 2 : CATEGORY & INVENTORY                        */
/* -------------------------------------------------------------------------- */

export const productCategoryInventorySchema = object({
  l1Category: string().min(1, '(L1) Main category is required.'),
  l2Category: string().min(1, '(L2) Sub-category is required.'),
  l3Category: string().min(1, '(L3) Product category is required.'),
  stock: number().min(0, 'Stock cannot be negative.'),
});

/* -------------------------------------------------------------------------- */
/*                           STEP 3 : MEDIA & GALLERY                         */
/* -------------------------------------------------------------------------- */

const IMAGE_MAX_SIZE = 1 * 1024 * 1024;
const VIDEO_MAX_SIZE = 20 * 1024 * 1024;

const formatFileSize = (bytes: number) => {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
};

const mediaArraySchema = array(union([z_instanceof(File), url({ message: 'Invalid URL.' })]));

const validateMedia = (
  value: (File | string)[] | undefined,
  ctx: any,
  {
    type,
    maxSize,
    field,
    required,
  }: {
    type: 'image' | 'video';
    maxSize: number;
    field: string;
    required?: boolean;
  },
) => {
  // Required validation
  if (required && (!value || value.length === 0)) {
    ctx.addIssue({
      code: 'custom',
      message: `At least one ${field} is required.`,
    });

    return;
  }

  if (!value || value.length === 0) return;

  const files = value.filter((item): item is File => item instanceof File);

  files.forEach((file, index) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    // Type validation
    if (type === 'image' && !isImage) {
      ctx.addIssue({
        code: 'custom',
        path: [index],
        message: `File ${index + 1} must be an image.`,
      });

      return;
    }

    if (type === 'video' && !isVideo) {
      ctx.addIssue({
        code: 'custom',
        path: [index],
        message: `File ${index + 1} must be a video.`,
      });

      return;
    }

    // Size validation
    if (file.size > maxSize) {
      ctx.addIssue({
        code: 'custom',
        path: [index],
        message: `${type} ${index + 1} size is ${formatFileSize(
          file.size,
        )}. Maximum allowed size is ${formatFileSize(maxSize)}.`,
      });
    }
  });
};

export const imagesSchema = mediaArraySchema.superRefine((value, ctx) => {
  validateMedia(value, ctx, {
    type: 'image',
    maxSize: IMAGE_MAX_SIZE,
    required: true,
    field: 'images',
  });
});

export const productMediaSchema = object({
  thumbnail: union([z_instanceof(File), url({ message: 'Invalid URL.' })]),
  images: imagesSchema,
  video: union([z_instanceof(File), url({ message: 'Invalid URL.' })]).optional(),
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

      price: number().min(1, 'Price must be greater than 0.'),

      discountedPrice: number().min(0, 'Discounted price cannot be negative.').optional(),

      stock: number().min(0, 'Stock cannot be negative.'),

      images: array(string()).optional(),
    }).superRefine((data, ctx) => {
      /* -------------------------------------------------------------------------- */
      /*                               COMMON CHECKS                                 */
      /* -------------------------------------------------------------------------- */

      if (data.discountedPrice !== undefined && data.discountedPrice > data.price) {
        ctx.addIssue({
          code: 'custom',
          path: ['discountedPrice'],
          message: 'Discounted price cannot be greater than actual price.',
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
