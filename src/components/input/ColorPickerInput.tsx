import type { Color } from "@rc-component/color-picker";
import ColorPicker from "@rc-component/color-picker";
import React, { useMemo, useState } from "react";
import "@rc-component/color-picker/assets/index.css";

const toHexFormat = (value?: string) =>
  value?.replace(/[^0-9a-fA-F#]/g, "").slice(0, 9) || "";

const ColorPickerInput = () => {
  const [value, setValue] = useState<Color | string>("#163cff");
  const color = useMemo(
    () =>
      typeof value === "string"
        ? value
        : value.a < 1
        ? value.toHexString()
        : value.toHexString(),
    [value]
  );

  return (
    <div style={{ width: 600 }}>
      <ColorPicker
        value={value}
        onChange={setValue}
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
                  setValue(toHexFormat(originValue));
                }}
              />
            </div>
          </>
        )}
      />
    </div>
  );
};

export default ColorPickerInput;
