import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { shadeSchema } from "./product.schema";
import { ShadeType } from "../../../types";
import { useState } from "react";
import Button from "../../../components/button/Button";
import ColorPickerInput from "../../../components/input/ColorPickerInput";
import Input from "../../../components/input/Input";
import PhoneInput from "../../../components/input/PhoneInput";
import { InfoIcon } from "../../../icons";
import { CloseIcon } from "../../../components/sidebar/icons";
import useQueryParams from "../../../hooks/useQueryParams";

interface ShadeFormProps {
  setShades: React.Dispatch<React.SetStateAction<ShadeType[]>>;
}

const shadeInitialValue: ShadeType = {
  shadeName: "",
  colorCode: "",
  stock: null,
  images: [],
};

const AddShade = ({ setShades }: ShadeFormProps) => {
  const { removeParam } = useQueryParams();

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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // const [shades, setShades] = useState<any[]>([]);

  const onSubmitShade = (data: ShadeType) => {
    console.log("✅ Shade submitted", data);
    setShades((prevShades) => [...prevShades, data]);
    shadeReset();
    setShadeImages([]);
    setImagePreviews([]);
    removeParam("shade");
  };
  return (
    <div className="border z-[100] fixed inset-0 w-full h-full flex justify-center items-center bg-primary-inverted-50 backdrop-blur-[2px] p-5">
      <form
        className="max-w-xl w-full p-4 flex flex-col gap-7 rounded-lg border border-secondary-battleship-davys-gray shadow-light-dark-soft bg-platinum-black"
        onSubmit={shadeHandleSubmit(onSubmitShade)}
      >
        <div className="flex items-center justify-between mb-2 border-b border-primary-50 pb-2">
          <div className="flex items-center gap-1 group">
            <h3 className="text-lg text-tertiary group-hover:text-primary">Add Shade</h3>
            <InfoIcon className="cursor-pointer fill-tertiary group-hover:fill-primary" />
          </div>
          <CloseIcon
            onClick={() => {
              shadeReset();
              setShadeImages([]);
              setImagePreviews([]);
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
        {/* Image Upload */}
        <Controller
          control={shadeControl}
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
              {Array.isArray(shadeErrors.images) &&
                shadeErrors.images.map(
                  (error, index) =>
                    error && (
                      <p key={index} className="text-red-500 text-sm">
                        {error.message}
                      </p>
                    )
                )}

              {shadeErrors.images?.message && (
                <p className="text-red-500 text-sm">
                  {shadeErrors.images.message}
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
    </div>
  );
};

export default AddShade;
