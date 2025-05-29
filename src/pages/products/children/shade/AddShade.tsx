import { Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { shadeSchema } from "../product.schema";
import { ShadeType } from "../../../../types";
import Button from "../../../../components/button/Button";
import ColorPicker from "../../../../components/input/colorPicker/ColorPicker";
import Input from "../../../../components/input/Input";
import PhoneInput from "../../../../components/input/PhoneInput";
import { InfoIcon, UploadCloudIcon } from "../../../../icons";
import { CloseIcon } from "../../../../components/sidebar/icons";
import useQueryParams from "../../../../hooks/useQueryParams";
import ImageUpload from "../../../../components/input/ImageUpload";
import useVerticalScrollable from "../../../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../../../../components/Gradients";
import { shadeInitialValue } from "../../data";

interface ShadeFormProps {
  setShades: Dispatch<SetStateAction<ShadeType[]>>;
}

const AddShade = ({ setShades }: ShadeFormProps) => {
  const { removeParam, queryParams } = useQueryParams();
  const [showGradient, containerRef] = useVerticalScrollable();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof shadeSchema>>({
    resolver: zodResolver(shadeSchema),
    defaultValues: shadeInitialValue,
  });

  const [shadeImages, setShadeImages] = useState<File[]>([]);
  const [shadeImagePreviews, setShadeImagePreviews] = useState<string[]>([]);

  const handleClose = () => {
    shadeImagePreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });
    reset();
    setShadeImages([]);
    setShadeImagePreviews([]);
    if (queryParams.shade === "add") {
      removeParam("shade");
    }
  };

  const onSubmitShade = (data: ShadeType) => {
    console.log("✅ Shade submitted", data);
    setShades((prevShades) => [...prevShades, data]);

    handleClose();
  };

  return (
    <div className="z-[100] fixed inset-0 w-full h-full flex justify-center items-center bg-primary-inverted-50 backdrop-blur-[2px]">
      <div className="max-w-lg max-h-[85dvh] md:max-h-[95dvh] w-full rounded-lg border border-secondary-battleship-davys-gray shadow-light-dark-soft bg-platinum-black relative overflow-hidden">
        {showGradient.top && <TopGradient className="!w-full h-8 z-[4]" />}
        <div
          className="w-full max-h-[85dvh] md:max-h-[95dvh] overflow-y-scroll p-4"
          ref={containerRef}
        >
          <form
            className="w-full flex flex-col gap-7"
            onSubmit={handleSubmit(onSubmitShade)}
          >
            <div className="flex items-center justify-between border-b border-primary-50 pb-2">
              <div className="flex items-center gap-1 group">
                <h3 className="text-lg text-tertiary group-hover:text-primary">
                  Add Shade
                </h3>
                <InfoIcon className="cursor-pointer fill-tertiary group-hover:fill-primary" />
              </div>
              <CloseIcon
                onClick={handleClose}
                className="[&>path]:stroke-tertiary [&>path]:hover:stroke-primary cursor-pointer"
              />
            </div>
            <Input
              name="shadeName"
              label="Shade Name"
              placeholder="Enter shade name"
              register={register("shadeName")}
              errorText={errors.shadeName?.message}
            />
            <Controller
              control={control}
              name="colorCode"
              render={({ field }) => (
                <ColorPicker
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
              type="number"
              placeholder="Enter stock"
              register={register("stock")}
              errorText={errors.stock?.message}
              containerClassName="[&>div>div>p]:hidden"
            />
            <Controller
              control={control}
              name="images"
              defaultValue={[]}
              render={({ field }) => (
                <ImageUpload
                  name={"images"}
                  label="Images"
                  placeholder="Select Shade Images"
                  previewUrls={shadeImagePreviews}
                  containerClassName="w-full sm:col-span-3"
                  errors={
                    Array.isArray(errors.images)
                      ? errors.images?.map((err) => err.message)
                      : errors.images?.message
                      ? [errors.images?.message]
                      : []
                  }
                  handleChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const previews = files.map((file) =>
                      URL.createObjectURL(file)
                    );

                    const newFiles = [...shadeImages, ...files];
                    const newPreviews = [...shadeImagePreviews, ...previews];

                    setShadeImages(newFiles);
                    setShadeImagePreviews(newPreviews);
                    field.onChange(newFiles);
                  }}
                  handleRemoveImage={(idx) => {
                    const updatedFiles = shadeImages.filter(
                      (_, index) => index !== idx
                    );
                    const updatedPreviews = shadeImagePreviews.filter(
                      (_, index) => index !== idx
                    );
                    setShadeImages(updatedFiles);
                    setShadeImagePreviews(updatedPreviews);
                    field.onChange(updatedFiles);
                  }}
                  icon={
                    <UploadCloudIcon className="[&>path]:stroke-primary opacity-50 group-hover:opacity-100" />
                  }
                />
              )}
            />
            <div className="flex items-center gap-4 justify-center">
              <Button
                pattern="secondary"
                className="!py-3 max-h-12 !rounded-lg"
                content="Reset"
                onClick={handleClose}
              />
              <Button
                pattern="primary"
                type="submit"
                className="!py-3 max-h-12 !rounded-lg"
                content="Add Shade"
              />
            </div>
          </form>
        </div>
        {showGradient.bottom && (
          <BottomGradient className="!w-full h-8 z-[4]" />
        )}
      </div>
    </div>
  );
};

export default AddShade;
