import Quill from "quill";
import { z } from "zod";
import {
  ChangeEvent,
  Dispatch,
  HTMLInputAutoCompleteAttribute,
  JSX,
  KeyboardEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  SVGProps,
} from "react";
import { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import { ToolbarProps } from "quill/modules/toolbar";

export type ThemeType = "light" | "dark";

export type CloudinaryConfigOptionType = "image" | "video" | "product";

export type ThemeStoreType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export interface IQueryParams {
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

export interface CategoryType {
  level: number;
  name: string;
  category: string;
}

export type LevelThreeCategoryType = CategoryType;

export interface LevelTwoCategoryType extends CategoryType {
  subCategories: LevelThreeCategoryType[];
}

export interface LevelOneCategoryType extends CategoryType {
  subCategories: LevelTwoCategoryType[];
}

export interface ShadeType {
  _id?: string;
  shadeName: string;
  colorCode: string;
  stock: number | undefined;
  images: (File | string)[];
}

export interface ProductType {
  title: string;
  brand: string;
  description: string;
  howToUse?: string;
  ingredients?: string;
  additionalDetails?: string;
  categoryLevelOne: { name: string; category: string };
  categoryLevelTwo: { name: string; category: string };
  categoryLevelThree: { name: string; category: string };
  originalPrice: number | undefined;
  sellingPrice: number | undefined;
  totalStock: number | undefined;
  commonImages: (File | string)[];
  shades?: ShadeType[];
}

export interface PopulatedCategory {
  _id: string;
  name: string;
  category: string;
  level: number;
  parentCategory: {
    _id: string;
    name: string;
    category: string;
    level: number;
    parentCategory: {
      _id: string;
      name: string;
      category: string;
      level: number;
    };
  };
}

export interface FetchedProductType extends ProductType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  commonImages: string[];
  discount: number;
  sellingPrice: number;
  originalPrice: number;
  category: PopulatedCategory;
  shades: ShadeType[];
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
  | "onlyLettersAndSpacesAndDots";

export interface IProcessQuillContent<T extends z.ZodTypeAny> {
  quillRef: RefObject<Quill | null>;
  blobUrlsRef: RefObject<string[]>;
  setValue: UseFormSetValue<z.infer<T>>;
  fieldName: keyof ProductType;
  folderName: string;
  cloudinaryConfigOption: CloudinaryConfigOptionType;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

export type ToolbarOption =
  | { header: (1 | 2 | 3 | 4 | 5 | 6 | false)[] }
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | { list: "ordered" | "bullet" }
  | { script: "sub" | "super" }
  | { indent: "-1" | "+1" }
  | { color: string[] } // can be empty for Quill to auto-generate colors
  | { background: string[] }
  | { align: string[] }
  | { direction: "rtl" }
  | "link"
  | "image"
  | "video"
  | "code"
  | "clean";

export type QuillToolbar = (ToolbarOption | ToolbarOption[])[];

export interface IToolBarOptions {
  header?: (1 | 2 | 3 | 4 | 5 | 6 | false)[];
  script?: ("sub" | "super")[];
  indent?: ("-1" | "+1")[];
  color?: boolean;
  background?: boolean;
  align?: boolean;
  direction?: "rtl";
  text?: ("bold" | "italic" | "underline" | "strike" | "link")[];
  list?: ("ordered" | "bullet")[];
  media?: ("image" | "video" | "link")[];
  misc?: ("code" | "clean")[];
}

export interface QuillEditorProps {
  label?: string;
  readOnly?: boolean;
  errorText?: string;
  className?: string;
  value?: string;
  needLinkButton?: boolean;
  onChange?: (value: string) => void;
  blobUrlsRef?: RefObject<string[]>;
  placeholder?: string;
  toolbarOptions?: IToolBarOptions;
}

export interface IQuillToolbarExtended extends ToolbarProps {
  handlers: Record<string, (...args: unknown[]) => void>;
}

export type TQuillImageBlot = {
  new (): HTMLElement;
  create(value: unknown): HTMLElement;
  value(node: HTMLElement): unknown;
};

export interface ReviewType {
  rating: number;
  title: string;
  comment: string;
  images: (string | File)[];
  videos: (string | File)[];
  user: string;
}

// export interface PopulatedReviewType extends Omit<ReviewType, "user"> {
//   _id: string;
//   createdAt: string;
//   updatedAt: string;
//   user: Exclude<keyof UserTypes, "password">;
// }

export interface IProductPossibleBodyFields {
  requiredFields?: (keyof FetchedProductType)[];
  populateFields?: {
    shades?: (keyof ShadeType | "images")[];
    seller?: Exclude<keyof UserTypes, "password">[];
    category?: (keyof CategoryType | "parentCategory")[];
    reviews?: (keyof ReviewType | "images" | "videos")[];
  };
}

export interface ModalProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerProps?: JSX.IntrinsicElements["div"];
  heading?: string;
}
