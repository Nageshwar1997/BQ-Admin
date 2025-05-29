import { z } from "zod";
import { MB } from "../../../constants";
const MAX_FILE_SIZE = 0.2 * 1024 * 1024; // 2 MB
const ACCEPTED_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const shadeSchema = z.object({
  shadeName: z
    .string({ required_error: "Shade name is required" })
    .min(1, "Shade name is required")
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Only one space is allowed between words",
    }),

  colorCode: z
    .string({ required_error: "Color code is required" })
    .min(1, "Color code is required")
    .regex(
      /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
      "Please select or enter a valid color code"
    ),

  stock: z.coerce
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .min(5, "Stock cannot be less than 5")
    .max(100, "Stock cannot be more than 100"),

  images: z
    .array(z.any())
    .min(1, "At least one image is required")
    .superRefine((files, ctx) => {
      files.forEach((file, index) => {
        // Check if file is actually a File instance
        if (!(file instanceof File)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Item ${index + 1} is not a valid file`,
            path: [index],
          });
          return;
        }

        // File size check
        if (file.size > MAX_FILE_SIZE) {
          const sizeInMB = (file.size / MB).toFixed(1);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
            path: [index],
          });
        }

        // File type check
        if (!ACCEPTED_FORMATS.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } invalid format (jpeg, png, webp, jpg).`,
            path: [index],
          });
        }
      });
    }),
});

export const productSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),
  brand: z
    .string({ required_error: "Brand is required" })
    .min(1, "Brand is required"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  howToUse: z.string().optional(),
  ingredients: z.string().optional(),
  additionalDetails: z.string().optional(),
  categoryLevelOne: z
    .string({ required_error: "Category 1 is required" })
    .min(1, "Category 1 is required"),
  categoryLevelTwo: z
    .string({ required_error: "Category 2 is required" })
    .min(1, "Category 2 is required"),
  categoryLevelThree: z
    .string({ required_error: "Category 3 is required" })
    .min(1, "Category 3 is required"),
  originalPrice: z.coerce
    .number({
      required_error: "Original price is required",
      invalid_type_error: "Original price must be a number",
    })
    .positive("Original price must be positive")
    .min(1, "Original price cannot be less than 1"),
  sellingPrice: z.coerce
    .number({
      required_error: "Selling price is required",
      invalid_type_error: "Selling price must be a number",
    })
    .positive("Selling price must be positive")
    .min(1, "Selling price cannot be less than 1"),
  totalStock: z.coerce
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .min(5, "Stock cannot be less than 5"),
  commonImages: z
    .array(z.any())
    .min(1, "At least one image is required")
    .superRefine((files, ctx) => {
      files.forEach((file, index) => {
        // Check if file is actually a File instance
        if (!(file instanceof File)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Item ${index + 1} is not a valid file`,
            path: [index],
          });
          return;
        }

        // File size check
        if (file.size > MAX_FILE_SIZE) {
          const sizeInMB = (file.size / MB).toFixed(1);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
            path: [index],
          });
        }

        // File type check
        if (!ACCEPTED_FORMATS.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } invalid format (jpeg, png, webp, jpg).`,
            path: [index],
          });
        }
      });
    }),
  shades: z.array(shadeSchema).optional(),
});
