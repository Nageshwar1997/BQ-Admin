import { Fragment, useEffect, useRef, useState } from "react";
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
import { FetchedProductType, ProductType, ShadeType } from "../../../types";
import QuillEditor from "../../../components/ui/quillEditor/QuillEditor";
import { useGetProductById } from "../../../api/product/product.service";
import { productInitialValues } from "../data";
import ImageUpload from "../../../components/ui/input/ImageUpload";

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

  const [shades, setShades] = useState<ShadeType[]>([]);
  const [commonImages, setCommonImages] = useState<(string | File)[]>([]);
  const [commonImagePreviews, setCommonImagePreviews] = useState<string[]>([]);

  const { setParams, queryParams } = useQueryParams();
  const selectedProduct = useGetProductById();

  const {
    control,
    handleSubmit,
    register,
    setValue,
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

  const handleReset = () => {
    commonImagePreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    }); // Revoke all blob URLs to avoid memory leaks
    // reset({ ...productInitialValues });
    setShades([]);
    setCommonImages([]);
    setCommonImagePreviews([]);
  };

  const handleUpload = async (data: ProductType) => {
    console.log("DATA", data);
  };

  const handleGetAllProducts = () => {
    selectedProduct.mutate({
      data: {
        shades: ["shadeName", "colorCode", "images", "stock"],
        seller: ["firstName", "lastName", "email"],
        category: ["name", "category", "parentCategory", "level"],
      },
      params: { productId: "68457b215b4c4618ea6a6821" },
    });
  };

  useEffect(() => {
    handleGetAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProduct.isPending) return;
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

      setCommonImagePreviews(product.commonImages);
      setCommonImages(product.commonImages);
      setShades(product.shades);
    }
  }, [selectedProduct.data, selectedProduct.isPending, setValue]);

  useEffect(() => {
    if (shades.length > 0) {
      const totalStock = shades.reduce(
        (total, shade) => total + (shade.stock ?? 0),
        0
      );
      setValue("totalStock", totalStock, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shades, shades.length]);

  return (
    <Fragment>
      {/* {uploadProduct.isPending && <LoadingPage />} */}
      <div className="w-full space-y-3">
        <div className="w-full px-4 py-3 border-b border-primary-50 flex justify-end base:justify-between items-center sticky top-16 bg-primary-inverted z-10 shadow-lg">
          <PathNavigation className="hidden base:flex" />
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
              onSubmit={handleSubmit(handleUpload)}
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
                  content="Upload"
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
