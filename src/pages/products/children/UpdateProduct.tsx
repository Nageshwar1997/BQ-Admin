import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Quill from "quill";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import Button from "../../../components/ui/button/Button";
import PathNavigation from "../../../components/ui/PathNavigation";
import { UploadCloudIcon } from "../../../icons";
import useQueryParams from "../../../hooks/useQueryParams";
import AddShade from "./shade/AddShade";
import EditShade from "./shade/EditShade";
import Input from "../../../components/ui/input/Input";
import PhoneInput from "../../../components/ui/input/PhoneInput";
import Select from "../../../components/ui/input/Select";
import { DevTool } from "@hookform/devtools";
import {
  categoryLevelsData,
  CATEGORY_DATA,
  INPUTS_DATA,
  PRICE_DATA,
  QUILL_DATA,
} from "../data/categoriesData";
import { productSchema } from "./product.schema";
import {
  FetchedProductType,
  PopulatedCategory,
  ProductType,
  ShadeType,
} from "../../../types";
import QuillEditor from "../../../components/ui/quillEditor/QuillEditor";
import {
  useGetProductById,
  useUpdateProduct,
} from "../../../api/product/product.service";
import { productInitialValues } from "../data";
import ImageUpload from "../../../components/ui/input/ImageUpload";
import { getQuillValue, processQuillContent } from "./helpers";
import { deepEqual } from "../../../utils";
import { toastErrorMessage } from "../../../utils/toast.util";
import LoadingPage from "../../../components/ui/loaders/LoadingPage";

const allowedKeys = ["originalPrice", "sellingPrice", "totalStock"] as const;
type PriceKey = (typeof allowedKeys)[number];

const extractImageUrls = (html: string): string[] => {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    urls.push(match[1]);
  }

  return urls;
};

