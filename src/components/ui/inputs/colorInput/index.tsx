import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { IColorInput } from '@/types/input.type';
import { useState } from 'react';
import { ColorPicker, useColor, type IColor } from 'react-color-palette';
import { InputError, InputIcon, InputLabel } from '../children';
import './colorInput.css';

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
  const [color, setColor] = useColor(value ?? '');

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
          <div className="text-primary line-clamp-1 flex h-full w-full flex-1 items-center justify-between border-none bg-transparent text-sm font-normal">
            <div className="h-full p-2 [&_span]:p-0">
              <div
                className={`border-primary/10 ${disabled ? 'cursor-no-drop' : 'cursor-pointer'} rounded border p-1`}
                style={{ backgroundColor: `${color.hex}` }}
                onClick={handleToggle}
              >
                <InputIcon
                  position="left"
                  left={{
                    icon: 'mage:color-picker-fill',
                    className: '[&>path]:last:stroke-primary [&>path]:last:fill-primary-invert',
                  }}
                />
              </div>
            </div>
            <span className={`line-clamp-1 flex-1 ${!value ? 'text-primary/50 text-xs' : ''}`}>
              {value || placeholder}
            </span>
            <InputIcon
              position="right"
              right={{
                icon: isOpen ? 'pepicons-pop:color-picker-off' : 'pepicons-pop:color-picker',
                className: `${disabled ? 'cursor-no-drop' : 'cursor-pointer'}`,
                onClick: handleToggle,
              }}
            />
            {isOpen && (
              <div
                className={`border-primary/10 bg-smoke-eerie absolute left-0 z-3 w-full overflow-hidden rounded-lg border shadow-md ${
                  position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                }`}
                onClick={(e) => e.stopPropagation()}
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
