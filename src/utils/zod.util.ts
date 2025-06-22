import z from "zod";
import { regexes } from "../constants";
import {
  ZodOptionalStringConfigs,
  ZodRequiredStringConfigs,
  TZodRegex,
  ZodCompareConfigs,
  ZodRequiredNumberConfigs,
  ZodOptionalNumberConfigs,
} from "../types/zod.types";

export const getZodNumberMessages = (
  props: ZodCompareConfigs & { field: string }
) => {
  const { field, min, max } = props;
  return {
    required: `${field} is required.`,
    invalid_type: `${field} must be a number.`,
    nonNegative: `${field} must be a non-negative number.`,
    mustBeInt: `${field} must be an integer.`,
    min: `${field} must be at least ${min}.`,
    max: `${field} must not exceed ${max}.`,
  };
};

export const getZodStringMessages = (
  props: ZodCompareConfigs & { field: string }
) => {
  const { field, min, max } = props;
  return {
    required: `${field} is required.`,
    invalid_type: `${field} must be a string.`,
    non_empty: `${field} cannot be empty.`,
    min: `${field} must be at least ${min} characters.`,
    max: `${field} must not exceed ${max} characters.`,
    multiple_spaces: `${field} must not contain multiple consecutive spaces.`,
    single_space: `${field} must not contain any spaces.`,
    custom: `${field} `,
  };
};

export const zodStringOptional = ({
  field,
  showingFieldName,
  showingParentFieldName,
  nonEmpty = true,
  min,
  max,
  blockSingleSpace,
  blockMultipleSpaces,
  parentField,
  customRegexes,
}: ZodOptionalStringConfigs) => {
  const readableField = showingFieldName ?? field;
  const readableParent = showingParentFieldName ?? parentField;

  const nestedField = readableParent
    ? `${readableParent}${
        readableParent.includes("[") ? " " : ": "
      }${readableField}`
    : readableField;
  const messages = getZodStringMessages({ field: nestedField, min, max });

  const schema = z
    .string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined || val === null || val === "") return;

      if (typeof val !== "string") {
        return ctx.addIssue({
          code: "custom",
          message: messages.invalid_type,
        });
      }

      if (nonEmpty && val.trim().length === 0) {
        ctx.addIssue({ code: "custom", message: messages.non_empty });
      }

      if (nonEmpty && min !== undefined && val.length < min) {
        ctx.addIssue({ code: "custom", message: messages.min });
      }

      if (nonEmpty && max !== undefined && val.length > max) {
        ctx.addIssue({ code: "custom", message: messages.max });
      }

      if (blockMultipleSpaces && !regexes.singleSpace.test(val)) {
        ctx.addIssue({ code: "custom", message: messages.multiple_spaces });
      }

      if (blockSingleSpace && !regexes.noSpace.test(val)) {
        ctx.addIssue({ code: "custom", message: messages.single_space });
      }

      if (customRegexes?.length) {
        customRegexes.forEach(
          ({ regex, message }: { regex: RegExp; message: string }) => {
            if (!regex.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: `${messages.custom} ${message}.`,
              });
            }
          }
        );
      }
    });

  return schema;
};

export const zodStringRequired = ({
  field,
  showingFieldName,
  showingParentFieldName,
  nonEmpty = true,
  min,
  max,
  blockSingleSpace,
  blockMultipleSpaces,
  parentField,
  customRegexes,
}: ZodRequiredStringConfigs) => {
  const readableField = showingFieldName ?? field;
  const readableParent = showingParentFieldName ?? parentField;

  const nestedField = readableParent
    ? `${readableParent}${
        readableParent.includes("[") ? " " : ": "
      }${readableField}`
    : readableField;

  const messages = getZodStringMessages({ field: nestedField, min, max });

  let schema = z
    .string({
      required_error: messages.required,
      invalid_type_error: messages.invalid_type,
    })
    .trim()
    .min(1, messages.required);

  if (nonEmpty) {
    schema = schema.nonempty({ message: messages.non_empty });
  }

  if (nonEmpty && min !== undefined) {
    schema = schema.min(min, messages.min);
  }

  if (nonEmpty && max !== undefined) {
    schema = schema.max(max, messages.max);
  }

  if (blockMultipleSpaces) {
    schema = schema.regex(regexes.singleSpace, messages.multiple_spaces);
  }

  if (blockSingleSpace) {
    schema = schema.regex(regexes.noSpace, messages.single_space);
  }

  if (customRegexes?.length) {
    customRegexes.forEach(({ regex, message }: TZodRegex) => {
      schema = schema.regex(regex, `${messages.custom} ${message}.`);
    });
  }

  return schema;
};

