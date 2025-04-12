import * as yup from "yup";
import { ProductType, ShadeType } from "../../../types";

export const shadeSchema: yup.ObjectSchema<ShadeType> = yup.object({
  shadeName: yup
    .string()
    .required("Shade name is required")
    .matches(/^(?!.*\s{2,}).*$/, "Only one space is allowed between words"),
  colorCode: yup
    .string()
    .required("Color code is required")
    .matches(
      /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
      "Please select or enter a valid color code"
    ),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .required("Stock is required")
    .min(5, "Stock cannot be less than 5")
    .max(100, "Stock cannot be more than 100"),
  images: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .required("File is required")
        .test("file-size", function (value, context) {
          if (value instanceof File && value.size > 2 * 1024 * 1024) {
            const match = context.path?.match(/\d+/);
            const index = match ? parseInt(match[0]) + 1 : null;
            const sizeInMB = (value.size / 1024 / 1024).toFixed(1);

            return this.createError({
              message: index
                ? `Image ${index} is too large (${sizeInMB} MB). Max allowed is 2 MB.`
                : `Image "${value.name}" is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
            });
          }
          return true;
        })
        .test("file-type", function (value, context) {
          if (
            value instanceof File &&
            !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
              value.type
            )
          ) {
            const index = context.path?.match(/\d+/)?.[0] ?? "?";
            return this.createError({
              message: `Image ${index} invalid format (jpeg, png, webp, jpg).`,
            });
          }
          return true;
        })
    )
    .min(1, "At least one image is required")
    .required("At least one image is required"),
});

export const productSchema: yup.ObjectSchema<ProductType> = yup.object({
  title: yup.string().required("Title is required"),
  brand: yup.string().required("Brand is required"),
  description: yup.string().required("Description is required"),
  howToUse: yup.string().optional(),
  ingredients: yup.string().optional(),
  additionalDetails: yup.string().optional(),
  categoryLevelOne: yup.string().required("Category 1 is required"),
  categoryLevelTwo: yup.string().required("Category 2 is required"),
  categoryLevelThree: yup.string().required("Category 3 is required"),
  originalPrice: yup
    .number()
    .required("Original price is required")
    .typeError("Original price must be a number")
    .positive("Original price must be positive")
    .min(1, "Original price cannot be less than 1"),
  sellingPrice: yup
    .number()
    .required("Selling price is required")
    .typeError("Selling price must be a number")
    .positive("Selling price must be positive")
    .min(1, "Selling price cannot be less than 1"),
  commonStock: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .optional()
    .typeError("Stock must be a number")
    .positive("Stock must be positive")
    .test(
      "min-if-present",
      "Stock must be at least 5",
      (value) => value == null || value >= 5
    ),
  shades: yup.array().of(shadeSchema).optional(),
  commonImages: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .required("File is required")
        .test("file-size", function (value, context) {
          if (value instanceof File && value.size > 2 * 1024 * 1024) {
            const match = context.path?.match(/\d+/);
            const index = match ? parseInt(match[0]) + 1 : null;
            const sizeInMB = (value.size / 1024 / 1024).toFixed(1);

            return this.createError({
              message: index
                ? `Image ${index} is too large (${sizeInMB} MB). Max allowed is 2 MB.`
                : `Image "${value.name}" is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
            });
          }
          return true;
        })
        .test("file-type", function (value, context) {
          if (
            value instanceof File &&
            !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
              value.type
            )
          ) {
            const index = context.path?.match(/\d+/)?.[0] ?? "?";
            return this.createError({
              message: `Image ${index} invalid format (jpeg, png, webp, jpg).`,
            });
          }
          return true;
        })
    )
    .min(1, "At least one image is required")
    .required("Images are required"),
});
