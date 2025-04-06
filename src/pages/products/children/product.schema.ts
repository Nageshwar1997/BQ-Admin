import * as yup from "yup";
import { ShadeType } from "../../../types";

export const shadeSchema: yup.ObjectSchema<ShadeType> = yup.object({
  shadeName: yup
    .string()
    .required("Shade name is required")
    .matches(/^(?!.*\s{2,}).*$/, "Only one space is allowed between words"),
  colorCode: yup
    .string()
    .matches(
      /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
      "Invalid HEX color code"
    )
    .matches(/^[^\s]*$/, "Spaces are not allowed")
    .required("Color code is required"),
  // stock: yup
  //   .number()
  //   .typeError("Stock must be a number")
  //   .required("Stock is required")
  //   .min(0, "Stock cannot be negative")
  //   .max(100, "Stock cannot exceed 100"),
  stock: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .typeError("Stock must be a number")
    .required("Stock is required")
    .min(0, "Stock cannot be negative")
    .max(100, "Stock cannot exceed 100"),
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
    .required("Images are required"),
});

export const productSchema = yup.object({
  title: yup.string().required("Title is required"),
  brand: yup.string().required("Brand is required"),
  category1: yup.string().required("Category 1 is required"),
  category2: yup.string().required("Category 2 is required"),
  category3: yup.string().required("Category 3 is required"),
  originalPrice: yup
    .number()
    .typeError("Original price must be a number")
    .required("Original price is required"),
  sellingPrice: yup
    .number()
    .typeError("Selling price must be a number")
    .required("Selling price is required"),
  shades: yup.array().of(shadeSchema).min(1, "At least one shade is required"),
});
