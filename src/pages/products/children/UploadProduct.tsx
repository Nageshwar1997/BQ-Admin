import { Fragment, useState } from "react";
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
import { categoriesData } from "../data/categoriesData";
import { productSchema } from "./product.schema";
import { ProductType, ShadeType } from "../../../types";

const UploadProduct = () => {
  const [shades, setShades] = useState<ShadeType[]>([]);
  const [commonImages, setCommonImages] = useState<File[]>([]);
  const [commonImagePreviews, setCommonImagePreviews] = useState<string[]>([]);
  const { setParams, queryParams } = useQueryParams();

  const {
    register: productRegister,
    handleSubmit: productHandleSubmit,
    setValue: productSetValue,
    watch: productWatch,
    control: productControl,
    formState: { errors: productErrors },
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  const selectedCategory1 = productWatch("category1");
  const selectedCategory2 = productWatch("category2");

  const level1Data = categoriesData.find(
    (cat) => cat.value === selectedCategory1
  );
  const level2Options = level1Data?.subCategories || [];
  const level2Data = level2Options.find(
    (cat) => cat.value === selectedCategory2
  );
  const level3Options = level2Data?.subCategories || [];

  const onSubmitProduct = (data: ProductType) => {
    console.log("✅ Product submitted", data);

    const finalData: ProductType = {
      ...data,
      shades: shades, // shades from useState
    };

    const formData = new FormData();

    // Append simple fields
    formData.append("title", finalData.title);
    formData.append("brand", finalData.brand);
    formData.append("category1", finalData.category1);
    formData.append("category2", finalData.category2);
    formData.append("category3", finalData.category3);
    formData.append("originalPrice", finalData.originalPrice.toString());
    formData.append("sellingPrice", finalData.sellingPrice.toString());

    // Append shades with nested images
    if (finalData.shades) {
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

    // Now you can post it to your API
    // await axios.post("/your-endpoint", formData);
  };

  return (
    <Fragment>
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
              <Input
                name="title"
                label="Title"
                placeholder="Enter Product title"
                register={productRegister("title")}
                errorText={productErrors.title?.message}
              />
              <Input
                name="brand"
                label="Brand"
                placeholder="Enter Product brand"
                register={productRegister("brand")}
                errorText={productErrors.brand?.message}
              />
              <Select
                value={selectedCategory1}
                label="Category One"
                placeholder="Select a level one category"
                categories={categoriesData}
                onChange={(val) => {
                  productSetValue("category1", val, { shouldValidate: true });
                  productSetValue("category2", "");
                  productSetValue("category3", "");
                }}
                errorText={productErrors.category1?.message}
              />
              <Select
                value={selectedCategory2}
                readOnly={!selectedCategory1}
                label="Category Two"
                placeholder="Select a level two category"
                categories={level2Options}
                onChange={(val) => {
                  productSetValue("category2", val, { shouldValidate: true });
                  productSetValue("category3", "");
                }}
                errorText={productErrors.category2?.message}
              />
              <Select
                value={productWatch("category3")}
                readOnly={!selectedCategory2}
                label="Category Three"
                placeholder="Select a level three category"
                categories={level3Options}
                onChange={(val) =>
                  productSetValue("category3", val, { shouldValidate: true })
                }
                errorText={productErrors.category3?.message}
              />
              <PhoneInput
                name="originalPrice"
                label="Original Price"
                type="number"
                placeholder="Enter Original Price"
                register={productRegister("originalPrice")}
                errorText={productErrors.originalPrice?.message}
                containerClassName="[&>div>div>p]:hidden"
              />
              <PhoneInput
                name="sellingPrice"
                label="Selling Price"
                type="number"
                placeholder="Enter Selling Price"
                register={productRegister("sellingPrice")}
                errorText={productErrors.sellingPrice?.message}
                containerClassName="[&>div>div>p]:hidden"
              />
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
