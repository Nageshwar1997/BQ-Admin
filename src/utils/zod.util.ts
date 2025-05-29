import z from "zod";
import { regexes } from "../constants";
import {
  ZodOptionalStringConfigs,
  ZodRequiredStringConfigs,
  TZodRegex,
  ZodCompareConfigs,
} from "../types/zod.types";

export const getZodMessages = (
  props: ZodCompareConfigs & { field: string }
) => {
  return {
    required: `${props.field} is required.`,
    invalid_type: `${props.field} must be a string.`,
    non_empty: `${props.field} cannot be empty.`,
    min: `${props.field} must be at least ${props.min} characters.`,
    max: `${props.field} must not exceed ${props.max} characters.`,
    multiple_spaces: `${props.field} must not contain multiple consecutive spaces.`,
    single_space: `${props.field} must not contain any spaces.`,
    custom: `${props.field} `,
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
        readableParent.includes("[") ? " " : "."
      }${readableField}`
    : readableField;
  const messages = getZodMessages({ field: nestedField, min, max });

  const schema = z
    .string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined || val === null || val === "") return;

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
        readableParent.includes("[") ? " " : "."
      }${readableField}`
    : readableField;

  const messages = getZodMessages({ field: nestedField, min, max });

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
