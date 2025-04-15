import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { shadeSchema } from "./product.schema";
import { ShadeType, VerticalScrollType } from "../../../types";
import { RefObject, useState } from "react";
import Button from "../../../components/button/Button";
import ColorPicker from "../../../components/input/colorPicker/ColorPicker";
import Input from "../../../components/input/Input";
import PhoneInput from "../../../components/input/PhoneInput";
import { InfoIcon, UploadCloudIcon } from "../../../icons";
import { CloseIcon } from "../../../components/sidebar/icons";
import useQueryParams from "../../../hooks/useQueryParams";
import ImageUpload from "../../../components/input/ImageUpload";
import useVerticalScrollable from "../../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../../../components/Gradients";
import { shadeInitialValue } from "../data";

interface ShadeFormProps {
  setShades: React.Dispatch<React.SetStateAction<ShadeType[]>>;
}

const AddShade = ({ setShades }: ShadeFormProps) => {
  const { removeParam } = useQueryParams();
  const [showGradient, containerRef] = useVerticalScrollable();

  const {
    register: shadeRegister,
    handleSubmit: shadeHandleSubmit,
    reset: shadeReset,
    control: shadeControl,
    formState: { errors: shadeErrors },
  } = useForm<ShadeType>({
    resolver: yupResolver(shadeSchema),
    defaultValues: shadeInitialValue,
  });

  const [shadeImages, setShadeImages] = useState<File[]>([]);
  const [shadeImagePreviews, setShadeImagePreviews] = useState<string[]>([]);

  const onSubmitShade = (data: ShadeType) => {
    console.log("✅ Shade submitted", data);
    setShades((prevShades) => [...prevShades, data]);
    shadeReset();
    setShadeImages([]);
    setShadeImagePreviews([]);
    removeParam("shade");
  };
  return (
    <div className="z-[100] fixed inset-0 w-full h-full flex justify-center items-center bg-primary-inverted-50 backdrop-blur-[2px]">
      <div className="max-w-lg max-h-[85dvh] md:max-h-[95dvh] w-full rounded-lg border border-secondary-battleship-davys-gray shadow-light-dark-soft bg-platinum-black relative overflow-hidden">
        {(showGradient as VerticalScrollType).top && (
          <TopGradient className="!w-full h-8 z-[4]" />
        )}
        <div
          className="w-full max-h-[85dvh] md:max-h-[95dvh] overflow-y-scroll p-4"
          ref={containerRef as RefObject<HTMLDivElement>}
        >
          <form
            className="w-full flex flex-col gap-7"
            onSubmit={shadeHandleSubmit(onSubmitShade)}
          >
            <div className="flex items-center justify-between border-b border-primary-50 pb-2">
              <div className="flex items-center gap-1 group">
                <h3 className="text-lg text-tertiary group-hover:text-primary">
                  Add Shade
                </h3>
                <InfoIcon className="cursor-pointer fill-tertiary group-hover:fill-primary" />
              </div>
              <CloseIcon
                onClick={() => {
                  shadeReset();
                  setShadeImages([]);
                  setShadeImagePreviews([]);
                  removeParam("shade");
                }}
                className="[&>path]:stroke-tertiary [&>path]:hover:stroke-primary cursor-pointer"
              />
            </div>
            <Input
              name="shadeName"
              label="Shade Name"
              placeholder="Enter shade name"
              register={shadeRegister("shadeName")}
              errorText={shadeErrors.shadeName?.message}
            />
            <Controller
              control={shadeControl}
              name="colorCode"
              render={({ field }) => (
                <ColorPicker
                  label="Select Color"
                  value={field.value}
                  onChange={field.onChange}
                  errorText={shadeErrors.colorCode?.message}
                />
              )}
            />
            <PhoneInput
              name="stock"
              label="Stock"
              type="number"
              placeholder="Enter stock"
              register={shadeRegister("stock")}
              errorText={shadeErrors.stock?.message}
              containerClassName="[&>div>div>p]:hidden"
            />
            <Controller
              control={shadeControl}
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
                    Array.isArray(shadeErrors.images)
                      ? shadeErrors.images?.map((err) => err.message)
                      : shadeErrors.images?.message
                      ? [shadeErrors.images?.message]
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
                onClick={() => {
                  setShadeImages([]);
                  setShadeImagePreviews([]);
                  shadeReset();
                }}
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
        {(showGradient as VerticalScrollType).bottom && (
          <BottomGradient className="!w-full h-8 z-[4]" />
        )}
      </div>
    </div>
  );
};

export default AddShade;