export const zodNumberRequired = ({
  field,
  parentField,
  showingFieldName,
  showingParentFieldName,
  min,
  max,
  mustBeInt = false,
  nonNegative = true,
}: ZodRequiredNumberConfigs) => {
  const readableField = showingFieldName ?? field;
  const readableParent = showingParentFieldName ?? parentField;

  const nestedField = readableParent
    ? `${readableParent}${
        readableParent.includes("[") ? " " : ": "
      }${readableField}`
    : readableField;

  const messages = getZodNumberMessages({ field: nestedField, min, max });

  const schema = z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === "" || val === null || val === undefined)
        return { value: NaN, reason: "required" };
      const num = Number(val);
      return isNaN(num)
        ? { value: NaN, reason: "invalid" }
        : { value: num, reason: null };
    })
    .superRefine(({ value, reason }, ctx) => {
      if (isNaN(value)) {
        ctx.addIssue({
          code: "custom",
          message:
            reason === "required" ? messages.required : messages.invalid_type,
        });
        return;
      }

      if (nonNegative && value < 0) {
        ctx.addIssue({
          code: "custom",
          message: messages.nonNegative,
        });
      }

      if (mustBeInt && !Number.isInteger(value)) {
        ctx.addIssue({
          code: "custom",
          message: messages.mustBeInt,
        });
      }

      if (min !== undefined && value < min) {
        ctx.addIssue({
          code: "custom",
          message: messages.min,
        });
      }

      if (max !== undefined && value > max) {
        ctx.addIssue({
          code: "custom",
          message: messages.max,
        });
      }
    })
    .transform(({ value }) => value);

  return schema;
};

export const zodNumberOptional = ({
  field,
  parentField,
  showingFieldName,
  showingParentFieldName,
  min,
  max,
  mustBeInt = false,
  nonNegative = true,
}: ZodOptionalNumberConfigs) => {
  const readableField = showingFieldName ?? field;
  const readableParent = showingParentFieldName ?? parentField;

  const nestedField = readableParent
    ? `${readableParent}${
        readableParent.includes("[") ? " " : ": "
      }${readableField}`
    : readableField;

  const messages = getZodNumberMessages({ field: nestedField, min, max });

  const schema = z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const coerced = Number(val);
      return isNaN(coerced) ? val : coerced;
    })
    .superRefine((val, ctx) => {
      // agar undefined hai to optional valid hai — skip
      if (val === undefined) return;

      // Agar still NaN hai (invalid string input), error do
      if (typeof val !== "number" || isNaN(val)) {
        ctx.addIssue({
          code: "custom",
          message: messages.invalid_type,
        });
        return;
      }

      if (nonNegative && val < 0) {
        ctx.addIssue({
          code: "custom",
          message: messages.nonNegative,
        });
      }

      if (mustBeInt && !Number.isInteger(val)) {
        ctx.addIssue({
          code: "custom",
          message: messages.mustBeInt,
        });
      }

      if (min !== undefined && val < min) {
        ctx.addIssue({
          code: "custom",
          message: messages.min,
        });
      }

      if (max !== undefined && val > max) {
        ctx.addIssue({
          code: "custom",
          message: messages.max,
        });
      }
    });

  return schema;
};
