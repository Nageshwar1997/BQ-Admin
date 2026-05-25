import type {
  addProductSchema,
  categorySchema,
  l1CategorySchema,
  l2CategorySchema,
  l3CategorySchema,
} from '@/schemas/category.schema';
import type {
  productBasicInfoSchema,
  productCategoryInventorySchema,
  productDescriptionSchema,
  productMediaSchema,
  productSeoSchema,
  productTryOnSchema,
  productVariantsSchema,
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

export type TProductCategoryInventory = zodInfer<typeof productCategoryInventorySchema>;

export type TProductMedia = zodInfer<typeof productMediaSchema>;

export type TProductDescription = zodInfer<typeof productDescriptionSchema>;

export type TProductVariants = zodInfer<typeof productVariantsSchema>;

export type TProductTryOn = zodInfer<typeof productTryOnSchema>;

export type TProductSeo = zodInfer<typeof productSeoSchema>;
