import type { Color } from "@rc-component/color-picker";
import ColorPicker from "@rc-component/color-picker";
import { useMemo, useState } from "react";
import "@rc-component/color-picker/assets/index.css";
import { InputProps } from "../../types";
import { CheckMark, InfoIcon } from "../../icons";

const toHexFormat = (value?: string) =>
  value?.replace(/[^0-9a-fA-F#]/g, "").slice(0, 9) || "";

const ColorPickerInput = ({
  icon,
  value = "#000000",
  name = "",
  label = "",
  iconClick,
  errorText = "",
  readOnly = false,
  successText = "",
  containerClassName = "",
}: InputProps) => {
  const [hexCode, setHexCode] = useState<Color | string>(value);
  const color = useMemo(
    () =>
      typeof hexCode === "string"
        ? hexCode
        : hexCode.a < 1
        ? hexCode.toHexString()
        : hexCode.toHexString(),
    [hexCode]
  );

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
          <p>{value}</p>
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
      <div style={{ width: 600 }} className="absolute top-12">
        <ColorPicker
          value={hexCode}
          onChange={setHexCode}
          panelRender={(panel) => (
            <>
              {panel}
              <div className="space-y-1 mt-2">
                <label className="block text-xs font-medium text-gray-600">
                  HEX
                </label>
                <input
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black"
                  value={color}
                  onChange={(e) => {
                    const originValue = e.target.value;
                    setHexCode(toHexFormat(originValue));
                  }}
                />
              </div>
            </>
          )}
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

export default ColorPickerInput;
