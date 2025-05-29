import { z } from "zod";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MB,
  regexes,
} from "../../../constants";
import {
  zodNumberRequired,
  zodStringOptional,
  zodStringRequired,
} from "../../../utils/zod.util";

export const shadeSchema = z.object({
  shadeName: zodStringRequired({
    field: "shadeName",
    showingFieldName: "Shade name",
    blockMultipleSpaces: true,
    min: 2,
    max: 50,
  }),
  colorCode: zodStringRequired({
    field: "colorCode",
    showingFieldName: "Color code",
    blockMultipleSpaces: true,
    min: 4,
    max: 9,
    blockSingleSpace: true,
    customRegexes: [
      { regex: regexes.hexCode, message: "must be a valid hex code" },
    ],
  }),
  stock: zodNumberRequired({
    field: "stock",
    showingFieldName: "Stock",
    min: 5,
    max: 100,
    mustBeInt: true,
    nonNegative: true,
  }),

  images: z
    .array(z.any())
    .min(1, "At least one image is required")
    .superRefine((files, ctx) => {
      files.forEach((file, index) => {
        if (!(file instanceof File)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Item ${index + 1} is not a valid file`,
            path: [index],
          });
          return;
        }

        // File size check
        if (file.size > MAX_IMAGE_FILE_SIZE) {
          const sizeInMB = (file.size / MB).toFixed(1);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
            path: [index],
          });
        }

        // File type check
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } invalid format. Allowed formats: ${ALLOWED_IMAGE_TYPES.map((t) =>
              t.replace("image/", "")
            ).join(", ")}`,
            path: [index],
          });
        }
      });
    }),
});

export const productSchema = z
  .object({
    title: zodStringRequired({
      field: "title",
      showingFieldName: "Title",
      min: 2,
      blockMultipleSpaces: true,
    }),
    brand: zodStringRequired({
      field: "brand",
      showingFieldName: "Brand",
      blockMultipleSpaces: true,
    }),
    description: zodStringRequired({
      field: "description",
      showingFieldName: "Description",
      blockMultipleSpaces: true,
      customRegexes: [
        {
          regex: regexes.contentAtLeastLength,
          message: "must be exactly 10 characters long",
        },
      ],
    }),
    howToUse: zodStringOptional({
      field: "howToUse",
      showingFieldName: "How to use",
      blockMultipleSpaces: true,
      customRegexes: [
        {
          regex: regexes.contentAtLeastLength,
          message: "must be exactly 10 characters long",
        },
      ],
    }),
    ingredients: zodStringOptional({
      field: "ingredients",
      showingFieldName: "Ingredients",
      blockMultipleSpaces: true,
      customRegexes: [
        {
          regex: regexes.contentAtLeastLength,
          message: "must be exactly 10 characters long",
        },
      ],
    }),
    additionalDetails: zodStringOptional({
      field: "additionalDetails",
      showingFieldName: "Additional details",
      blockMultipleSpaces: true,
      customRegexes: [
        {
          regex: regexes.contentAtLeastLength,
          message: "must be exactly 10 characters long",
        },
      ],
    }),
    categoryLevelOne: zodStringRequired({
      field: "categoryLevelOne",
      showingFieldName: "Category 1",
      blockSingleSpace: true,
    }),
    categoryLevelTwo: zodStringRequired({
      field: "categoryLevelTwo",
      showingFieldName: "Category 2",
      blockSingleSpace: true,
    }),
    categoryLevelThree: zodStringRequired({
      field: "categoryLevelThree",
      showingFieldName: "Category 3",
      blockSingleSpace: true,
    }),
    originalPrice: zodNumberRequired({
      field: "originalPrice",
      showingFieldName: "Original price",
      nonNegative: true,
      min: 1,
    }),
    sellingPrice: zodNumberRequired({
      field: "sellingPrice",
      showingFieldName: "Selling price",
      nonNegative: true,
      min: 1,
    }),
    totalStock: zodNumberRequired({
      field: "totalStock",
      showingFieldName: "Total stock",
      nonNegative: true,
      min: 5,
    }),
    commonImages: z
      .array(z.any())
      .min(1, "At least one image is required")
      .superRefine((files, ctx) => {
        files.forEach((file, index) => {
          if (!(file instanceof File)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Item ${index + 1} is not a valid file`,
              path: [index],
            });
            return;
          }

          // File size check
          if (file.size > MAX_IMAGE_FILE_SIZE) {
            const sizeInMB = (file.size / MB).toFixed(1);
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Image ${
                index + 1
              } is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
              path: [index],
            });
          }

          // File type check
          if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Image ${
                index + 1
              } invalid format. Allowed formats: ${ALLOWED_IMAGE_TYPES.map(
                (t) => t.replace("image/", "")
              ).join(", ")}`,
              path: [index],
            });
          }
        });
      }),
    shades: z.array(shadeSchema).optional(),
  })
  .refine((data) => data.sellingPrice <= data.originalPrice, {
    message: "Selling price not be greater than original price.",
    path: ["sellingPrice"],
  });