const UpdateProduct = () => {
  const quillRefs = {
    description: useRef<Quill | null>(null),
    howToUse: useRef<Quill | null>(null),
    ingredients: useRef<Quill | null>(null),
    additionalDetails: useRef<Quill | null>(null),
  };

  const blobUrlRefs = {
    description: useRef<string[]>([]),
    howToUse: useRef<string[]>([]),
    ingredients: useRef<string[]>([]),
    additionalDetails: useRef<string[]>([]),
  };

  const [isApiRunning, setIsApiRunning] = useState(false);
  const [shades, setShades] = useState<ShadeType[]>([]);
  const [commonImages, setCommonImages] = useState<(string | File)[]>([]);
  const [commonImagePreviews, setCommonImagePreviews] = useState<string[]>([]);

  const { setParams, queryParams, params } = useQueryParams();
  const selectedProduct = useGetProductById();
  const updateProduct = useUpdateProduct();
  const { pathname } = useLocation();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof productSchema>>({
    defaultValues: productInitialValues,
    resolver: zodResolver(productSchema),
  });

  const selectedCategory1 = watch("categoryLevelOne");
  const selectedCategory2 = watch("categoryLevelTwo");

  const level1Data = categoryLevelsData.find(
    (cat) => cat?.category === selectedCategory1?.category
  );
  const level2Options = level1Data?.subCategories || [];
  const level2Data = level2Options.find(
    (cat) => cat?.category === selectedCategory2?.category
  );
  const level3Options = level2Data?.subCategories || [];

  const handleUpdate = async (data: ProductType) => {
    let hasChanges = false;

    await Promise.all([
      processQuillContent({
        quillRef: quillRefs.description,
        blobUrlsRef: blobUrlRefs.description,
        setValue,
        fieldName: "description",
        folderName: `Products/${data.title}/Description`,
        cloudinaryConfigOption: "product",
        setLoading: setIsApiRunning,
      }),
      processQuillContent({
        quillRef: quillRefs.howToUse,
        blobUrlsRef: blobUrlRefs.howToUse,
        setValue,
        fieldName: "howToUse",
        folderName: `Products/${data.title}/How_To_Use`,
        cloudinaryConfigOption: "product",
        setLoading: setIsApiRunning,
      }),
      processQuillContent({
        quillRef: quillRefs.ingredients,
        blobUrlsRef: blobUrlRefs.ingredients,
        setValue,
        fieldName: "ingredients",
        folderName: `Products/${data.title}/Ingredients`,
        cloudinaryConfigOption: "product",
        setLoading: setIsApiRunning,
      }),
      processQuillContent({
        quillRef: quillRefs.additionalDetails,
        blobUrlsRef: blobUrlRefs.additionalDetails,
        setValue,
        fieldName: "additionalDetails",
        folderName: `Products/${data.title}/Additional_Details`,
        cloudinaryConfigOption: "product",
        setLoading: setIsApiRunning,
      }),
    ]);

    const formData = new FormData();

    const finalData: ProductType = { ...data, ...getValues(), shades };
    const product: FetchedProductType = selectedProduct.data?.product;
    const category: PopulatedCategory = product?.category;

    // For Common Images
    const newAddedCommonImageFiles: File[] = [];
    const unChangedCommonImageURLs: string[] = [];
    const apiCommonImageURLs: string[] = product.commonImages;

    data.commonImages.forEach((img) => {
      if (img instanceof File) {
        newAddedCommonImageFiles.push(img);
      } else {
        unChangedCommonImageURLs.push(img);
      }
    });

    const removedCommonImageURLs: string[] = apiCommonImageURLs.filter(
      (img) => !unChangedCommonImageURLs.includes(img)
    );

    if (removedCommonImageURLs.length) {
      hasChanges = true;
      formData.append(
        "removingCommonImageURLs",
        JSON.stringify(removedCommonImageURLs)
      );
    }

    if (newAddedCommonImageFiles.length) {
      hasChanges = true;
      newAddedCommonImageFiles.forEach((img, index) => {
        formData.append(`commonImages[${index}]`, img);
      });
    }

    const removedShadeURLsWithID: { _id: string; urls: string[] }[] = [];
    const currentShadeIds = new Set(shades.map((s) => s._id?.toString()));
    const removingShades: string[] = product.shades
      ?.filter(
        (originalShade) =>
          originalShade._id !== undefined &&
          !currentShadeIds.has(originalShade._id.toString())
      )
      .map((shade) => shade._id)
      .filter((id) => id !== undefined);

    if (removingShades?.length) {
      hasChanges = true;
      formData.append("removingShades", JSON.stringify(removingShades));
    }

    product?.shades?.forEach((originalShade) => {
      const currentShade = shades.find((s) => s._id === originalShade._id);
      if (!currentShade || !originalShade._id) return;

      const originalURLs = originalShade.images?.filter(
        (img) => typeof img === "string"
      );

      const currentURLs = currentShade.images?.filter(
        (img) => typeof img === "string"
      );

      const removedURLs = originalURLs.filter(
        (url) => !currentURLs.includes(url)
      );

      if (removedURLs.length) {
        removedShadeURLsWithID.push({
          _id: originalShade._id,
          urls: removedURLs,
        });
      }
    });

    if (removedShadeURLsWithID.length) {
      hasChanges = true;
      formData.append(
        "removingShadeImageUrls",
        JSON.stringify(removedShadeURLsWithID)
      );
    }

    const apiData: Partial<FetchedProductType> = {
      title: product?.title,
      brand: product?.brand,
      additionalDetails: product?.additionalDetails,
      description: product?.description,
      howToUse: product?.howToUse,
      ingredients: product?.ingredients,
      categoryLevelThree: {
        name: category.name,
        category: category.category,
      },
      categoryLevelTwo: {
        name: category.parentCategory.name,
        category: category.parentCategory.category,
      },
      categoryLevelOne: {
        name: category.parentCategory.parentCategory.name,
        category: category.parentCategory.parentCategory.category,
      },
    };
    const apiNumberFields = {
      originalPrice: String(product?.originalPrice),
      sellingPrice: String(product?.sellingPrice),
      totalStock: String(product?.totalStock),
    };

    const updatedData: Partial<ProductType> = {
      title: finalData.title,
      brand: finalData.brand,
      additionalDetails: getQuillValue(finalData.additionalDetails),
      description: getQuillValue(finalData.description),
      howToUse: getQuillValue(finalData.howToUse),
      ingredients: getQuillValue(finalData.ingredients),
      categoryLevelThree: finalData.categoryLevelThree,
      categoryLevelTwo: finalData.categoryLevelTwo,
      categoryLevelOne: finalData.categoryLevelOne,
    };

    const updatedNumberFields = {
      originalPrice: String(finalData.originalPrice),
      sellingPrice: String(finalData.sellingPrice),
      totalStock: String(finalData.totalStock),
    };

    const changedProductNumberFields: Partial<Record<PriceKey, string>> = {};

    Object.keys(updatedNumberFields).forEach((key) => {
      if (allowedKeys.includes(key as PriceKey)) {
        const typedKey = key as PriceKey;
        if (
          !deepEqual(updatedNumberFields[typedKey], apiNumberFields?.[typedKey])
        ) {
          changedProductNumberFields[typedKey] = updatedNumberFields[typedKey];
        }
      }
    });

    if (Object.keys(changedProductNumberFields)?.length) {
      hasChanges = true;
      Object.entries(changedProductNumberFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const existingShades: ShadeType[] = [];
    const newAddedShades: ShadeType[] = [];

    shades?.forEach((shade: ShadeType) => {
      if (shade?._id) {
        existingShades.push(shade);
      } else {
        newAddedShades.push(shade);
      }
    });

    if (newAddedShades.length) {
      hasChanges = true;
      newAddedShades.forEach((shade, shadeIndex) => {
        formData.append(
          `newAddedShades[${shadeIndex}][shadeName]`,
          shade.shadeName
        );
        formData.append(
          `newAddedShades[${shadeIndex}][colorCode]`,
          shade.colorCode
        );
        formData.append(
          `newAddedShades[${shadeIndex}][stock]`,
          String(shade.stock)
        );

        shade.images.forEach((image, imgIndex) => {
          formData.append(
            `newAddedShades[${shadeIndex}][images][${imgIndex}]`,
            image
          );
        });
      });
    }

    const updatedShadesWithImageFiles: ShadeType[] = [];
    const updatedShadesWithoutImageFiles: ShadeType[] = [];

    existingShades.forEach((shade) => {
      if (shade?.images?.some((img) => img instanceof File)) {
        updatedShadesWithImageFiles.push(shade);
      } else {
        updatedShadesWithoutImageFiles.push(shade);
      }
    });

    // For Image Changed Shades
    const changedShadesFieldsWithImageFiles: Partial<ShadeType>[] = [];

    updatedShadesWithImageFiles.forEach((shade) => {
      const originalShade = product?.shades?.find((s) => s._id === shade._id);
      if (!originalShade || !shade._id) return;

      const updatedFields: Partial<ShadeType> = {
        _id: shade._id,
        images: shade.images.filter((img) => img instanceof File),
      };

      (Object.keys(shade) as (keyof ShadeType)[]).forEach((key) => {
        const typedKey = key as keyof ShadeType;
        if (
          typedKey !== "images" &&
          !deepEqual(shade[typedKey], originalShade[typedKey])
        ) {
          (updatedFields[typedKey] as unknown) = shade[typedKey];
        }
      });

      if (Object.keys(updatedFields).length > 1) {
        changedShadesFieldsWithImageFiles.push(updatedFields);
      }
    });

    if (changedShadesFieldsWithImageFiles.length) {
      hasChanges = true;
      changedShadesFieldsWithImageFiles.forEach((shade, shadeIndex) => {
        if (shade._id) {
          formData.append(
            `updatedShadeWithFiles[${shadeIndex}][_id]`,
            shade._id
          );
        }
        if (shade.shadeName) {
          formData.append(
            `updatedShadeWithFiles[${shadeIndex}][shadeName]`,
            shade.shadeName
          );
        }
        if (shade.colorCode) {
          formData.append(
            `updatedShadeWithFiles[${shadeIndex}][colorCode]`,
            shade.colorCode
          );
        }
        if (shade.stock && shade.stock > 0) {
          formData.append(
            `updatedShadeWithFiles[${shadeIndex}][stock]`,
            String(shade.stock)
          );
        }
        if (shade.images?.length) {
          shade.images?.forEach((image, imgIndex) => {
            formData.append(
              `updatedShadeWithFiles[${shadeIndex}][images][${imgIndex}]`,
              image
            );
          });
        }
      });
    }
    const changedShadesFieldsWithoutImageFiles: Partial<ShadeType>[] = [];

    updatedShadesWithoutImageFiles.forEach((shade) => {
      const originalShade = product?.shades?.find((s) => s._id === shade._id);
      if (!originalShade || !shade._id) return;

      const updatedShadeFields: Partial<ShadeType> = { _id: shade._id };

      Object.keys(shade).forEach((key) => {
        const typedKey = key as keyof ShadeType;
        if (
          typedKey !== "images" &&
          !deepEqual(shade[typedKey], originalShade[typedKey])
        ) {
          (updatedShadeFields[typedKey] as unknown) = shade[typedKey];
        }
      });

      if (Object.keys(updatedShadeFields).length > 1) {
        changedShadesFieldsWithoutImageFiles.push(updatedShadeFields);
      }
    });

    if (changedShadesFieldsWithoutImageFiles.length) {
      formData.append(
        "updatedShadeWithoutFiles",
        JSON.stringify(changedShadesFieldsWithoutImageFiles)
      );
    }

    // For All
    const changedProductFields: Partial<ProductType> = {};
    Object.keys(updatedData).forEach((key) => {
      const typedKey = key as keyof ProductType;
      if (!deepEqual(updatedData[typedKey], apiData?.[typedKey])) {
        (changedProductFields[typedKey] as unknown) = updatedData[typedKey];
      }
    });
    const fieldsToCheck: (keyof Pick<
      ProductType,
      "description" | "howToUse" | "ingredients" | "additionalDetails"
    >)[] = ["description", "howToUse", "ingredients", "additionalDetails"];

    const removedUrls = fieldsToCheck.flatMap((field) => {
      const originalHtml = product?.[field] || "";
      const updatedHtml = getValues(field) || "";

      const originalUrls = extractImageUrls(originalHtml);
      const updatedUrls = extractImageUrls(updatedHtml);

      return originalUrls.filter((url) => !updatedUrls.includes(url));
    });

    if (removedUrls?.length) {
      formData.append("removedQuillImageURLs", JSON.stringify(removedUrls));
    }

    if (!Object.keys(changedProductFields).length && !hasChanges) {
      toastErrorMessage("No Product Data Changed");
      return;
    }

    Object.entries(changedProductFields).forEach(([key, value]) => {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });

    setIsApiRunning(true);
    updateProduct.mutate(
      {
        data: formData,
        productId: params.id as string,
      },
      {
        onSettled: () => {
          setIsApiRunning(false);
        },
      }
    );
  };

  const handleGetAllProducts = () => {
    selectedProduct.mutate({
      data: {
        shades: ["shadeName", "colorCode", "images", "stock"],
        seller: ["firstName", "lastName", "email"],
        category: ["name", "category", "parentCategory", "level"],
      },
      params: { productId: params.id as string },
    });
  };

  useEffect(() => {
    handleGetAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setInitialValues = () => {
    if (selectedProduct.data?.product) {
      const product: FetchedProductType = selectedProduct.data.product;
      setValue("title", product.title, { shouldValidate: true });
      setValue("brand", product.brand, { shouldValidate: true });
      setValue(
        "categoryLevelThree",
        {
          name: product.category.name,
          category: product.category.category,
        },
        { shouldValidate: true }
      );
      setValue(
        "categoryLevelTwo",
        {
          name: product.category.parentCategory.name,
          category: product.category.parentCategory.category,
        },
        { shouldValidate: true }
      );
      setValue(
        "categoryLevelOne",
        {
          name: product.category.parentCategory.parentCategory.name,
          category: product.category.parentCategory.parentCategory.category,
        },
        { shouldValidate: true }
      );
      setValue("originalPrice", product.originalPrice, {
        shouldValidate: true,
      });
      setValue("sellingPrice", product.sellingPrice, {
        shouldValidate: true,
      });
      setValue("commonImages", product.commonImages);
      setValue("description", product.description, { shouldValidate: true });
      setValue("howToUse", product.howToUse, { shouldValidate: true });
      setValue("ingredients", product.ingredients, { shouldValidate: true });
      setValue("additionalDetails", product.additionalDetails, {
        shouldValidate: true,
      });
      setValue("totalStock", Number(product.totalStock));

      setCommonImagePreviews(product.commonImages);
      setCommonImages(product.commonImages);
      setShades(product.shades);
    }
  };

  const handleReset = () => {
    if (commonImagePreviews.length) {
      commonImagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      }); // Revoke all blob URLs to avoid memory leaks
    }

    setInitialValues();
  };

  useEffect(() => {
    if (selectedProduct.isPending) return;
    setInitialValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct.data, selectedProduct.isPending]);

  useEffect(() => {
    if (shades.length > 0) {
      const totalStock = shades.reduce(
        (total, shade) => total + (shade.stock ?? 0),
        0
      );
      setValue("totalStock", totalStock, { shouldValidate: true });
    } else if (shades.length === 0) {
      setValue("totalStock", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shades, shades.length]);

  return (
    <Fragment>
      {(updateProduct.isPending || isApiRunning) && <LoadingPage />}
      <div className="w-full space-y-3">
        <div className="w-full px-4 py-3 border-b border-primary-50 flex justify-end base:justify-between items-center sticky top-16 bg-primary-inverted z-10 shadow-lg">
          <PathNavigation
            className="hidden base:flex"
            path={pathname
              .split("/")
              .filter((path) => path !== "")
              .splice(0, 2)
              .join("/")}
          />
          <Button
            pattern="outline"
            content="Add Shade"
            className="max-w-36 sm:max-w-40 !py-1.5 !px-4 !rounded-lg gap-2"
            onClick={() => setParams({ shade: "add" })}
            rightIcon={
              <UploadCloudIcon className="w-5 h-5 [&>path]:stroke-[2.75] [&>path]:stroke-secondary [&>path]:group-hover:stroke-tertiary-inverted" />
            }
          />
        </div>
        <div className="mx-auto rounded-lg shadow-light-dark-soft bg-platinum-black">
          <div className="w-full h-full flex flex-col lg:flex-row gap-5">
            {/* Product Form */}
            <form
              className="w-full p-4 flex flex-col gap-7"
              onSubmit={handleSubmit(handleUpdate)}
            >
              <div className="flex flex-col sm:flex-row gap-7 sm:gap-4">
                {INPUTS_DATA.map((input, index) => (
                  <div
                    key={index}
                    className={`${
                      input.name === "title"
                        ? "w-full sm:w-2/3"
                        : "w-full sm:w-1/3"
                    }`}
                  >
                    <Input
                      name={input.name}
                      label={input.label}
                      placeholder={input.placeholder}
                      register={register(input.name)}
                      errorText={errors[input.name]?.message}
                    />
                  </div>
                ))}
              </div>
              <div className="grid gap-y-7 gap-x-4 sm:grid-cols-2 md:grid-cols-3">
                {CATEGORY_DATA.map((input, index) => {
                  const categories =
                    input.name === "categoryLevelOne"
                      ? categoryLevelsData
                      : input.name === "categoryLevelTwo"
                      ? level2Options
                      : level3Options;

                  const readOnly =
                    (input.name === "categoryLevelTwo" && !selectedCategory1) ||
                    (input.name === "categoryLevelThree" && !selectedCategory2);

                  const placeholder =
                    input.name === "categoryLevelOne"
                      ? "Select a level one category"
                      : input.name === "categoryLevelTwo"
                      ? !selectedCategory1
                        ? "Select a level one category first"
                        : "Select a level two category"
                      : !selectedCategory1
                      ? "Select a level one category first"
                      : !selectedCategory2
                      ? "Select a level two category first"
                      : "Select a level three category";

                  return (
                    <div
                      key={index}
                      className={`${
                        input.name === "categoryLevelThree"
                          ? "sm:col-span-2 md:col-span-1"
                          : "col-span-1"
                      }`}
                    >
                      <Controller
                        name={input.name}
                        control={control}
                        render={({ field }) => {
                          const val = field.value as
                            | { name: string; category: string }
                            | undefined;

                          return (
                            <Select
                              value={val?.category ?? ""}
                              onChange={(val) => {
                                field.onChange(val);
                                if (input.name === "categoryLevelOne") {
                                  setValue("categoryLevelTwo", {
                                    name: "",
                                    category: "",
                                  });
                                  setValue("categoryLevelThree", {
                                    name: "",
                                    category: "",
                                  });
                                } else if (input.name === "categoryLevelTwo") {
                                  setValue("categoryLevelThree", {
                                    name: "",
                                    category: "",
                                  });
                                }
                              }}
                              readOnly={readOnly}
                              label={input.label}
                              placeholder={placeholder}
                              categories={categories}
                              errorText={errors[input.name]?.message}
                            />
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="grid sm:grid-cols-3 gap-y-7 gap-x-4">
                {PRICE_DATA.map((input, index) => {
                  const isDisabled =
                    input.name === "totalStock" && shades.length > 0;
                  return (
                    <PhoneInput
                      key={index}
                      name={input.name}
                      label={input.label}
                      type="number"
                      placeholder={input.placeholder}
                      register={register(input.name)}
                      errorText={errors[input.name]?.message}
                      containerClassName="[&>div>div>p]:hidden"
                      className={`${isDisabled ? "cursor-not-allowed" : ""}`}
                      readOnly={isDisabled}
                    />
                  );
                })}
              </div>
              <div className="w-full">
                <Controller
                  control={control}
                  name="commonImages"
                  defaultValue={[]}
                  render={({ field }) => (
                    <ImageUpload
                      name={"commonImages"}
                      label="Common Images"
                      placeholder="Select Common Images"
                      previewUrls={commonImagePreviews}
                      containerClassName="w-full sm:col-span-3"
                      errors={
                        Array.isArray(errors.commonImages)
                          ? errors.commonImages.map((err) => err.message)
                          : errors.commonImages?.message
                          ? [errors.commonImages.message]
                          : []
                      }
                      handleChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const previews = files.map((file) =>
                          URL.createObjectURL(file)
                        );

                        const newFiles = [...commonImages, ...files];
                        const newPreviews = [
                          ...commonImagePreviews,
                          ...previews,
                        ];

                        setCommonImages(newFiles);
                        setCommonImagePreviews(newPreviews);
                        field.onChange(newFiles);
                      }}
                      handleRemoveImage={(idx) => {
                        const updatedFiles = commonImages.filter(
                          (_, index) => index !== idx
                        );
                        const updatedPreviews = commonImagePreviews.filter(
                          (_, index) => index !== idx
                        );
                        setCommonImages(updatedFiles);
                        setCommonImagePreviews(updatedPreviews);
                        field.onChange(updatedFiles);
                      }}
                      icon={
                        <UploadCloudIcon className="[&>path]:stroke-primary opacity-50 group-hover:opacity-100" />
                      }
                    />
                  )}
                />
              </div>
              <div className="w-full grid gap-y-7 gap-x-4 lg:grid-cols-2">
                {QUILL_DATA.map((input, index) => {
                  const editorMap = {
                    description: quillRefs.description,
                    howToUse: quillRefs.howToUse,
                    ingredients: quillRefs.ingredients,
                    additionalDetails: quillRefs.additionalDetails,
                  };

                  const blobMap = {
                    description: blobUrlRefs.description,
                    howToUse: blobUrlRefs.howToUse,
                    ingredients: blobUrlRefs.ingredients,
                    additionalDetails: blobUrlRefs.additionalDetails,
                  };

                  return (
                    <div key={index} className="w-full">
                      <Controller
                        control={control}
                        name={input.name}
                        render={({ field }) => (
                          <QuillEditor
                            label={input.label}
                            ref={
                              editorMap[input.name as keyof typeof editorMap]
                            }
                            blobUrlsRef={
                              blobMap[input.name as keyof typeof blobMap]
                            }
                            onChange={field.onChange}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            placeholder={input.placeholder}
                            errorText={errors[input.name]?.message}
                          />
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="w-full border border-primary-10 bg-smoke-eerie rounded-lg p-2 space-y-2">
                <div className="text-tertiary pb-2 px-2 border-b border-primary-50 flex items-center justify-between">
                  <div className="space-x-1 mt-1">
                    <span>Added Shades:</span>
                    <span className="font-semibold">
                      {shades.length < 10
                        ? `(0${shades.length})`
                        : shades.length}
                    </span>
                  </div>
                  <Button
                    pattern="outline"
                    content=""
                    className="max-w-[10px] !py-1.5 !px-4 !rounded gap-2"
                    onClick={() => setParams({ shade: "add" })}
                    rightIcon={
                      <UploadCloudIcon className="w-5 h-5 [&>path]:stroke-[2.75] [&>path]:stroke-secondary [&>path]:group-hover:stroke-tertiary-inverted" />
                    }
                  />
                </div>
                {shades?.length > 0 && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2">
                    {shades.map((shade, i) => {
                      const firstImage = shade.images?.[0];
                      const imageUrl =
                        firstImage instanceof File
                          ? URL.createObjectURL(firstImage)
                          : typeof firstImage === "string"
                          ? firstImage
                          : "";
                      return (
                        <div
                          key={i}
                          className="p-2 border border-primary-10 rounded-md shadow-lg bg-primary-inverted-30"
                        >
                          <div className="flex items-start gap-3">
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={`Shade ${i + 1}`}
                                className="w-24 h-24 object-cover rounded border"
                              />
                            )}
                            <div className="text-xs flex flex-col gap-1">
                              <p className="line-clamp-1 space-x-1">
                                <strong>Name:</strong>
                                <span>{shade.shadeName}</span>
                              </p>
                              <p className="space-x-1">
                                <strong>Color:</strong>
                                <span className="uppercase">
                                  {shade.colorCode}
                                </span>
                              </p>
                              <p className="space-x-1">
                                <strong>Stock:</strong>
                                <span>{shade.stock}</span>
                              </p>
                              <div className="mt-2 flex gap-2">
                                <Button
                                  type="button"
                                  pattern="transparent"
                                  content="Edit"
                                  onClick={() => {
                                    setParams({ shade: "edit", index: `${i}` });
                                  }}
                                  className="!px-2 !py-0.5 !text-xs !rounded text-white !font-medium bg-blue-600 hover:bg-blue-700 hover:!shadow-sm hover:!shadow-blue-600/50"
                                />
                                <Button
                                  type="button"
                                  pattern="transparent"
                                  content="Remove"
                                  onClick={() => {
                                    const updatedShades = shades.filter(
                                      (_, index) => index !== i
                                    );
                                    setShades(updatedShades);
                                  }}
                                  className="!px-2 !py-0.5 !text-xs !rounded !font-medium text-white bg-red-600 hover:bg-red-700 hover:!shadow-sm hover:!shadow-red-600/50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button
                  pattern="secondary"
                  content="Reset"
                  type="button"
                  className="!rounded-lg max-h-12"
                  onClick={handleReset}
                />
                <Button
                  pattern="primary"
                  type="submit"
                  content="Update"
                  className="!rounded-lg max-h-12"
                />
              </div>
              <DevTool control={control} />
            </form>
          </div>
        </div>
      </div>
      {queryParams.shade === "add" && <AddShade setShades={setShades} />}
      {queryParams.shade === "edit" && (
        <EditShade shades={shades} setShades={setShades} />
      )}
    </Fragment>
  );
};

export default UpdateProduct;
