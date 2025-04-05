import * as yup from "yup";

export const productSchema = yup.object({
  title: yup.string().required("Title is required"),
  brand: yup.string().required("Brand is required"),
  category1: yup.string().required("Category One is required"),
  category2: yup.string().required("Category Two is required"),
  category3: yup.string().required("Category Three is required"),
  originalPrice: yup.number().required("Original Price is required"),
  sellingPrice: yup.number().required("Selling Price is required"),
});

export const shadeSchema = yup.object({
  shadeName: yup.string().required("Shade name is required"),
  colorCode: yup
    .string()
    .matches(
      /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
      "Enter a valid hex color"
    )
    .required("Color code is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(5, "Stock must be at least 5")
    .max(100, "Stock cannot exceed 100")
    .integer("Stock must be an integer")
    .required("Stock is required"),
});
