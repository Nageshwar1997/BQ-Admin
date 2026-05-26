import { EMPTY_ARRAY } from '@/constants/common.constants';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { ISelect } from '@/types/input.type';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { InputError, InputIcon, InputLabel } from './children';

const Select = ({
  label = '',
  className = '',
  error = '',
  containerClassName = '',
  optionsClassName = '',
  icons,
  selectProps,
  options = EMPTY_ARRAY,
  optionsPosition = 'bottom',
}: ISelect) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false), { enabled: isOpen });
  const selectedOptionRef = useRef<HTMLLIElement | null>(null);

  const selected = options.find((opt) => opt.value === selectProps.value);

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}
    >
      <div className="relative h-10 lg:h-12">
        <InputLabel children={label} onClick={() => setIsOpen((prev) => !prev)} className="z-2" />
        <div
          className={`border-primary/10 bg-smoke-eerie flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
        >
          {/* Left Icon */}
          <InputIcon {...icons} position="left" />
          {/* Hidden */}
          {/* <select
            {...register}
            {...selectProps}
            ref={setSelectRef}
            id={selectProps.id || selectProps.name}
            onBlur={handleBlur}
            onChange={handleChange}
            className="sr-only"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select> */}
          <div
            className={`text-primary line-clamp-1 flex h-full w-full flex-1 items-center justify-between border-none bg-transparent p-3 text-sm font-normal ${selectProps.disabled ? 'cursor-no-drop' : 'cursor-pointer'}`}
            onClick={() => !selectProps?.disabled && setIsOpen((prev) => !prev)}
          >
            <span className={`line-clamp-1 ${!selected?.value ? 'text-primary/50 text-xs' : ''}`}>
              {selected?.label || selectProps?.placeholder}
            </span>
            <Icon
              icon="solar:alt-arrow-down-linear"
              className={`size-4 transition-transform md:size-5 ${
                isOpen ? 'rotate-180' : ''
              } ${selected?.value ? 'text-primary' : 'text-primary/50'}`}
            />
            {isOpen && (
              <div
                className={`border-primary/10 bg-smoke-eerie absolute left-0 z-3 w-full overflow-hidden rounded-lg border shadow-md ${
                  optionsPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                } ${optionsClassName}`}
              >
                <ul className="flex max-h-60 flex-col gap-0.5 overflow-auto px-1 py-2">
                  {options.map((option) => {
                    const active = selected?.value === option.value;
                    return (
                      <li
                        key={option.value}
                        ref={active ? selectedOptionRef : null}
                        className={`hover:bg-primary/10 text-tertiary flex cursor-pointer items-center justify-between gap-2 rounded-sm p-2 text-sm ${
                          active ? 'bg-primary/8' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (option.disabled || selectProps?.disabled) return;
                          selectProps.onChange?.(active ? '' : option.value || '');
                          setIsOpen(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {active && (
                          <Icon
                            icon="solar:unread-linear"
                            className="text-primary size-4 md:size-5"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          {/* Right Icon */}
          <InputIcon {...icons} position="right" />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Select;
