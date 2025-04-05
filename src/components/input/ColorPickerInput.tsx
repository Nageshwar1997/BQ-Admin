import { ReactNode, useEffect, useState } from "react";
import ColorPicker from "@rc-component/color-picker";
import type { Color } from "@rc-component/color-picker";
import { TinyColor } from "@ctrl/tinycolor";
import "@rc-component/color-picker/assets/index.css";
import { CheckMark, InfoIcon } from "../../icons";

const ColorPickerInput = ({
  icon,
  name = "",
  label = "",
  iconClick,
  className = "",
  errorText = "",
  readOnly = false,
  successText = "",
  containerClassName = "",
}: {
  icon?: ReactNode;
  name?: string;
  label?: string;
  iconClick?: () => void;
  errorText?: string;
  readOnly?: boolean;
  successText?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [value, setValue] = useState<Color | string>("#000000");

  const [hexInput, setHexInput] = useState("#000000");
  const [rgbInput, setRgbInput] = useState("rgb(0, 0, 0)");
  const [rgbaInput, setRgbaInput] = useState("rgba(0, 0, 0, 1)");

  const syncInputs = (val: string | Color) => {
    const tiny = new TinyColor(val);
    setHexInput(tiny.toHex8String()); // ✅ includes alpha
    setRgbInput(tiny.toRgbString().replace(/, [\d.]+\)/, ")")); // RGB only
    setRgbaInput(tiny.toRgbString()); // RGBA includes alpha
  };

  const handleColorChange = (val: string) => {
    const color = new TinyColor(val);
    if (color.isValid) {
      const finalColor =
        color.getAlpha() < 1 ? color.toRgbString() : color.toHexString();
      setValue(finalColor); // ✅ use string instead of TinyColor instance
      syncInputs(finalColor);
    }
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    handleColorChange(val);
  };

  const handleRgbChange = (val: string) => {
    setRgbInput(val);
    handleColorChange(val);
  };

  const handleRgbaChange = (val: string) => {
    setRgbaInput(val);
    handleColorChange(val);
  };

  useEffect(() => {
    const tiny = new TinyColor(value);
    setHexInput(tiny.toHex8String());
    setRgbInput(tiny.toRgbString().replace(/, [\d.]+\)/, ")")); // RGB only
    setRgbaInput(tiny.toRgbString());
  }, [value]);

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
        <div
          className={`w-full min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 fle items-center text-sm flex bg-smoke-eerie rounded-lg border border-primary-10 text-primary ${className}`}
        >
          <div className="max-w-10 lg:max-w-12 min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 w-full h-full p-1 text-primary-50 content-center text-center border-r border-primary-10">
            <div
              className="min-w-full min-h-full border py-3.5 lg:py-[18px] rounded-sm shadow-lg"
              style={{
                backgroundColor: value as string,
              }}
            />
          </div>
          <p>{value as string}</p>
        </div>
        <div className="w-60 absolute top-12 left-0">
          <ColorPicker
            className=""
            value={value}
            onChange={(val) => {
              setValue(val);
              syncInputs(val);
            }}
            defaultValue="#000000"
            panelRender={(panel) => (
              <div className="space-y-2">
                {panel}
                <div className="space-y-1 mt-2">
                  <label className="block text-xs font-medium text-gray-600">
                    HEX
                  </label>
                  <input
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    RGB
                  </label>
                  <input
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    value={rgbInput}
                    onChange={(e) => handleRgbChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    RGBA
                  </label>
                  <input
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    value={rgbaInput}
                    onChange={(e) => handleRgbaChange(e.target.value)}
                  />
                </div>
              </div>
            )}
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

export default ColorPickerInput;
