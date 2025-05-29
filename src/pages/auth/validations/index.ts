import { z } from "zod";
import { zodStringOptional, zodStringRequired } from "../../../utils/zod.util";
import { regexes } from "../../../constants";

export const loginZodSchema = z
  .object({
    loginMethod: z.enum(["email", "phoneNumber"]),
    email: zodStringOptional({
      field: "email",
      showingFieldName: "Email",
      blockSingleSpace: true,
      nonEmpty: false,
      customRegexes: [
        {
          regex: regexes.email,
          message: "in an invalid format, e.g. (example@domain.com)",
        },
      ],
    }),
    phoneNumber: zodStringOptional({
      field: "phoneNumber",
      showingFieldName: "Phone number",
      blockSingleSpace: true,
      nonEmpty: false,
      customRegexes: [
        {
          regex: regexes.phoneStart,
          message: "must start with 6, 7, 8, or 9",
        },
        {
          regex: regexes.onlyDigits,
          message: "must contain only digits (0-9)",
        },
        {
          regex: regexes.phoneExactLength,
          message: "must be exactly 10 digits long",
        },
        {
          regex: regexes.phone,
          message:
            "must be a valid Indian number starting with 6, 7, 8, or 9 and be exactly 10 digits long.",
        },
      ],
    }),
    password: zodStringRequired({
      field: "password",
      showingFieldName: "Password",
      blockSingleSpace: true,
      min: 6,
      max: 20,
      customRegexes: [
        {
          regex: regexes.atLeastOneUppercaseLetter,
          message: "must contain at least one uppercase letter",
        },
        {
          regex: regexes.atLeastOneLowercaseLetter,
          message: "must contain at least one lowercase letter",
        },
        {
          regex: regexes.atLeastOneDigit,
          message: "must contain at least one number",
        },
        {
          regex: regexes.atLeastOneSpecialCharacter,
          message: "must contain at least one special character",
        },
      ],
    }),
    remember: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.loginMethod === "email") {
      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Email is required",
        });
      }
    }
    if (data.loginMethod === "phoneNumber") {
      if (!data.phoneNumber || data.phoneNumber.trim() === "") {
        ctx.addIssue({
          path: ["phoneNumber"],
          code: z.ZodIssueCode.custom,
          message: "Phone number is required",
        });
      }
    }
  });
