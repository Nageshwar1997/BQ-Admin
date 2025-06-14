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
        if (typeof File !== "undefined" && file instanceof File) {
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
        } else if (typeof file === "string") {
          try {
            const url = new URL(file);
            if (!["http:", "https:"].includes(url.protocol)) {
              throw new Error();
            }
          } catch {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Image ${index + 1} is not a valid URL`,
              path: [index],
            });
          }
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Item ${index + 1} must be a File or a valid image URL`,
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
          regex: /^.{17,}$/, // Skipping the <p></p> tag value 7 characters
          message: "must be exactly 10 characters long",
        },
      ],
    }),
    howToUse: zodStringOptional({
      field: "howToUse",
      showingFieldName: "How to use",
      blockMultipleSpaces: true,
    }),
    ingredients: zodStringOptional({
      field: "ingredients",
      showingFieldName: "Ingredients",
      blockMultipleSpaces: true,
    }),
    additionalDetails: zodStringOptional({
      field: "additionalDetails",
      showingFieldName: "Additional details",
      blockMultipleSpaces: true,
    }),
    categoryLevelOne: z
      .object({
        name: z.string().optional().default(""),
        category: z.string().optional().default(""),
      })
      .superRefine((data, ctx) => {
        const nameResult = zodStringRequired({
          field: "name",
          showingFieldName: "Name",
          parentField: "categoryLevelOne",
          showingParentFieldName: "Category 1",
          blockMultipleSpaces: true,
        }).safeParse(data.name);

        const categoryResult = zodStringRequired({
          field: "category",
          parentField: "categoryLevelOne",
          showingParentFieldName: "Category 1",
          showingFieldName: "Category",
          blockSingleSpace: true,
        }).safeParse(data.category);

        if (!data.name && !data.category) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Category 1 is required",
            path: [],
          });
        }

        if (!nameResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: nameResult.error.issues[0].message,
            path: [],
          });
        } else if (!categoryResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: categoryResult.error.issues[0].message,
            path: [],
          });
        }
      }),
    categoryLevelTwo: z
      .object({
        name: z.string().optional().default(""),
        category: z.string().optional().default(""),
      })
      .superRefine((data, ctx) => {
        const nameResult = zodStringRequired({
          field: "name",
          showingFieldName: "Name",
          parentField: "categoryLevelTwo",
          showingParentFieldName: "Category 2",
          blockMultipleSpaces: true,
        }).safeParse(data.name);

        const categoryResult = zodStringRequired({
          field: "category",
          parentField: "categoryLevelTwo",
          showingParentFieldName: "Category 2",
          showingFieldName: "Category",
          blockSingleSpace: true,
        }).safeParse(data.category);

        if (!data.name && !data.category) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Category 2 is required",
            path: [],
          });
        }

        if (!nameResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: nameResult.error.issues[0].message,
            path: [],
          });
        } else if (!categoryResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: categoryResult.error.issues[0].message,
            path: [],
          });
        }
      }),
    categoryLevelThree: z
      .object({
        name: z.string().optional().default(""),
        category: z.string().optional().default(""),
      })
      .superRefine((data, ctx) => {
        const nameResult = zodStringRequired({
          field: "name",
          showingFieldName: "Name",
          parentField: "categoryLevelThree",
          showingParentFieldName: "Category 3",
          blockMultipleSpaces: true,
        }).safeParse(data.name);

        const categoryResult = zodStringRequired({
          field: "category",
          parentField: "categoryLevelThree",
          showingParentFieldName: "Category 3",
          showingFieldName: "Category",
          blockSingleSpace: true,
        }).safeParse(data.category);

        if (!data.name && !data.category) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Category 3 is required",
            path: [],
          });
        }

        if (!nameResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: nameResult.error.issues[0].message,
            path: [],
          });
        } else if (!categoryResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: categoryResult.error.issues[0].message,
            path: [],
          });
        }
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
          if (typeof File !== "undefined" && file instanceof File) {
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
          } else if (typeof file === "string") {
            try {
              const url = new URL(file);
              if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error();
              }
            } catch {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Image ${index + 1} is not a valid URL`,
                path: [index],
              });
            }
          } else {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Item ${index + 1} must be a File or a valid image URL`,
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
