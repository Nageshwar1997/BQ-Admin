import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../../../components/button/Button";
import PathNavigation from "../../../components/PathNavigation";
import { InfoIcon, UploadCloudIcon } from "../../../icons";
import Input from "../../../components/input/Input";
import { shadeSchema } from "./product.schema";
import PhoneInput from "../../../components/input/PhoneInput";
import ColorPickerInput from "../../../components/input/ColorPickerInput";
import { ShadeType } from "../../../types";

const FormTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-1">
    <h3 className="text-lg">{title}</h3>
    <InfoIcon className="cursor-pointer" />
  </div>
);

const shadeInitialValue: ShadeType = {
  shadeName: "",
  colorCode: "",
  stock: null,
  images: [],
};

const UploadProduct = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ShadeType>({
    resolver: yupResolver(shadeSchema),
    defaultValues: shadeInitialValue,
  });

  const [shadeImages, setShadeImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // const [shades, setShades] = useState<any[]>([]);

  const onSubmitShade = (data: ShadeType) => {
    console.log("✅ Shade submitted", data);
    reset();
    setShadeImages([]);
    setImagePreviews([]);
  };

  console.log("errors.images.message", errors);

  return (
    <div className="w-full space-y-3">
      <div className="w-full px-4 py-2 border-b border-primary-50 flex justify-between items-center sticky top-16 bg-primary-inverted z-10 shadow-lg">
        <PathNavigation />
        <Button
          pattern="secondary"
          content="Upload"
          className="max-w-28 !py-1.5 my-1.5 !px-5 !rounded-lg gap-2"
          onClick={() => navigate("upload")}
          rightIcon={<UploadCloudIcon className="w-5 h-5" />}
        />
      </div>
      <div className="mx-auto rounded-lg shadow-light-dark-soft bg-platinum-black">
        <div className="w-full h-full flex flex-col lg:flex-row gap-5">
          {/* Product Form */}

          {/* Shade Form */}
          <form
            className="w-full p-4 flex flex-col gap-7 border sticky top-[141px]"
            onSubmit={handleSubmit(onSubmitShade)}
          >
            <FormTitle title="Add a Shade" />
            <Input
              name="shadeName"
              label="Shade Name"
              placeholder="Enter shade name"
              register={register("shadeName")}
              errorText={errors.shadeName?.message}
            />
            <div className="flex flex-col base:flex-row gap-4">
              <Controller
                control={control}
                name="colorCode"
                render={({ field }) => (
                  <ColorPickerInput
                    name="colorCode"
                    label="Select Color"
                    value={field.value}
                    onChange={field.onChange}
                    errorText={errors.colorCode?.message}
                  />
                )}
              />

              <PhoneInput
                name="stock"
                label="Stock"
                placeholder="Enter stock"
                register={register("stock")}
                errorText={errors.stock?.message}
                containerClassName="[&>div>div>p]:hidden"
              />
            </div>

            {/* Image Upload */}
            <Controller
              control={control}
              name="images"
              defaultValue={[]}
              render={({ field }) => (
                <>
                  <label htmlFor="images" className="text-sm font-medium">
                    Shade Images
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    // accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const previews = files.map((file) =>
                        URL.createObjectURL(file)
                      );

                      setShadeImages((prev) => [...prev, ...files]);
                      setImagePreviews((prev) => [...prev, ...previews]);

                      // ✅ Update form field
                      field.onChange([...shadeImages, ...files]);
                    }}
                  />
                  {Array.isArray(errors.images) &&
                    errors.images.map(
                      (error, index) =>
                        error && (
                          <p key={index} className="text-red-500 text-sm">
                            {error.message}
                          </p>
                        )
                    )}

                  {errors.images?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.images.message}
                    </p>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imagePreviews.map((src, idx) => (
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
            <Button pattern="primary" type="submit" content="Add Shade" />
          </form>
          <DevTool control={control} />
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
