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
