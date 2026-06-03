import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { IBaseInput, IInput, ISelect } from '@/types/input.type';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { ColorPicker, useColor, type IColor } from 'react-color-palette';
import { InputError, InputLabel } from '../children';
import './colorInput.css';

export interface IColorInput
  extends
    Pick<IBaseInput, 'className' | 'containerClassName' | 'error' | 'label'>,
    Pick<IInput['inputProps'], 'disabled' | 'placeholder'>,
    Pick<ISelect, 'position'> {
  value: string;
  onChange: (value: string) => void;
}

const ColorInput = ({
  label,
  value,
  error,
  disabled,
  placeholder,
  onChange,
  containerClassName = '',
  className = '',
  position = 'bottom',
}: IColorInput) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useColor(value);

  const containerRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false), { enabled: isOpen });

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleChange = (col: IColor) => {
    if (disabled) return;
    setColor(col);
    onChange(col.hex);
  };

  return (
    <div
      ref={containerRef}
      className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}
    >
      <div className="relative h-10 lg:h-12">
        <InputLabel children={label} onClick={handleToggle} className="z-2" />
        <div
          className={`border-primary/10 bg-smoke-eerie flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
        >
          <div
            className={`text-primary line-clamp-1 flex h-full w-full flex-1 items-center justify-between border-none bg-transparent p-3 text-sm font-normal ${disabled ? 'cursor-no-drop' : 'cursor-pointer'}`}
            onClick={handleToggle}
          >
            <span className={`line-clamp-1 ${!value ? 'text-primary/50 text-xs' : ''}`}>
              {value || placeholder}
            </span>
            <Icon
              icon="solar:alt-arrow-down-linear"
              className={`size-4 transition-transform md:size-5 ${
                isOpen ? 'rotate-180' : ''
              } ${value ? 'text-primary' : 'text-primary/30'}`}
            />
            {isOpen && (
              <div
                className={`border-primary/10 bg-smoke-eerie absolute left-0 z-3 w-full overflow-hidden rounded-lg border shadow-md ${
                  position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                }`}
              >
                <ColorPicker
                  hideInput={['hsv']}
                  color={color}
                  onChange={handleChange}
                  onChangeComplete={!disabled ? setColor : undefined}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default ColorInput;
