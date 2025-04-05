import * as yup from "yup";

// export const shadeSchema = yup.object({
//   shadeName: yup.string().required("Shade name is required"),
//   colorCode: yup
//     .string()
//     .matches(
//       /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
//       "Enter a valid hex color"
//     )
//     .required("Color code is required"),
//   stock: yup
//     .number()
//     .typeError("Stock must be a number")
//     .min(5, "Stock must be at least 5")
//     .max(100, "Stock cannot exceed 100")
//     .integer("Stock must be an integer")
//     .required("Stock is required"),
//   images: yup
//     .array()
//     .of(
//       yup
//         .mixed<File>()
//         .test("fileType", "Only image files are allowed", (value) =>
//           value
//             ? ["image/jpeg", "image/png", "image/webp"].includes(value.type)
//             : false
//         )
//     )
//     .min(1, "At least one image is required")
//     .required("Images are required"),
// });

export const shadeSchema = yup.object().shape({
  shadeName: yup.string().required("Shade name is required"),
  colorCode: yup.string().required("Color is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  images: yup
    .array()
    .of(yup.mixed())
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
