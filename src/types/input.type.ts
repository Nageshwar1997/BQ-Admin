import type { IconProps } from '@iconify/react';
import type { ToolbarProps } from 'quill/modules/toolbar';
import type { InputHTMLAttributes, ReactNode, RefObject, SelectHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import type { TClassName, TContainerClassName } from './component.type';

type LeftIcon = { left: IconProps | string; right?: never };

type RightIcon = { right: IconProps; left?: never };

type NoIcon = { left?: undefined; right?: undefined };

type InputIcons = LeftIcon | RightIcon | NoIcon;

export interface IBaseInput extends TClassName, TContainerClassName {
  needRef?: boolean;
  icons?: InputIcons;
  register?: UseFormRegisterReturn;
  label?: string;
  error?: string;
}

export interface IInput extends IBaseInput {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}

export interface ICheckbox extends Omit<IBaseInput, 'needRef' | 'icons' | 'label'> {
  content?: string | ReactNode;
  checkboxProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
}

type TOption = { label: string | ReactNode; value: string };

export interface IRadio extends TClassName, TContainerClassName, Pick<IBaseInput, 'error'> {
  value: string;
  onChange: (value: string) => void;
  options: TOption[];
}

export interface IDropdownOption extends Pick<TOption, 'label'> {
  value: TOption['value'] | number;
  disabled?: boolean;
}

export interface ISelect extends Omit<IBaseInput, 'needRef' | 'register'> {
  selectProps: Pick<SelectHTMLAttributes<HTMLSelectElement>, 'disabled'> &
    Partial<Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder'>> & {
      value?: IDropdownOption['value'];
      onChange?: (value: IDropdownOption['value']) => void;
    };
  options: IDropdownOption[];
  optionsClassName?: string;
  optionsPosition?: 'top' | 'bottom';
}

export interface IFileInput extends Omit<IBaseInput, 'error' | 'register'> {
  fileInputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> & {
    value?: (File | string) | (File | string)[];
  };
  errors?: string[];
  handleRemove?: (index: number) => void;
  mediaModalClassName?: string;
  mediaCarouselClassName?: string;
}

export type TToolbarOption =
  | { header: (1 | 2 | 3 | 4 | 5 | 6 | false)[] }
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | { list: 'ordered' | 'bullet' }
  | { script: 'sub' | 'super' }
  | { indent: '-1' | '+1' }
  | { color: string[] } // can be empty for Quill to auto-generate colors
  | { background: string[] }
  | { align: string[] }
  | { direction: 'rtl' }
  | 'link'
  | 'image'
  | 'video'
  | 'code'
  | 'clean';

export type TQuillToolbar = (TToolbarOption | TToolbarOption[])[];

export interface IToolBarOptions {
  header?: (1 | 2 | 3 | 4 | 5 | 6 | false)[];
  script?: ('sub' | 'super')[];
  indent?: ('-1' | '+1')[];
  color?: boolean;
  background?: boolean;
  align?: boolean;
  direction?: 'rtl';
  text?: ('bold' | 'italic' | 'underline' | 'strike' | 'link')[];
  list?: ('ordered' | 'bullet')[];
  media?: ('image' | 'video' | 'link')[];
  misc?: ('code' | 'clean')[];
}

export interface IQuillInput
  extends
    TClassName,
    Pick<IBaseInput, 'error' | 'label'>,
    Pick<IInput['inputProps'], 'placeholder' | 'disabled'> {
  value?: string;
  needLinkButton?: boolean;
  onChange?: (value: string) => void;
  blobUrlsRef?: RefObject<string[]>;
  toolbarOptions?: IToolBarOptions;
}

export interface IQuillToolbar extends ToolbarProps {
  handlers: Record<string, (...args: unknown[]) => void>;
}

export type TQuillImageBlot = {
  new (): HTMLElement;
  create(value: unknown): HTMLElement;
  value(node: HTMLElement): unknown;
};
