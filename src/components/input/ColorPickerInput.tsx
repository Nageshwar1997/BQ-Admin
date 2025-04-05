import type { Color } from "@rc-component/color-picker";
import ColorPicker from "@rc-component/color-picker";
import { useMemo, useState } from "react";
import "@rc-component/color-picker/assets/index.css";
import { CheckMark, ColorPickerPulseIcon, InfoIcon } from "../../icons";

export interface ColorPickerInputProps {
  value: string;
  name: string;
  onChange: (value: Color | string) => void;
  label?: string;
  errorText?: string;
  readOnly?: boolean;
  successText?: string;
  containerClassName?: string;
}

const toHexFormat = (value?: string) =>
  value?.replace(/[^0-9a-fA-F#]/g, "").slice(0, 9) || "";

const ColorPickerInput = ({
  value = "#000000",
  // name = "",
  label = "",
  errorText = "",
  readOnly = false,
  successText = "",
  containerClassName = "",
}: ColorPickerInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const extractRGB = (rgba: string): string => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const [, r, g, b] = match;
      return `rgb(${r}, ${g}, ${b})`;
    }
    return rgba;
  };

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;

  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12">
        {label && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer outline-none focus:outline-none z-[3]`}
          >
            {label}
          </button>
        )}
        <div
          className="w-full h-10 lg:h-12 items-center justify-between text-sm flex bg-smoke-eerie rounded-lg border border-primary-10 text-primary cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <p
            className={`uppercase p-3 2xl:py-4 text-sm ${
              color.toLowerCase() !== value.toLowerCase()
                ? "text-primary"
                : "text-primary-50"
            }`}
          >
            {color}
          </p>

          <div className="min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 min-w-10 max-w-10 lg:min-w-12 lg:max-w-12 w-full h-full p-1 relative overflow-hidden">
            <div className="bg-[url(/images/transparent-background-image.webp)] bg-cover bg-center bg-no-repeat absolute inset-1 rounded-sm z-0" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              className="absolute inset-1 text-primary-50 rounded-sm z-[1] outline-none flex items-center justify-center"
              style={{
                backgroundColor: color,
                border: `1px solid ${extractRGB(hexCode.toString())}`,
              }}
            >
              <ColorPickerPulseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-12 md:top-[50px] z-10">
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

export default ColorPickerInput;
