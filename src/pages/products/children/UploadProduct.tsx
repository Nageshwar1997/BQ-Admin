import { Fragment, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/button/Button";
import PathNavigation from "../../../components/PathNavigation";
import { UploadCloudIcon } from "../../../icons";
import useQueryParams from "../../../hooks/useQueryParams";
import AddShade from "./shade/AddShade";
import EditShade from "./shade/EditShade";
import Input from "../../../components/input/Input";
import PhoneInput from "../../../components/input/PhoneInput";
import Select from "../../../components/input/Select";
import {
  categoryLevelsData,
  CATEGORY_DATA,
  INPUTS_DATA,
  PRICE_DATA,
  QUILL_DATA,
} from "../data/categoriesData";
import { productSchema } from "./product.schema";
import { ProductType, ShadeType } from "../../../types";
import QuillEditor from "../../../components/quillEditor/QuillEditor";
import { useUploadProduct } from "../../../api/product/product.service";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ImageUpload from "../../../components/input/ImageUpload";
import { productInitialValues } from "../data";
import { processQuillContent, getQuillValue } from "./helpers";

const UploadProduct = () => {
  const quillDescriptionRef = useRef<Quill | null>(null);
  const quillHowToUseRef = useRef<Quill | null>(null);
  const quillIngredientsUseRef = useRef<Quill | null>(null);
  const quillAdditionalDetailsUseRef = useRef<Quill | null>(null);

  const descriptionBlobUrlsRef = useRef<string[]>([]);
  const howToUseBlobUrlsRef = useRef<string[]>([]);
  const ingredientsBlobUrlsRef = useRef<string[]>([]);
  const additionalDetailsBlobUrlsRef = useRef<string[]>([]);

  const [shades, setShades] = useState<ShadeType[]>([]);
  const [commonImages, setCommonImages] = useState<File[]>([]);
  const [commonImagePreviews, setCommonImagePreviews] = useState<string[]>([]);

  const { setParams, queryParams } = useQueryParams();
  const uploadProduct = useUploadProduct();
  const navigate = useNavigate();

  const {
    control,
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: yupResolver(productSchema),
    defaultValues: productInitialValues,
  });

  const selectedCategory1 = watch("categoryLevelOne");
  const selectedCategory2 = watch("categoryLevelTwo");

  const level1Data = categoryLevelsData.find(
    (cat) => cat.value === selectedCategory1
  );
  const level2Options = level1Data?.subCategories || [];
  const level2Data = level2Options.find(
    (cat) => cat.value === selectedCategory2
  );
  const level3Options = level2Data?.subCategories || [];

  const handleReset = () => {
    commonImagePreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    }); // Revoke all blob URLs to avoid memory leaks
    reset({ ...productInitialValues });
    setShades([]);
    setCommonImages([]);
    setCommonImagePreviews([]);
  };

  const handleUpload = async (data: ProductType) => {
    await Promise.all([
      processQuillContent(
        quillDescriptionRef,
        descriptionBlobUrlsRef,
        setValue,
        "description",
        `Products/${data.title}/Description`,
        "product"
      ),
      processQuillContent(
        quillHowToUseRef,
        howToUseBlobUrlsRef,
        setValue,
        "howToUse",
        `Products/${data.title}/How_To_Use`,
        "product"
      ),
      processQuillContent(
        quillIngredientsUseRef,
        ingredientsBlobUrlsRef,
        setValue,
        "ingredients",
        `Products/${data.title}/Ingredients`,
        "product"
      ),
      processQuillContent(
        quillAdditionalDetailsUseRef,
        additionalDetailsBlobUrlsRef,
        setValue,
        "additionalDetails",
        `Products/${data.title}/Additional_Details`,
        "product"
      ),
    ]);

    const finalData: ProductType = { ...data, ...getValues(), shades };

    const formData = new FormData();

    formData.append("title", finalData.title);
    formData.append("brand", finalData.brand);
    formData.append("description", getQuillValue(finalData.description));
    formData.append("howToUse", getQuillValue(finalData.howToUse));
    formData.append("ingredients", getQuillValue(finalData.ingredients));
    formData.append(
      "additionalDetails",
      getQuillValue(finalData.additionalDetails)
    );
    formData.append("categoryLevelOne", finalData.categoryLevelOne);
    formData.append("categoryLevelTwo", finalData.categoryLevelTwo);
    formData.append("categoryLevelThree", finalData.categoryLevelThree);
    formData.append("sellingPrice", String(finalData.sellingPrice));
    formData.append("originalPrice", String(finalData.originalPrice));
    formData.append("totalStock", String(finalData.totalStock));

    // Append shades with nested images
    if (finalData.shades && finalData.shades.length > 0) {
      finalData.shades.forEach((shade, shadeIndex) => {
        formData.append(`shades[${shadeIndex}][shadeName]`, shade.shadeName);
        formData.append(`shades[${shadeIndex}][colorCode]`, shade.colorCode);
        formData.append(`shades[${shadeIndex}][stock]`, String(shade.stock));

        shade.images.forEach((image, imgIndex) => {
          formData.append(`shades[${shadeIndex}][images][${imgIndex}]`, image);
        });
      });
    } else {
      formData.append("shades", JSON.stringify([]));
    }

    if (finalData?.commonImages && finalData.commonImages.length > 0) {
      finalData.commonImages.forEach((img: File, index: number) => {
        formData.append(`commonImages[${index}]`, img);
      });
    }

    uploadProduct.mutate(formData, {
      onSettled(data, error) {
        if (data && !error) {
          handleReset();
          navigate("/products");
        }
      },
    });
  };

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
      {uploadProduct.isPending && <LoadingPage />}
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
                        render={({ field }) => (
                          <Select
                            value={
                              typeof field.value === "string"
                                ? field.value
                                : undefined
                            }
                            onChange={(val: string) => {
                              field.onChange(val);
                              // reset dependent levels
                              if (input.name === "categoryLevelOne") {
                                setValue("categoryLevelTwo", "");
                                setValue("categoryLevelThree", "");
                              } else if (input.name === "categoryLevelTwo") {
                                setValue("categoryLevelThree", "");
                              }
                            }}
                            readOnly={readOnly}
                            label={input.label}
                            placeholder={placeholder}
                            categories={categories}
                            errorText={errors[input.name]?.message}
                          />
                        )}
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
                    description: quillDescriptionRef,
                    howToUse: quillHowToUseRef,
                    ingredients: quillIngredientsUseRef,
                    additionalDetails: quillAdditionalDetailsUseRef,
                  };

                  const blobMap = {
                    description: descriptionBlobUrlsRef,
                    howToUse: howToUseBlobUrlsRef,
                    ingredients: ingredientsBlobUrlsRef,
                    additionalDetails: additionalDetailsBlobUrlsRef,
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

export default UploadProduct;
