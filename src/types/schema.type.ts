import type {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  otpSchema,
  passwordsSchema,
} from '@/schemas/user.schema';
import type { addCategorySchema, addProductSchema } from '@/schemas/product.schema';
import type { infer as zodInfer } from 'zod';

export type TOtp = zodInfer<typeof otpSchema>;

export type TEmail = zodInfer<typeof emailSchema>;

export type TPasswords = zodInfer<typeof passwordsSchema>;

export type TChangePassword = zodInfer<typeof changePasswordSchema>;

export type TLogin = zodInfer<typeof loginSchema>;

export type TAddProduct = zodInfer<typeof addProductSchema>;

export type TAddCategory = zodInfer<typeof addCategorySchema>;
