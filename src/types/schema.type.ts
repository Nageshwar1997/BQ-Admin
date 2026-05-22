import type {
  addProductSchema,
  categorySchema,
  confirmDetailsSchema,
  l1CategorySchema,
  l2CategorySchema,
  l3CategorySchema,
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

export type TL1Category = zodInfer<typeof l1CategorySchema>;

export type TL2Category = zodInfer<typeof l2CategorySchema>;

export type TL3Category = zodInfer<typeof l3CategorySchema>;

export type TCategory = zodInfer<typeof categorySchema>;

export type TConfirmDetails = zodInfer<typeof confirmDetailsSchema>;
