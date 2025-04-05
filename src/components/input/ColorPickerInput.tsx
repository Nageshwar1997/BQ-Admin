import type { Color } from "@rc-component/color-picker";
import ColorPicker from "@rc-component/color-picker";
import { useEffect, useMemo, useState } from "react";
import "@rc-component/color-picker/assets/index.css";
import { CheckMark, ColorPickerPulseIcon, InfoIcon } from "../../icons";

export interface ColorPickerInputProps {
  value: string;
  name: string;
  onChange: (value: string) => void;
  label?: string;
  errorText?: string;
  readOnly?: boolean;
  successText?: string;
  containerClassName?: string;
}

const toHexFormat = (value?: string) =>
  value?.replace(/[^0-9a-fA-F#]/g, "").slice(0, 9) || "";

const ColorPickerInput = ({
  value = "",
  name = "",
  onChange,
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

  useEffect(() => {
    const hexValue =
      typeof hexCode === "string" ? hexCode : hexCode.toHexString();

    if (hexValue !== value) {
      onChange(hexValue);
    }
  }, [hexCode, onChange, value]);

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;

  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12">
        {label && (
          <label
            htmlFor={name}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer z-[3]`}
          >
            {label}
          </label>
        )}
        <div
          className="w-full h-10 lg:h-12 items-center justify-between text-sm flex bg-smoke-eerie rounded-lg border border-primary-10 text-primary cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <p
            className={`p-3 2xl:py-4 text-sm ${
              value ? "text-primary uppercase" : "text-primary-50"
            }`}
          >
            {value ? color : "Select Color"}
          </p>

          <div className="min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 min-w-10 max-w-10 lg:min-w-12 lg:max-w-12 w-full h-full p-1 relative overflow-hidden">
            <div className="bg-[url(/images/transparent-background-image.webp)] bg-cover bg-center bg-no-repeat absolute inset-1 rounded-sm z-0" />
            <label
              htmlFor={name}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              className="absolute inset-1 text-primary-50 rounded-sm z-[1] flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: color || "var(--primary)",
                border: `1px solid ${extractRGB(hexCode.toString())}`,
              }}
            >
              <ColorPickerPulseIcon className="w-5 h-5" />
            </label>
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
                    <label
                      htmlFor={name}
                      className="block text-xs font-medium text-gray-600"
                    >
                      HEX
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black"
                        value={color}
                        name={name}
                        id={name}
                        onChange={(e) => {
                          const originValue = e.target.value;
                          setHexCode(toHexFormat(originValue));
                        }}
                      />
                      <CheckMark
                        className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 fill-primary-inverted cursor-pointer ${
                          /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
                            hexCode.toString()
                          ) ||
                          /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
                            value
                          )
                            ? ""
                            : "hidden"
                        }`}
                        onClick={() => setIsOpen(false)}
                      />
                    </div>
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
