import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { InfoIcon, CheckMark, DropdownIcon } from "../../../icons";

export interface SelectInputProps {
  value: string;
  label?: string;
  readOnly?: boolean;
  errorText?: string;
  className?: string;
  placeholder?: string;
  successText?: string;
  containerClassName?: string;
  register?: UseFormRegisterReturn;
  iconClick?: () => void;
  onChange?: (val: { name: string; category: string }) => void;
  categories: { name: string; category: string }[];
}

const Select = ({
  value = "",
  label = "",
  className = "",
  errorText = "",
  readOnly = false,
  successText = "",
  onChange,
  placeholder = "",
  containerClassName = "",
  categories,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selected = categories.find((opt) => opt.category === value);
  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;

  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12">
        {label && (
          <button
            type="button"
            onClick={() => !readOnly && setIsOpen((prev) => !prev)}
            className="text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer z-[1]"
          >
            {label}
          </button>
        )}
        <div
          className={`relative w-full h-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 font-normal text-sm bg-smoke-eerie rounded-lg border border-primary-10 p-3 2xl:py-4 text-primary flex justify-between items-center autofill-effect cursor-pointer ${className}`}
          onClick={() => !readOnly && setIsOpen((prev) => !prev)}
        >
          <span
            className={`line-clamp-1 ${
              selected?.category ? "" : "text-primary-50"
            }`}
          >
            {selected?.name || placeholder}
          </span>
          <DropdownIcon
            className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          {isOpen && (
            <div className="absolute left-0 top-full w-full z-[2] mt-1 rounded-lg border border-primary-10 bg-smoke-eerie shadow-md overflow-hidden py-2">
              <ul className="max-h-60 overflow-auto px-1 space-y-0.5">
                {categories.map((option) => (
                  <li
                    key={option.category}
                    className={`p-2 hover:bg-primary-10 text-primary cursor-pointer text-sm rounded-[4px] ${
                      selected?.category === option.category
                        ? "bg-primary-8"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange?.({
                        name: option.name,
                        category: option.category,
                      });
                      setIsOpen(false);
                    }}
                  >
                    {option.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {!readOnly && (isError || isSuccess) && (
        <p className="w-full text-start flex gap-1 items-center text-[11px] leading-tight mt-2 text-red-500">
          {isError ? (
            <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
          ) : (
            <CheckMark className="w-3 h-3 md:w-4 md:h-4 fill-green-500" />
          )}
          <span>{isError ? errorText : successText}</span>
        </p>
      )}
    </div>
  );
};

export default Select;
