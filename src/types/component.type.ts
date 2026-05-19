import type { SORT_ORDER_MAP } from '@/constants/common.constants';
import type { FOOTER_CATEGORIES } from '@/constants/footer.constants';
import type { IconProps } from '@iconify/react';
import type { ButtonHTMLAttributes, JSX, ReactNode, RefObject, VideoHTMLAttributes } from 'react';
import type { ICategory } from './api.type';
import type { TGradientPos, TScrollDirection } from './hook.type';

export type TClassName = { className?: string };

export type TContainerClassName = { containerClassName?: string };

export type TChildren = { children: ReactNode };

export interface IButton extends TClassName {
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'content'>;
  content: IconProps | string;
  pattern: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'transparent';
  leftIcon?: IconProps;
  rightIcon?: IconProps;
}

export interface ILoading extends TClassName {
  text: string;
}

export interface IScrollableGradientContainer
  extends TClassName, Partial<TChildren>, TContainerClassName {
  gradientClassNames?: Partial<Record<TGradientPos, string>>;
  direction: TScrollDirection;
}

export interface ILinerGradient extends TClassName {
  position: TGradientPos;
}

export interface IGradientText extends TClassName, Partial<TChildren> {
  text: string;
  type: 'accent' | 'silver';
  path?: string;
}

export interface IResend extends TClassName {
  label: string;
  count: number;
  onResend?: () => void;
}

export type TSort = (typeof SORT_ORDER_MAP)[keyof typeof SORT_ORDER_MAP];

export type TTitleDescription = {
  title: string | ReactNode;
  description?: string | ReactNode;
};

export interface ITooltip extends TClassName, TChildren, TTitleDescription, TContainerClassName {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  required?: boolean;
}

type TBaseStatus = TTitleDescription & TClassName & { divider?: boolean };

type TErrorStatus = TBaseStatus & { status: 'error' };
type TEmptyStatus = TBaseStatus & { status: 'empty' };
type TLoadingStatus = TClassName & { status: 'loading'; text?: string };

export type TApiStatus = TErrorStatus | TEmptyStatus | TLoadingStatus;

export interface IModalWrapper extends TClassName {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerProps?: JSX.IntrinsicElements['div'];
  header?: { title?: string; showCloseIcon?: boolean };
  closeOnOutsideClick?: boolean;
}

export interface IFooterOptionList {
  options: (typeof FOOTER_CATEGORIES)[number]['options'];
  title?: string;
  isFirst?: boolean;
}

export interface IVideoPlayer extends TClassName {
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
}

export interface IBreadcrumb extends TClassName {
  customPath?: string;
  customPaths?: string[];
}

export type TCategoryActions = Record<
  'onEdit' | 'onDelete',
  (category: ICategory, mainCategoryId?: string) => void
>;

export type TCategoryTable = TCategoryActions & {
  category: ICategory;
  mainCategoryId?: string;
};

export type TSubCategoryTable = TCategoryActions & {
  parentCat: ICategory;
  mainCategoryId?: string;
};
