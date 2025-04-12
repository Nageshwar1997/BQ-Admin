import { ChangeEvent, ReactNode } from "react";
import { InfoIcon } from "../../icons";
import { UseFormRegisterReturn } from "react-hook-form";

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
  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 group">
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
          className={`w-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 font-normal text-sm overflow-hidden bg-smoke-eerie rounded-lg border border-primary-10 p-3 2xl:py-4 flex items-center justify-between ${className}`}
        >
          <p className="text-primary-50 text-sm line-clamp-1">{placeholder}</p>
          <input
            aria-autocomplete="none"
            id={name}
            type="file"
            multiple={true}
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
        <div className="space-y-1">
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
        <div className="mt-4 flex flex-wrap gap-4 border">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="w-20 h-20 relative group rounded overflow-hidden border shadow-sm"
            >
              <img
                src={url}
                alt={`preview-${index}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {handleRemoveImage && (
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs lg:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
