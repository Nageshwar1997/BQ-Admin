import { ChangeEvent } from "react";
import { CheckMark, InfoIcon } from "../../../icons";
import { InputProps } from "../../../types";

const Textarea = ({
  value,
  rows = 4,
  name = "",
  label = "",
  register,
  onChange,
  onKeyDown,
  className = "",
  errorText = "",
  readOnly = false,
  successText = "",
  placeholder = "",
  autoComplete = "off",
  containerClassName = "",
}: InputProps & { rows?: number }) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    register?.onChange?.(event);
  };

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;
  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative min-h-24 max-h-24">
        {label && (
          <label
            htmlFor={name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        {/* Input */}
        <textarea
          aria-autocomplete="none"
          id={name}
          name={name}
          rows={rows}
          value={value}
          {...register}
          readOnly={readOnly}
          disabled={readOnly}
          onKeyDown={onKeyDown}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full min-h-24 max-h-24 outline-none focus:outline-none font-normal text-sm overflow-hidden bg-smoke-eerie rounded-lg border border-primary-10 p-3 2xl:py-4 text-primary placeholder:text-primary-50 placeholder:text-sm resize-none autofill-effect ${className}`}
        />
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

export default Textarea;
