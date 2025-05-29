import { RefObject } from "react";
import CryptoJS from "crypto-js";
import Quill from "quill";
import { v4 as uuidv4 } from "uuid";
import { envs } from "../envs";
import { MB, regexes } from "../constants";
import { toastErrorMessage } from "./toasts";
import { z } from "zod";
import {
  TZodRegex,
  ZodOptionalStringConfigs,
  ZodRequiredStringConfigs,
} from "../types/zod.types";

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, envs.ENCRYPTION_SECRET_KEY).toString();
};

export const saveUserLocal = (data: string) => {
  removeUserSession();
  localStorage.setItem("admin_token", encryptData(JSON.stringify(data)));
};

export const saveUserSession = (data: string) => {
  removeUserLocal();
  sessionStorage.setItem("admin_token", encryptData(JSON.stringify(data)));
};

export const removeUserLocal = () => {
  localStorage.removeItem("admin_token");
};

export const removeUserSession = () => {
  sessionStorage.removeItem("admin_token");
};

export const getAdminToken = () => {
  const admin_token =
    localStorage.getItem("admin_token") ||
    sessionStorage.getItem("admin_token");

  if (!admin_token) {
    throw new Error("No Token found");
  }

  return JSON.parse(
    CryptoJS.AES.decrypt(admin_token, envs.ENCRYPTION_SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    )
  );
};

export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300
): ((...args: Args) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const addBlobUrlToImage = (
  quill: Quill,
  blobUrlsRef: RefObject<string[]>
) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file size (2MB max)
    if (file.size > 2 * MB) {
      toastErrorMessage("Image size must be under 2MB!");
      return;
    }

    const blobUrl = URL.createObjectURL(file);

    const range = quill.getSelection();
    if (!range) return;

    blobUrlsRef.current?.push(blobUrl);

    quill.insertEmbed(range.index, "image", blobUrl, "user");

    quill.setSelection(range.index + 1);
  };
};

export function addIdsToHeadings(quill: Quill, options: { enable: boolean }) {
  if (!options.enable) return;

  const processHeadings = () => {
    const headings = quill.container.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading: Element) => {
      if (heading.id) return;
      heading.id = uuidv4();
    });
  };

  const debouncedProcess = debounce(processHeadings, 200);
  quill.on("text-change", debouncedProcess);
}

export const removeUnusedBlobUrls = (
  quill: Quill,
  blobUrlsRef: RefObject<string[]>
) => {
  const editorImages = Array.from(quill.root.querySelectorAll("img")).map(
    (img) => img.getAttribute("src")
  );

  const removedBlobUrls = blobUrlsRef.current?.filter(
    (url) => !editorImages.includes(url)
  );

  removedBlobUrls?.forEach((url) => URL.revokeObjectURL(url));

  if (blobUrlsRef.current) {
    const filteredUrls = blobUrlsRef.current.filter((url) =>
      editorImages.includes(url)
    );
    blobUrlsRef.current.length = 0; // clear old
    blobUrlsRef.current.push(...filteredUrls); // add new
  }
};

export const toINRCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

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

  const messages = {
    required: `${nestedField} is required.`,
    invalid_type: `${nestedField} must be a string.`,
    non_empty: `${nestedField} cannot be empty.`,
    min: `${nestedField} must be at least ${min} characters.`,
    max: `${nestedField} must not exceed ${max} characters.`,
    multiple_spaces: `${nestedField} must not contain multiple consecutive spaces.`,
    single_space: `${nestedField} must not contain any spaces.`,
    custom: `${nestedField} `,
  };

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

  const messages = {
    required: `${nestedField} is required.`,
    invalid_type: `${nestedField} must be a string.`,
    non_empty: `${nestedField} cannot be empty.`,
    min: `${nestedField} must be at least ${min} characters.`,
    max: `${nestedField} must not exceed ${max} characters.`,
    multiple_spaces: `${nestedField} must not contain multiple consecutive spaces.`,
    single_space: `${nestedField} must not contain any spaces.`,
    custom: `${nestedField} `,
  };

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
