import type { ITextArea } from '@/types/input.type';
import { useEffect, useRef, type ChangeEvent } from 'react';
import { InputError, InputLabel } from './children';

const Textarea = ({
  label,
  register,
  className = '',
  error,
  containerClassName = '',
  textAreaProps,
  needRef = false,
}: ITextArea) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaProps.disabled) return;
    textAreaProps.onChange?.(event);
    register?.onChange?.(event);
  };

  useEffect(() => {
    if (needRef) {
      inputRef.current?.focus();
    }
  }, [needRef]);

  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative max-h-max min-h-20 lg:min-h-24">
        <InputLabel children={label} htmlFor={textAreaProps?.name} />
        <div
          className={`border-primary/10 bg-smoke-eerie h-full w-full overflow-hidden rounded-lg border p-1 ${className}`}
        >
          {/* Textarea */}
          <textarea
            aria-autocomplete="none"
            {...register}
            {...textAreaProps}
            {...(needRef && { ref: inputRef })}
            id={textAreaProps.id || textAreaProps.name}
            onChange={handleChange}
            rows={textAreaProps.rows || 5}
            className={`text-primary placeholder:text-primary/30 autofill-effect block h-full w-full flex-1 resize-y border-none bg-transparent p-2 text-sm font-normal outline-hidden placeholder:text-xs focus:border-none focus:outline-hidden disabled:cursor-not-allowed ${textAreaProps?.className || ''}`}
          />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Textarea;
