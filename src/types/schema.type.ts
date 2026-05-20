import type {
  addProductSchema,
  categorySchema,
  level1CategorySchema,
  level2CategorySchema,
  level3CategorySchema,
} from '@/schemas/product.schema';
import type {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  otpSchema,
  passwordsSchema,
} from '@/schemas/user.schema';
import type { infer as zodInfer } from 'zod';

export type TOtp = zodInfer<typeof otpSchema>;

export type TEmail = zodInfer<typeof emailSchema>;

export type TPasswords = zodInfer<typeof passwordsSchema>;

export type TChangePassword = zodInfer<typeof changePasswordSchema>;

export type TLogin = zodInfer<typeof loginSchema>;

export type TAddProduct = zodInfer<typeof addProductSchema>;

export type TLevel1Category = zodInfer<typeof level1CategorySchema>;

export type TLevel2Category = zodInfer<typeof level2CategorySchema>;

export type TLevel3Category = zodInfer<typeof level3CategorySchema>;

export type TCategory = zodInfer<typeof categorySchema>;
