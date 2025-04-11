import { Fragment, useRef, useState } from "react";
import Button from "../../../components/button/Button";
import PathNavigation from "../../../components/PathNavigation";
import { UploadCloudIcon } from "../../../icons";
import useQueryParams from "../../../hooks/useQueryParams";
import AddShade from "./AddShade";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Input from "../../../components/input/Input";
import PhoneInput from "../../../components/input/PhoneInput";
import Select from "../../../components/input/Select";
import {
  categoriesData,
  CATEGORY_DATA,
  INPUTS_DATA,
  PRICE_DATA,
  QUILL_DATA,
} from "../data/categoriesData";
import { productSchema } from "./product.schema";
import { ProductType, ShadeType } from "../../../types";
import QuillMarkupEditor from "../../../components/QuillMarkupEditor/QuillMarkupEditor";
import Quill from "quill";
import { useUploadProduct } from "../../../api/product/product.service";
import LoadingPage from "../../../components/loaders/LoadingPage";

const productInitialValues: ProductType = {
  title: "",
  brand: "",
  description: "",
  howToUse: "",
  ingredients: "",
  additionalDetails: "",
  categoryLevelOne: "",
  categoryLevelTwo: "",
  categoryLevelThree: "",
  originalPrice: null,
  sellingPrice: null,
  shades: [],
};

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

  const {
    register: productRegister,
    handleSubmit: productHandleSubmit,
    setValue: productSetValue,
    watch: productWatch,
    control: productControl,
    formState: { errors: productErrors },
  } = useForm<ProductType>({
    resolver: yupResolver(productSchema),
    defaultValues: productInitialValues,
  });

  const selectedCategory1 = productWatch("categoryLevelOne");
  const selectedCategory2 = productWatch("categoryLevelTwo");

  const level1Data = categoriesData.find(
    (cat) => cat.value === selectedCategory1
  );
  const level2Options = level1Data?.subCategories || [];
  const level2Data = level2Options.find(
    (cat) => cat.value === selectedCategory2
  );
  const level3Options = level2Data?.subCategories || [];

  const handleDescriptionTextChange = () => {
    if (quillDescriptionRef.current) {
      const description = quillDescriptionRef.current.root.innerHTML;
      productSetValue("description", description, { shouldValidate: true });
    }
  };
  const handleHowToUseTextChange = () => {
    if (quillHowToUseRef.current) {
      const howToUse = quillHowToUseRef.current.root.innerHTML;
      productSetValue("howToUse", howToUse, { shouldValidate: true });
    }
  };
  const handleIngredientsTextChange = () => {
    if (quillIngredientsUseRef.current) {
      const ingredients = quillIngredientsUseRef.current.root.innerHTML;
      productSetValue("ingredients", ingredients, { shouldValidate: true });
    }
  };

  const handleAdditionalDetailsTextChange = () => {
    if (quillAdditionalDetailsUseRef.current) {
      const additionalDetails =
        quillAdditionalDetailsUseRef.current.root.innerHTML;
      productSetValue("additionalDetails", additionalDetails, {
        shouldValidate: true,
      });
    }
  };

  const onSubmitProduct = async (data: ProductType) => {
    const finalData: ProductType = { ...data, shades };

    const formData = new FormData();

    // Append simple fields
    formData.append("title", finalData.title);
    formData.append("brand", finalData.brand);
    formData.append("description", finalData.description);
    formData.append("howToUse", finalData.howToUse ?? "");
    formData.append("ingredients", finalData.ingredients ?? "");
    formData.append("additionalDetails", finalData.additionalDetails ?? "");
    formData.append("categoryLevelOne", finalData.categoryLevelOne);
    formData.append("categoryLevelTwo", finalData.categoryLevelTwo);
    formData.append("categoryLevelThree", finalData.categoryLevelThree);

    if (finalData.sellingPrice) {
      formData.append("sellingPrice", finalData.sellingPrice.toString());
    }

    if (finalData.originalPrice) {
      formData.append("originalPrice", finalData.originalPrice.toString());
    }

    // Append shades with nested images
    if (finalData.shades && finalData.shades.length > 0) {
      finalData.shades.forEach((shade, shadeIndex) => {
        formData.append(`shades[${shadeIndex}][shadeName]`, shade.shadeName);
        formData.append(`shades[${shadeIndex}][colorCode]`, shade.colorCode);
        formData.append(
          `shades[${shadeIndex}][stock]`,
          String(shade.stock ?? "")
        );

        shade.images.forEach((image, imgIndex) => {
          formData.append(`shades[${shadeIndex}][images][${imgIndex}]`, image);
        });
      });
    }

    // If you also have common product images (optional)
    if (data?.commonImages && data.commonImages.length > 0) {
      data.commonImages.forEach((img: File, index: number) => {
        formData.append(`commonImages[${index}]`, img);
      });
    }

    // For debugging
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    uploadProduct.mutate(formData);
  };

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
            onClick={() => setParams({ shade: "true" })}
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
              onSubmit={productHandleSubmit(onSubmitProduct)}
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
                      register={productRegister(input.name)}
                      errorText={productErrors[input.name]?.message}
                    />
                  </div>
                ))}
              </div>
              <div className="grid gap-y-7 gap-x-4 sm:grid-cols-2 md:grid-cols-3">
                {CATEGORY_DATA.map((input, index) => {
                  const value =
                    input.name === "categoryLevelOne"
                      ? selectedCategory1
                      : input.name === "categoryLevelTwo"
                      ? selectedCategory2
                      : productWatch("categoryLevelThree");

                  const categories =
                    input.name === "categoryLevelOne"
                      ? categoriesData
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

                  const onChange =
                    input.name === "categoryLevelOne"
                      ? (val: string) => {
                          productSetValue("categoryLevelOne", val, {
                            shouldValidate: true,
                          });
                          productSetValue("categoryLevelTwo", "");
                          productSetValue("categoryLevelThree", "");
                        }
                      : input.name === "categoryLevelTwo"
                      ? (val: string) => {
                          productSetValue("categoryLevelTwo", val, {
                            shouldValidate: true,
                          });
                          productSetValue("categoryLevelThree", "");
                        }
                      : (val: string) => {
                          productSetValue("categoryLevelThree", val, {
                            shouldValidate: true,
                          });
                        };
                  return (
                    <div
                      key={index}
                      className={`${
                        input.name === "categoryLevelThree"
                          ? "sm:col-span-2 md:col-span-1"
                          : "col-span-1"
                      }`}
                    >
                      <Select
                        value={value}
                        readOnly={readOnly}
                        label={input.label}
                        placeholder={placeholder}
                        categories={categories}
                        onChange={onChange}
                        errorText={productErrors[input.name]?.message}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col base:flex-row gap-7 base:gap-4">
                {PRICE_DATA.map((input, index) => (
                  <PhoneInput
                    key={index}
                    name={input.name}
                    label={input.label}
                    type="number"
                    placeholder={input.placeholder}
                    register={productRegister(input.name)}
                    errorText={productErrors[input.name]?.message}
                    containerClassName="[&>div>div>p]:hidden"
                  />
                ))}
              </div>
              <Controller
                control={productControl}
                name="commonImages"
                defaultValue={[]}
                render={({ field }) => (
                  <>
                    <label
                      htmlFor="commonImages"
                      className="text-sm font-medium"
                    >
                      Shade Images
                    </label>
                    <input
                      id="commonImages"
                      type="file"
                      multiple
                      // accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const previews = files.map((file) =>
                          URL.createObjectURL(file)
                        );

                        setCommonImages((prev) => [...prev, ...files]);
                        setCommonImagePreviews((prev) => [
                          ...prev,
                          ...previews,
                        ]);

                        // ✅ Update form field
                        field.onChange([...commonImages, ...files]);
                      }}
                    />
                    {Array.isArray(productErrors.commonImages) &&
                      productErrors.commonImages.map(
                        (error, index) =>
                          error && (
                            <p key={index} className="text-red-500 text-sm">
                              {error.message}
                            </p>
                          )
                      )}

                    {productErrors.commonImages?.message && (
                      <p className="text-red-500 text-sm">
                        {productErrors.commonImages.message}
                      </p>
                    )}

                    {commonImagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {commonImagePreviews.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt={`shade-img-${idx}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              />
              <div className="w-full grid gap-y-7 gap-x-4 lg:grid-cols-2">
                {QUILL_DATA.map((input, index) => {
                  const ref =
                    input.name === "description"
                      ? quillDescriptionRef
                      : input.name === "howToUse"
                      ? quillHowToUseRef
                      : input.name === "ingredients"
                      ? quillIngredientsUseRef
                      : quillAdditionalDetailsUseRef;

                  const blobUrlsRef =
                    input.name === "description"
                      ? descriptionBlobUrlsRef
                      : input.name === "howToUse"
                      ? howToUseBlobUrlsRef
                      : input.name === "ingredients"
                      ? ingredientsBlobUrlsRef
                      : additionalDetailsBlobUrlsRef;

                  const handleTextChange =
                    input.name === "description"
                      ? handleDescriptionTextChange
                      : input.name === "howToUse"
                      ? handleHowToUseTextChange
                      : input.name === "ingredients"
                      ? handleIngredientsTextChange
                      : handleAdditionalDetailsTextChange;

                  return (
                    <div key={index} className="w-full">
                      <QuillMarkupEditor
                        label={input.label}
                        ref={ref}
                        blobUrlsRef={blobUrlsRef}
                        placeholder={input.placeholder}
                        onTextChange={handleTextChange}
                        errorText={productErrors[input.name]?.message}
                      />
                    </div>
                  );
                })}
              </div>
              <Button pattern="primary" type="submit" content="Upload" />
              <DevTool control={productControl} />
            </form>
          </div>
        </div>
      </div>
      {queryParams.shade && <AddShade setShades={setShades} />}
    </Fragment>
  );
};

export default UploadProduct;
