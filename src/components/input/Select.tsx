import { ReactNode, useState } from "react";

import { InfoIcon, CheckMark, DropdownIcon } from "../../icons";
import { UseFormRegisterReturn } from "react-hook-form";
import { navbarCategoriesData } from "../navbar/data";

export interface InputProps {
  icon?: ReactNode;
  name?: string;
  value?: string;
  label?: string;
  readOnly?: boolean;
  errorText?: string;
  className?: string;
  successText?: string;
  containerClassName?: string;
  register?: UseFormRegisterReturn;
  iconClick?: () => void;
  onChange?: (val: string) => void;
}
const Select = ({
  icon,
  name = "",
  label = "",
  iconClick,
  className = "",
  errorText = "",
  readOnly = false,
  successText = "",

  containerClassName = "",
}: InputProps & { options?: { label: string; value: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const selected = navbarCategoriesData.find(
    (opt) => opt.category === selectedOption
  );

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;
  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12">
        {label && (
          <label
            htmlFor={name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer z-[1]`}
          >
            {label}
          </label>
        )}
        <div
          className={`relative w-full h-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 font-normal text-sm bg-smoke-eerie rounded-lg border border-primary-10 p-3 2xl:py-4 text-primary flex justify-between items-center autofill-effect ${className}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>{selected?.label || "Select an option"}</span>
          <DropdownIcon
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          {isOpen && (
            <div className="absolute left-0 top-full w-full z-[1] mt-1 rounded-lg border border-primary-10 bg-smoke-eerie shadow-md overflow-hidden py-2">
              <ul className="max-h-60 overflow-auto px-1">
                {navbarCategoriesData.map((option) => (
                  <li
                    key={option.category}
                    className="p-2 hover:bg-primary-10 text-primary cursor-pointer text-sm rounded-[4px]"
                    onClick={() => {
                      setSelectedOption(option.category);
                      setIsOpen((prev) => !prev);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {icon && (
          <span
            onClick={iconClick && iconClick}
            className="h-full absolute top-0 right-0 pr-2 flex justify-center items-center cursor-pointer"
          >
            {icon}
          </span>
        )}
      </div>
      {!readOnly && (isError || isSuccess) && (
        <p
          className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight mt-2 text-red-500`}
        >
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
