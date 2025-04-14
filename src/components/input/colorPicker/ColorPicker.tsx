import {
  ColorPicker as ColorPickerPalette,
  useColor,
} from "react-color-palette";
import type { IColor } from "react-color-palette";
import "./colorPicker.css";
import { useEffect, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import { CheckMark, ColorPickerPulseIcon, InfoIcon } from "../../../icons";

export interface ColorPickerInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  errorText?: string;
  readOnly?: boolean;
  successText?: string;
  containerClassName?: string;
}

const ColorPicker = ({
  value = "",
  onChange,
  label = "",
  errorText = "",
  readOnly = false,
  successText = "",
  containerClassName = "",
}: ColorPickerInputProps) => {
  const { containerRef, setHandler } = useClickOutside<HTMLDivElement>();

  const [isOpen, setIsOpen] = useState(false);

  const [color, setColor] = useColor("");

  const handleOnChange = (col: IColor) => {
    setColor(col);
    onChange(col.hex);
  };

  useEffect(() => {
    if (isOpen) {
      setHandler(() => setIsOpen(false));
    }
    return () => setHandler(null);
  }, [isOpen, setHandler]);

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;

  return (
    <div
      className={`w-full space-y-1.5 ${containerClassName}`}
      ref={containerRef}
    >
      <div className="relative min-h-10 max-h-10 lg:min-h-12 lg:max-h-12">
        {label && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer outline-none focus:outline-none z-[3]"
          >
            {label}
          </button>
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
            {value ? color.hex : "Select Color"}
          </p>

          <div className="min-h-10 max-h-10 lg:min-h-12 lg:max-h-12 min-w-10 max-w-10 lg:min-w-12 lg:max-w-12 w-full h-full p-1 relative overflow-hidden">
            <div className="bg-[url(/images/transparent-background-image.webp)] bg-cover bg-center bg-no-repeat absolute inset-1 rounded-sm z-0" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              className="absolute inset-1 text-primary-50 rounded-sm z-[1] flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: color.hex || "var(--primary)",
                border: `1px solid rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, 1)`,
              }}
            >
              <ColorPickerPulseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-12 md:top-[50px] z-10">
            <ColorPickerPalette
              hideInput={["hsv"]}
              color={color}
              onChange={(val) => handleOnChange(val)}
              onChangeComplete={setColor}
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

export default ColorPicker;
