import {
  ChangeEvent,
  HTMLInputAutoCompleteAttribute,
  KeyboardEvent,
  ReactNode,
  SVGProps,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type ThemeType = "light" | "dark";

export type CloudinaryConfigOptionType = "image" | "video" | "product";

export type ThemeStoreType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export interface QueryParams {
  [key: string]: string;
}

export interface InputProps {
  type?: string;
  name?: string;
  value?: string;
  label?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  errorText?: string;
  className?: string;
  placeholder?: string;
  successText?: string;
  iconClick?: () => void;
  containerClassName?: string;
  register?: UseFormRegisterReturn;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onKeyDown?: (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
}

export interface TextItem {
  text: string;
  isHighlighted?: boolean;
  break?: boolean;
}

export interface TextDisplayProps {
  content: TextItem[];
  className?: string;
  contentClassName?: string;
}

export type LoginTypes = "email" | "phoneNumber";

export interface LoginFormInputProps {
  loginMethod: LoginTypes;
  email?: string;
  phoneNumber?: string;
  password: string;
  remember?: boolean;
}

export interface LoginInputMapDataProps {
  name: keyof LoginFormInputProps;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export interface RadioProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export interface VerticalScrollType {
  top: boolean;
  bottom: boolean;
}

export interface HorizontalScrollType {
  left: boolean;
  right: boolean;
}

export interface IconType {
  className?: string;
}

export type IconProps = SVGProps<SVGSVGElement>;

export interface UserTypes {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStoreType {
  user: UserTypes | null;
  isAuthenticated: boolean;
  setUser: (user: UserTypes) => void;
  logout: () => void;
}

export interface LevelThreeCategoryType {
  id: number;
  level: number;
  label: string;
  value: string;
}

export interface LevelTwoCategoryType {
  id: number;
  level: number;
  label: string;
  value: string;
  subCategories: LevelThreeCategoryType[];
}

export interface LevelOneCategoryType {
  id: number;
  level: number;
  label: string;
  value: string;
  subCategories: LevelTwoCategoryType[];
}

export interface ShadeType {
  shadeName: string;
  colorCode: string;
  stock: number | undefined;
  images: File[];
}

export interface ProductType {
  title: string;
  brand: string;
  description: string;
  howToUse?: string;
  ingredients?: string;
  additionalDetails?: string;
  categoryLevelOne: string;
  categoryLevelTwo: string;
  categoryLevelThree: string;
  originalPrice: number | undefined;
  sellingPrice: number | undefined;
  totalStock: number | undefined;
  commonImages?: File[];
  shades?: ShadeType[];
}

export type TRegexes =
  | "noSpace"
  | "singleSpace"
  | "hexCode"
  | "date"
  | "name"
  | "password"
  | "email"
  | "phone"
  | "phoneStart"
  | "phoneExactLength"
  | "onlyDigits"
  | "onlyLetters"
  | "onlyUppercase"
  | "onlyLowercase"
  | "atLeastOneDigit"
  | "onlyLettersAndSpaces"
  | "atLeastOneLowercaseLetter"
  | "atLeastOneSpecialCharacter"
  | "atLeastOneUppercaseLetter"
  | "contentAtLeastLength"
  | "onlyLettersAndSpacesAndDots";
