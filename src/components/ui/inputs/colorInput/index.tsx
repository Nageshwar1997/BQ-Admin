import type { IBaseInput, IInput } from '@/types/input.type';
import { ColorPicker, useColor, type IColor } from 'react-color-palette';
import { InputError, InputLabel } from '../children';
import './colorInput.css';

export interface IColorInput
  extends
    Pick<IBaseInput, 'className' | 'error' | 'label'>,
    Pick<IInput['inputProps'], 'disabled'> {
  value: string;
  onChange: (value: string) => void;
}

const ColorInput = ({
  value,
  onChange,
  label,
  error,
  className,
  disabled = false,
}: IColorInput) => {
  const [color, setColor] = useColor(value);

  const handleChange = (col: IColor) => {
    if (disabled) return;
    setColor(col);
    onChange(col.hex);
  };

  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${className}`}>
      <div className="relative">
        <InputLabel children={label} />
        <ColorPicker
          hideInput={['hsv']}
          color={color}
          onChange={handleChange}
          onChangeComplete={!disabled ? setColor : undefined}
        />
      </div>
      <InputError error={error} />
    </div>
  );
};

export default ColorInput;
