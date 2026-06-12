import type {
  addProductSchema,
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
import type {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  otpSchema,
  passwordsSchema,
} from '@/schemas/user.schema';
import type { infer as zodInfer } from 'zod';

export type TConfirmDetails = zodInfer<typeof confirmDetailsSchema>;

/* ================ USER SCHEMA TYPES ================ */
export type TOtp = zodInfer<typeof otpSchema>;

export type TEmail = zodInfer<typeof emailSchema>;

export type TPasswords = zodInfer<typeof passwordsSchema>;

export type TChangePassword = zodInfer<typeof changePasswordSchema>;

export type TLogin = zodInfer<typeof loginSchema>;
// TODO: Remove it later
export type TAddProduct = zodInfer<typeof addProductSchema>;

/* ================ CATEGORY SCHEMA TYPES ================ */
export type TL1Category = zodInfer<typeof l1CategorySchema>;

export type TL2Category = zodInfer<typeof l2CategorySchema>;

export type TL3Category = zodInfer<typeof l3CategorySchema>;

export type TCategory = zodInfer<typeof categorySchema>;

/* ================ PRODUCT SCHEMA TYPES ================ */
export type TProductBasicInfo = zodInfer<typeof productBasicInfoSchema>;

export type TProductMediaAndGallery = zodInfer<typeof productMediaAndGallerySchema>;

export type TProductDescriptionAndContent = zodInfer<typeof productDescriptionAndContentSchema>;

export type TProductWithVariant = zodInfer<typeof withVariantsSchema>;

export type TProductWithoutVariant = zodInfer<typeof withoutVariantsSchema>;

export type TProductStockAndVariants = zodInfer<typeof productStockAndVariantsSchema>;

export type TProductTryOnConfiguration = zodInfer<typeof productTryOnConfigurationSchema>;
