import type { IconProps } from '@iconify/react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import type { TClassName, TContainerClassName, TMediaOption } from './component.type';

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

export interface IRadio extends TClassName, Pick<IBaseInput, 'error'> {
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

export interface IFileInput extends Omit<IBaseInput, 'error'> {
  fileInputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
  errors?: string[];
  handleRemoveImage?: (index: number) => void;
  handleReorderMedia?: (fromIndex: number, toIndex: number) => void;
  previews?: TMediaOption[];
  mediaModalClassName?: string;
  mediaCarouselClassName?: string;
}
