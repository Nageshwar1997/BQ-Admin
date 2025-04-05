import { useForm } from "react-hook-form";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import PhoneInput from "../../../components/input/PhoneInput";
import Select from "../../../components/input/Select";
import { categoriesData } from "../data/categoriesData";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "./product.schema";
import { InfoIcon } from "../../../icons";
import { useState } from "react";

const FormTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-1">
    <h3 className="text-lg">{title}</h3>
    <InfoIcon className="cursor-pointer" />
  </div>
);

const ProductForm = () => {
  const [shades, setShades] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  const selectedCategory1 = watch("category1");
  const selectedCategory2 = watch("category2");

  const level1Data = categoriesData.find(
    (cat) => cat.value === selectedCategory1
  );
  const level2Options = level1Data?.subCategories || [];
  const level2Data = level2Options.find(
    (cat) => cat.value === selectedCategory2
  );
  const level3Options = level2Data?.subCategories || [];

  const onSubmitProduct = (data: any) => {
    const finalProductData = {
      ...data,
      shades,
    };

    console.log("✅ Final Product Upload Data:", {
      ...finalProductData,
      shades: shades.map(({ images, ...rest }) => ({
        ...rest,
        images: images.map((img: File) => img.name),
      })),
    });

    // TODO: Submit to backend
  };

  return (
    <form
      className="w-full p-4 flex flex-col gap-7 border"
      onSubmit={handleSubmit(onSubmitProduct)}
    >
      <FormTitle title="Product Details" />
      <Input
        name="title"
        label="Title"
        placeholder="Enter Product title"
        register={register("title")}
        errorText={errors.title?.message}
      />
      <Input
        name="brand"
        label="Brand"
        placeholder="Enter Product brand"
        register={register("brand")}
        errorText={errors.brand?.message}
      />
      <Select
        value={selectedCategory1}
        label="Category One"
        placeholder="Select a level one category"
        categories={categoriesData}
        onChange={(val) => {
          setValue("category1", val, { shouldValidate: true });
          setValue("category2", "");
          setValue("category3", "");
        }}
        errorText={errors.category1?.message}
      />
      <Select
        value={selectedCategory2}
        readOnly={!selectedCategory1}
        label="Category Two"
        placeholder="Select a level two category"
        categories={level2Options}
        onChange={(val) => {
          setValue("category2", val, { shouldValidate: true });
          setValue("category3", "");
        }}
        errorText={errors.category2?.message}
      />
      <Select
        value={watch("category3")}
        readOnly={!selectedCategory2}
        label="Category Three"
        placeholder="Select a level three category"
        categories={level3Options}
        onChange={(val) => setValue("category3", val, { shouldValidate: true })}
        errorText={errors.category3?.message}
      />
      <PhoneInput
        name="originalPrice"
        label="Original Price"
        type="number"
        placeholder="Enter Original Price"
        register={register("originalPrice")}
        errorText={errors.originalPrice?.message}
      />
      <PhoneInput
        name="sellingPrice"
        label="Selling Price"
        type="number"
        placeholder="Enter Selling Price"
        register={register("sellingPrice")}
        errorText={errors.sellingPrice?.message}
      />
      <Button pattern="primary" type="submit" content="Upload" />
    </form>
  );
};

export default ProductForm;
