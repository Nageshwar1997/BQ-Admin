import { ProductType, ShadeType } from "../../../types";

export const shadeInitialValue: ShadeType = {
  shadeName: "",
  colorCode: "",
  stock: undefined,
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
  totalStock: undefined,
  originalPrice: undefined,
  sellingPrice: undefined,
  commonImages: [],
  shades: [],
};
