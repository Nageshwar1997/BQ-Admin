import { useMemo, useState } from "react";
import ColorPicker from "@rc-component/color-picker";

import type { Color } from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";

const ColorPickerInput = () => {
  const [value, setValue] = useState<Color | string>("#000000");

  const color = useMemo(
    () =>
      typeof value === "string"
        ? value
        : value.a < 1
        ? value.toHexString()
        : value.toHexString(),
    [value]
  );

  const toHexFormat = (value?: string) =>
    value?.replace(/[^0-9a-fA-F#]/g, "").slice(0, 9) || "";

  return (
    <div className="">
      <div style={{ width: 240 }}>
        <ColorPicker
          className=""
          defaultValue={value}
          value={value}
          onChange={setValue}
          panelRender={(panel) => (
            <>
              {panel}
              <input
                value={color}
                onChange={(e) => {
                  const originValue = e.target.value;
                  setValue(toHexFormat(originValue));
                }}
              />
            </>
          )}
        />
      </div>
    </div>
  );
};

export default ColorPickerInput;
