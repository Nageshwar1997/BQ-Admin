import { ChangeEvent, ReactNode, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { InfoIcon } from "../../../icons";
import { CloseIcon } from "../../../icons";
import ImageCarousel from "../../layout/modals/ImageCarousel";
import { ALLOWED_IMAGE_TYPES } from "../../../constants";

const ImageUpload = ({
  icon,
  label,
  errors,
  className,
  placeholder,
  containerClassName,
  handleChange,
  name,
  register,
  previewUrls = [],
  handleRemoveImage,
  readOnly = false,
}: {
  icon: ReactNode;
  label?: string;
  errors?: string[];
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  name: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegisterReturn;
  readOnly?: boolean;
  previewUrls?: string[];
  handleRemoveImage?: (index: number) => void;
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <div className={`w-full ${containerClassName}`}>
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 group mb-1.5">
        {label && (
          <label
            htmlFor={name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        {/* Input */}
        <label
          htmlFor={name}
          className={`w-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 font-normal text-sm overflow-hidden bg-smoke-eerie rounded-lg border border-primary-10 p-3 2xl:py-4 flex items-center justify-between cursor-pointer ${className}`}
        >
          <p className="text-primary-50 text-sm line-clamp-1">{placeholder}</p>
          <input
            aria-autocomplete="none"
            id={name}
            type="file"
            multiple={true}
            accept={ALLOWED_IMAGE_TYPES.join(", ")}
            className="hidden"
            name={name}
            {...register}
            readOnly={readOnly}
            disabled={readOnly}
            onChange={handleChange}
          />
          {icon && (
            <span className="h-full flex justify-center items-center cursor-pointer">
              {icon}
            </span>
          )}
        </label>
      </div>
      {errors && errors?.length > 0 && (
        <div className="space-y-1 mb-1.5">
          {errors.map((error, index) => (
            <p
              key={index}
              className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight mt-2 text-red-500`}
            >
              <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
              <span>{error}</span>
            </p>
          ))}
        </div>
      )}
      {previewUrls.length > 0 && (
        <div className="border border-primary-10 bg-smoke-eerie rounded-lg p-2 !mt-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(5rem,1fr))]">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="w-full aspect-square relative group rounded overflow-hidden border border-primary-30 shadow-sm"
            >
              <img
                src={url}
                alt={`preview-${index}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => {
                  setModalIndex(index);
                  setShowImageModal(true);
                }}
              />
              {handleRemoveImage && (
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="absolute top-0.5 right-0.5 bg-tertiary rounded-full p-0.5 flex items-center justify-center text-xs"
                >
                  <CloseIcon className="w-3 h-3 [&>path]:stroke-primary-inverted" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {showImageModal && modalIndex !== null && (
        <ImageCarousel
          index={modalIndex}
          previewUrls={previewUrls}
          onClose={() => {
            setShowImageModal(false);
            setModalIndex(null);
          }}
          handleRemoveImage={handleRemoveImage}
        />
      )}
    </div>
  );
};

export default ImageUpload;
