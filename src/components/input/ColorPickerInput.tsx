import { useEffect, useState } from "react";
import ColorPicker from "@rc-component/color-picker";
import type { Color } from "@rc-component/color-picker";
import { TinyColor } from "@ctrl/tinycolor";
import "@rc-component/color-picker/assets/index.css";

const ColorPickerInput = () => {
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

  return (
    <div style={{ width: 240 }}>
      <ColorPicker
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
  );
};

export default ColorPickerInput;
