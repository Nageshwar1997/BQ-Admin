import type { SORT_ORDER_MAP, TOAST_TYPE } from '@/constants/common.constants';
import type { FOOTER_CATEGORIES } from '@/constants/footer.constants';
import type { IconProps } from '@iconify/react';
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  JSX,
  ReactElement,
  ReactNode,
  RefObject,
  VideoHTMLAttributes,
} from 'react';
import type { TApiCategory } from './api.type';
import type { TGradientPos, TScrollDirection } from './hook.type';

export type TClassName = { className?: string };

export type TContainerClassName = { containerClassName?: string };

export type TChildren = { children: ReactNode | ReactElement };

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
  style?: ComponentProps<'div'>['style'];
}

export interface IFooterOptionList {
  options: (typeof FOOTER_CATEGORIES)[number]['options'];
  title?: string;
  isFirst?: boolean;
}

export interface IVideoPlayer extends TClassName {
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
  showPosterOnly?: boolean;
}

export interface IBreadcrumb extends TClassName {
  customPath?: string;
  customPaths?: string[];
}

export type TCatModal = { category: TApiCategory; mainCatId?: string };

export type TCatActionHandle = {
  onEdit: (data: TCatModal) => void;
  onDelete: (categoryId: string) => void;
};

export type TCatTable = TCatActionHandle & TCatModal;

type TCustomConfirmModal = TChildren & {
  type: typeof TOAST_TYPE.custom;
  title?: never;
  description?: never;
  buttons?: Partial<Record<'left' | 'right', Omit<IButton, 'pattern'>>>;
};

type TDefaultConfirmModal = {
  type:
    | typeof TOAST_TYPE.success
    | typeof TOAST_TYPE.error
    | typeof TOAST_TYPE.warning
    | typeof TOAST_TYPE.default;
  title: string;
  children?: never;
  description?: string;
  buttons: Partial<Record<'left' | 'right', Omit<IButton, 'pattern'>>>;
};

export type TConfirmModal = (TCustomConfirmModal | TDefaultConfirmModal) & {
  modalProps?: Omit<IModalWrapper, 'children' | 'closeOnOutsideClick'>;
};

export type TMediaResource = 'image' | 'video';

export type TMediaOption = { type: TMediaResource; url: string };

export interface IVideo {
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
}

export interface IMediaCarousel
  extends TClassName, Pick<IScrollableGradientContainer, 'gradientClassNames'> {
  media: TMediaOption[];
  selected?: number | null;
  onClick: (index: number) => void;
  thumbnailRefs?: RefObject<(HTMLDivElement | null)[]>;
  handleRemove?: (index: number) => void;
}

export interface IMediaCarouselWithParent
  extends TClassName, Partial<IVideo>, Pick<IMediaCarousel, 'media' | 'selected' | 'handleRemove'> {
  needButtonControls?: boolean;
}

export type TQuillImageRef = { id: string; file: File; blobUrl: string };

export type TPageWrapper = TChildren &
  TContainerClassName &
  TClassName & {
    navbar?: {
      components?: ReactElement[];
      buttons?: Partial<IButton & TChildren>[];
    } & Partial<TChildren>;
  };
