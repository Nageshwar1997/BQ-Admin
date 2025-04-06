import { Controller, useForm } from "react-hook-form";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import PhoneInput from "../../../components/input/PhoneInput";
import Select from "../../../components/input/Select";
import { categoriesData } from "../data/categoriesData";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "./product.schema";
import { InfoIcon } from "../../../icons";
import { useState } from "react";
import { DevTool } from "@hookform/devtools";

const FormTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-1">
    <h3 className="text-lg">{title}</h3>
    <InfoIcon className="cursor-pointer" />
  </div>
);

const ProductForm = () => {
  const [shades, setShades] = useState<any[]>([]);
  const [commonImages, setCommonImages] = useState<File[]>([]);
  const [commonImagePreviews, setCommonImagePreviews] = useState<string[]>([]);

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

  const onSubmitProduct = (data: any) => {
    console.log("✅ Product submitted", data);
    // const finalProductData = {
    //   ...data,
    //   shades,
    // };
    // console.log("✅ Final Product Upload Data:", {
    //   ...finalProductData,
    //   shades: shades.map(({ images, ...rest }) => ({
    //     ...rest,
    //     images: images.map((img: File) => img.name),
    //   })),
    // });
    // TODO: Submit to backend
  };

  return (
    <form
      className="w-full p-4 flex flex-col gap-7 border"
      onSubmit={productHandleSubmit(onSubmitProduct)}
    >
      <FormTitle title="Product Details" />
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
      />
      <PhoneInput
        name="sellingPrice"
        label="Selling Price"
        type="number"
        placeholder="Enter Selling Price"
        register={productRegister("sellingPrice")}
        errorText={productErrors.sellingPrice?.message}
      />
      <Controller
        control={productControl}
        name="commonImages"
        defaultValue={[]}
        render={({ field }) => (
          <>
            <label htmlFor="commonImages" className="text-sm font-medium">
              Shade Images
            </label>
            <input
              id="commonImages"
              type="file"
              multiple
              // accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const previews = files.map((file) => URL.createObjectURL(file));

                setCommonImages((prev) => [...prev, ...files]);
                setCommonImagePreviews((prev) => [...prev, ...previews]);

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
  );
};

export default ProductForm;
