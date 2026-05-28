import {
  FILE_EXTENSIONS,
  FILE_MIME,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  MB,
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
const sizeFormat = (size: number) => {
  const value = size / MB;

  return `${Number.isInteger(value) ? value : value.toFixed(2)}MB`;
};
const createFileSchema = ({
  maxFileSize,
  mimeTypes,
  extensions,
}: {
  maxFileSize: number;
  mimeTypes: readonly string[];
  extensions: readonly string[];
}) =>
  z_instanceof(File).superRefine((file, ctx) => {
    if (file.size > maxFileSize) {
      ctx.addIssue({
        code: 'custom',
        message: `Selected file size is ${sizeFormat(file.size)}. Max allowed size is ${sizeFormat(maxFileSize)}.`,
      });
    }

    if (!mimeTypes.includes(file.type)) {
      ctx.addIssue({
        code: 'custom',
        message: `File type must be one of: ${extensions.join(', ')}.`,
      });
    }
  });

export const imageFileSchema = createFileSchema({
  maxFileSize: MAX_IMAGE_FILE_SIZE,
  mimeTypes: FILE_MIME.image,
  extensions: FILE_EXTENSIONS.image,
});

export const videoFileSchema = createFileSchema({
  maxFileSize: MAX_VIDEO_FILE_SIZE,
  mimeTypes: FILE_MIME.video,
  extensions: FILE_EXTENSIONS.video,
});

export const thumbnailSchema = union([
  imageFileSchema,
  url({ message: 'Invalid thumbnail URL.', normalize: true, pattern: REGEX.URL }),
])
  .optional()
  .superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: 'custom', message: 'Thumbnail is required.' });
    }
  });

export const videoSchema = union([
  videoFileSchema,
  url({ message: 'Invalid video URL.', normalize: true, pattern: REGEX.URL }),
]);

export const imageItemSchema = union([
  imageFileSchema,
  url({ message: 'Invalid image URL.', normalize: true, pattern: REGEX.URL }),
]);

export const imagesSchema = array(imageItemSchema)
  .min(1, { message: 'At least one image is required.' })
  .superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (typeof item === 'string' && item.trim() === '') {
        ctx.addIssue({ code: 'custom', path: [index], message: 'Image URL cannot be empty.' });
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
