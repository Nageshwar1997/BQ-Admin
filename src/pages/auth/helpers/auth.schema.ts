import * as yup from "yup";

export const loginSchema = yup.object().shape({
  loginMethod: yup.string().oneOf(["email", "phoneNumber"]).required(),
  email: yup.string().when("loginMethod", {
    is: "email",
    then: (schema) =>
      schema
        .email("Invalid email format")
        .required("Email is required")
        .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, {
          message: "Invalid email address",
          excludeEmptyString: true,
        })
        .matches(/^\S*$/, "Email cannot contain spaces"),
    otherwise: (schema) => schema.notRequired(),
  }),
  phoneNumber: yup.string().when("loginMethod", {
    is: "phoneNumber",
    then: (schema) =>
      schema
        .required("Phone number is required")
        .matches(/^[6-9]/, "Mobile number must start with 6, 7, 8, or 9")
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: yup
    .string()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    )
    .matches(/^\S*$/, "Password can't contain spaces")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
  remember: yup.boolean(),
});
