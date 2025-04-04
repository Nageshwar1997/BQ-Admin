import { TextItem, LoginInputMapDataProps } from "../../../types";

export const LoginTextContent: TextItem[] = [
  {
    text: "Login",
    isHighlighted: true,
  },
];

export const loginInputMapData: LoginInputMapDataProps[] = [
  {
    name: "email",
    label: "Email",
    type: "text",
    autoComplete: "email",
    placeholder: "Enter your email address",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "number",
    autoComplete: "tel",
    placeholder: "Enter your phone number",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Enter your password",
  },
];
