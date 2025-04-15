import { ProductType, ShadeType } from "../../../types";

export const shadeInitialValue: ShadeType = {
  shadeName: "",
  colorCode: "",
  stock: null,
  images: [],
};

export const productInitialValues: ProductType = {
  title: "",
  brand: "",
  description: "",
  howToUse: "",
  ingredients: "",
  additionalDetails: "",
  categoryLevelOne: "",
  categoryLevelTwo: "",
  categoryLevelThree: "",
  totalStock: null,
  originalPrice: null,
  sellingPrice: null,
  shades: [],
};
