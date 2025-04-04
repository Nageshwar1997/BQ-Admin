import { ChangeEvent } from "react";
import { CheckMark, InfoIcon } from "../../icons";
import { InputProps } from "../../types";

const PhoneInput = ({
  icon,
  value,
  name = "",
  label = "",
  register,
  onChange,
  onKeyDown,
  iconClick,
  type = "text",
  className = "",
  errorText = "",
  readOnly = false,
  successText = "",
  placeholder = "",
  autoComplete = "off",
  containerClassName = "",
}: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        {/* Input */}
        <div className="w-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 fle items-center text-sm flex bg-smoke-eerie rounded-lg border border-primary-10 text-primary">
          <p className="w-[16%] min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 h-full text-primary-50 content-center text-center border-r border-primary-10 p-3 2xl:py-4">
            +91
          </p>
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            {...register}
            readOnly={readOnly}
            disabled={readOnly}
            onKeyDown={onKeyDown}
            onChange={handleChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onWheel={(event) => event.currentTarget.blur()}
            className={`w-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 outline-none focus:outline-none font-normal overflow-hidden bg-transparent p-3 2xl:py-4 placeholder:text-primary-50 placeholder:text-sm ${
              icon && "pr-10"
            } autofill-effect number-input-mouse-control-none ${className}`}
          />
        </div>

        {/* Icon */}
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

export default PhoneInput;
