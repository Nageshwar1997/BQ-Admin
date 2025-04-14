import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { shadeSchema } from "./product.schema";
import { ShadeType, VerticalScrollType } from "../../../types";
import { RefObject, useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import ColorPickerInput from "../../../components/input/ColorPickerInput";
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
  shades: ShadeType[];
}

const EditShade = ({ shades, setShades }: ShadeFormProps) => {
  const { removeParam, queryParams } = useQueryParams();
  const [showGradient, containerRef] = useVerticalScrollable();
  const editIndex = queryParams.index ? JSON.parse(queryParams.index) : -1;

  const [editingShade, setEditingShade] = useState<ShadeType | null>(null);
  const [shadeImages, setShadeImages] = useState<File[]>([]);
  const [shadeImagePreviews, setShadeImagePreviews] = useState<string[]>([]);

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

  const handleClose = () => {
    setEditingShade(null);
    shadeReset();
    setShadeImages([]);
    setShadeImagePreviews([]);
    removeParam("shade");
    removeParam("index");
  };

  const onSubmitShade = (data: ShadeType) => {
    setShades((prevShades) => {
      const updatedShades = [...prevShades];
      updatedShades[editIndex] = {
        ...data,
        images: shadeImages,
      };
      return updatedShades;
    });
    handleClose();
  };

  console.log("shadeImages", shadeImages);
  useEffect(() => {
    if (editIndex !== undefined && shades[editIndex]) {
      const selectedShade = shades[editIndex];
      setEditingShade(selectedShade);

      shadeReset({
        ...selectedShade,
      });

      const imageFiles = selectedShade.images;
      if (imageFiles && imageFiles.length > 0) {
        const imgUrls = imageFiles.map((file) =>
          file instanceof File ? URL.createObjectURL(file) : file
        );
        setShadeImagePreviews(imgUrls);
      }
    }

    return () => {
      handleClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editIndex, shades]);
  return editingShade ? (
    <div className="z-[100] fixed inset-0 w-full h-full flex justify-center items-center bg-primary-inverted-50 backdrop-blur-[2px] p-5">
      <div className="max-w-xl max-h-[80dvh] w-full rounded-lg border border-secondary-battleship-davys-gray shadow-light-dark-soft bg-platinum-black relative overflow-hidden">
        {(showGradient as VerticalScrollType).top && (
          <TopGradient className="!w-full h-8 z-[4]" />
        )}
        <div
          className="w-full max-h-[80dvh] overflow-y-scroll p-4"
          ref={containerRef as RefObject<HTMLDivElement>}
        >
          <form
            className="w-full flex flex-col gap-7"
            onSubmit={shadeHandleSubmit(onSubmitShade)}
          >
            <div className="flex items-center justify-between mb-2 border-b border-primary-50 pb-2">
              <div className="flex items-center gap-1 group">
                <h3 className="text-lg text-tertiary group-hover:text-primary">
                  Edit Shade
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
              register={shadeRegister("shadeName")}
              errorText={shadeErrors.shadeName?.message}
            />
            <div className="flex flex-col base:flex-row gap-7 base:gap-4">
              <Controller
                control={shadeControl}
                name="colorCode"
                render={({ field }) => (
                  <ColorPickerInput
                    name="colorCode"
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
                placeholder="Enter stock"
                register={shadeRegister("stock")}
                errorText={shadeErrors.stock?.message}
                containerClassName="[&>div>div>p]:hidden"
              />
            </div>
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
            <Button pattern="primary" type="submit" content="Add Shade" />
          </form>
        </div>
        {(showGradient as VerticalScrollType).bottom && (
          <BottomGradient className="!w-full h-8 z-[4]" />
        )}
      </div>
    </div>
  ) : null;
};

export default EditShade;
