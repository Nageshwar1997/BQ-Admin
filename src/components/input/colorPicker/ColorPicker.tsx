import {
  ColorPicker as ColorPickerPalette,
  useColor,
} from "react-color-palette";
import type { IColor } from "react-color-palette";
import "./colorPicker.css";
import { CheckMark, InfoIcon } from "../../../icons";

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
  const [color, setColor] = useColor(value);

  const handleOnChange = (col: IColor) => {
    setColor(col);
    onChange(col.hex);
  };

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;

  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      <div className="relative">
        {label && (
          <span className="text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded cursor-pointer outline-none focus:outline-none z-[3]">
            {label}
          </span>
        )}
        <div className="w-full">
          <ColorPickerPalette
            hideInput={["hsv"]}
            color={color}
            onChange={(val) => handleOnChange(val)}
            onChangeComplete={setColor}
          />
        </div>
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
