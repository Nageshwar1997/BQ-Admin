import type { TClassName } from '@/types/component.type';
import type { IInput } from '@/types/input.type';
import { isIconProps } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import { isValidElement, type LabelHTMLAttributes } from 'react';

export const InputError = ({ error, className = '' }: { error?: string } & TClassName) => {
  if (!error) return null;
  return (
    <p className={`text-red-c flex w-full items-center gap-1 text-start text-[11px] ${className}`}>
      <Icon icon="solar:info-circle-linear" className="size-3 shrink-0" />
      <span className="line-clamp-2 leading-none whitespace-pre-line first-letter:uppercase">
        {error}
      </span>
    </p>
  );
};

export const InputIcon = ({
  position,
  ...props
}: IInput['icons'] & { position: 'left' | 'right' }) => {
  if (!props) return null;

  // 👉 LEFT
  if (props.left && position === 'left') {
    const value = props.left;

    if (typeof value === 'string') {
      return (
        <p className="text-primary/50 border-r-primary/30 items-center border-r py-2 pr-3 text-[13px] leading-0 capitalize">
          {value}
        </p>
      );
    }

    if (isIconProps(value)) {
      return <Icon {...value} className={`shrink-0 ${value.className || ''}`} />;
    }

    if (isValidElement(value)) {
      return value;
    }
  }

  // 👉 RIGHT
  if (props.right && position === 'right') {
    const value = props.right;

    if (isIconProps(value)) {
      return <Icon {...value} className={`shrink-0 ${value.className || ''}`} />;
    }

    if (isValidElement(value)) {
      return value;
    }
  }

  return null;
};

export const InputLabel = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  if (!props.children) return null;
  return (
    <label
      {...props}
      htmlFor={props.htmlFor || ''}
      className={`text-primary/50 border-primary/10 bg-smoke-eerie absolute top-0 left-3 -translate-y-1/2 transform rounded-sm border px-1 py-0.5 pt-1 text-[10px] leading-none md:px-2 ${props.htmlFor ? 'cursor-pointer' : 'cursor-default'} ${props.className}`}
    />
  );
};
