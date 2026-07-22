import type {
  categorySchema,
  l1CategorySchema,
  l2CategorySchema,
  l3CategorySchema,
} from '@/schemas/category.schema';
import type {
  productBasicInfoSchema,
  productDescriptionAndContentSchema,
  productMediaAndGallerySchema,
  productStockAndVariantsSchema,
  productTryOnConfigurationSchema,
  withVariantsSchema,
  withoutVariantsSchema,
} from '@/schemas/product.schema';
import type { confirmDetailsSchema } from '@/schemas/shared.schema';
import type { infer as zodInfer } from 'zod';

export type TConfirmDetails = zodInfer<typeof confirmDetailsSchema>;

/* ================ USER SCHEMA TYPES ================ */

/* ================ CATEGORY SCHEMA TYPES ================ */
export type TL1CategoryForm = zodInfer<typeof l1CategorySchema>;

export type TL2CategoryForm = zodInfer<typeof l2CategorySchema>;

export type TL3CategoryForm = zodInfer<typeof l3CategorySchema>;

export type TCategoryForm = zodInfer<typeof categorySchema>;

/* ================ PRODUCT SCHEMA TYPES ================ */
export type TProductBasicInfo = zodInfer<typeof productBasicInfoSchema>;

export type TProductMediaAndGallery = zodInfer<typeof productMediaAndGallerySchema>;

export type TProductDescriptionAndContent = zodInfer<typeof productDescriptionAndContentSchema>;

export type TProductWithVariant = zodInfer<typeof withVariantsSchema>;

export type TProductWithoutVariant = zodInfer<typeof withoutVariantsSchema>;

export type TProductStockAndVariants = zodInfer<typeof productStockAndVariantsSchema>;

export type TProductTryOnConfiguration = zodInfer<typeof productTryOnConfigurationSchema>;

export interface TDraftProduct {
  basicInfo: TProductBasicInfo;
  mediaAndGallery: TProductMediaAndGallery;
  descriptionAndContent: TProductDescriptionAndContent;
  stockAndVariants: TProductStockAndVariants;
  tryOnConfiguration: TProductTryOnConfiguration;
}
