import { ChangeEvent, ReactNode } from "react";

import { InfoIcon, CheckMark } from "../../icons";
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
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}
const Select = ({
  icon,
  name = "",
  label = "",
  register,
  onChange,
  iconClick,
  className = "",
  errorText = "",
  readOnly = false,
  successText = "",

  containerClassName = "",
}: InputProps & { options?: { label: string; value: string }[] }) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event);
    register?.onChange?.(event);
  };

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;
  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12">
        {label && (
          <label
            htmlFor={name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        <div
          className={`relative w-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 font-normal text-sm overflow-hidden bg-smoke-eerie rounded-lg border border-primary-10 p-3 2xl:py-4 text-primary autofill-effect ${className}`}
        ></div>
        {icon && (
          <span
            onClick={iconClick && iconClick}
            className="h-full absolute top-0 right-0 pr-2 flex justify-center items-center cursor-pointer"
          >
            {icon}
          </span>
        )}
        {/* <select
          name={name}
          id={name}
          value={value}
          disabled={readOnly}
          onChange={handleChange}
          {...register}
        >
          <option value=""></option>
          {navbarCategoriesData.map((category) => (
            <option value="">{category.label}</option>
          ))}
        </select> */}
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
