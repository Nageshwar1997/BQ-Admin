import MediaCarousel from '@/components/layout/carousels/MediaCarousel';
import { MediaModal } from '@/components/layout/modals/MediaModal';
import { FILE_MIME } from '@/constants/common.constants';
import type { TChildren, TMediaResource } from '@/types/component.type';
import type { IFileInput } from '@/types/input.type';
import { Icon } from '@iconify/react';
import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { InputError, InputIcon, InputLabel } from './children';

const getMediaType = (value: File | string): TMediaResource => {
  if (value instanceof File) {
    if (value.type.startsWith('image/')) return 'image';
    if (value.type.startsWith('video/')) return 'video';

    throw new Error('Invalid file type.');
  }

  const cleanUrl = value.split('?')[0].split('#')[0];

  const extension = cleanUrl.split('.').pop()?.toLowerCase();

  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'];

  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'm3u8'];

  if (extension && imageExtensions.includes(extension)) {
    return 'image';
  }

  if (extension && videoExtensions.includes(extension)) {
    return 'video';
  }

  throw new Error('Invalid file type.');
};

const MediaErrorStyle = ({ errors }: Pick<IFileInput, 'errors'>) => {
  if (!errors || !errors.length) return null;

  return (
    <style>
      {errors
        .map((error) => {
          const secondWord = error.split(' ')[1];

          if (!secondWord || Number.isNaN(Number(secondWord))) {
            return '';
          }

          const index = Number(secondWord);

          return `.media-carousel > div:nth-child(${index}) { border-color: var(--color-red-c) !important; }`;
        })
        .join('\n')}
    </style>
  );
};

const InputWrapper = ({ children, icons }: TChildren & Pick<IFileInput, 'icons'>) => (
  <>
    {/* Left Icon */}
    <InputIcon {...icons} position="left" />
    {/* Main Section */}
    {children}
    {/* Right Icon */}
    <InputIcon {...icons} position="right" />
  </>
);

const InputWithoutIconClick = ({
  fileInputProps,
  className,
  children,
  icons,
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons'> & TChildren) => (
  <label
    htmlFor={fileInputProps.name}
    className={`border-primary/10 bg-smoke-eerie group flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
  >
    <InputWrapper icons={icons}>{children}</InputWrapper>
  </label>
);

const InputWithIconClick = ({
  fileInputProps,
  className,
  children,
  icons,
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons'> & TChildren) => (
  <div
    className={`border-primary/10 bg-smoke-eerie group flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
  >
    <InputWrapper icons={icons}>
      <label htmlFor={fileInputProps.name} className="h-full flex-1">
        {children}
      </label>
    </InputWrapper>
  </div>
);

const CenterContent = ({ fileInputProps }: Pick<IFileInput, 'fileInputProps'>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { value: _, ...inputProps } = fileInputProps;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fileInputProps?.disabled) return;

    if (fileInputProps.onChange) {
      fileInputProps.onChange(event);
    }

    event.target.value = '';
  };

  return (
    <div
      className={`flex h-full w-full flex-1 items-center justify-start border-none bg-transparent p-3 text-sm font-normal outline-hidden focus:border-none focus:outline-hidden ${fileInputProps?.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${fileInputProps?.className || ''}`}
    >
      <p className="text-primary/30 line-clamp-1 text-xs">
        {fileInputProps?.placeholder
          ? fileInputProps.placeholder
          : fileInputProps.multiple
            ? 'Choose files'
            : 'Choose file'}
      </p>
      {/* Input */}
      <input
        ref={inputRef}
        aria-autocomplete="none"
        {...inputProps}
        id={fileInputProps.id || fileInputProps.name}
        accept={fileInputProps?.accept ?? FILE_MIME.image.join(', ')}
        type="file"
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
};

const MainSection = ({
  icons,
  ...props
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons'>) => {
  return (typeof icons?.left === 'object' && icons?.left?.onClick) || icons?.right?.onClick ? (
    <InputWithIconClick {...props} icons={icons}>
      <CenterContent {...props} />
    </InputWithIconClick>
  ) : (
    <InputWithoutIconClick {...props} icons={icons}>
      <CenterContent {...props} />
    </InputWithoutIconClick>
  );
};

const FileInput = ({
  label = '',
  containerClassName = '',
  mediaModalClassName = '',
  mediaCarouselClassName = '',
  errors = [],
  handleRemove,
  fileInputProps = {},
  ...props
}: IFileInput) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const previews = useMemo(() => {
    const value = fileInputProps.value;
    if (!value) return [];

    const files = Array.isArray(value) ? value : [value];

    return files
      .map((item) => {
        const type = getMediaType(item);

        if (item instanceof File) {
          return { url: URL.createObjectURL(item), type };
        }

        if (typeof item === 'string') {
          return { url: item, type };
        }

        return null;
      })
      .filter(Boolean) as { url: string; type: TMediaResource }[];
  }, [fileInputProps.value]);

  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        <InputLabel children={label} htmlFor={fileInputProps.name} />
        <MainSection fileInputProps={fileInputProps} {...props} />
      </div>
      {errors?.length > 0 && (
        <div className="space-y-1">
          {errors?.map((error, index) => (
            <InputError key={index} error={error} />
          ))}
        </div>
      )}
      {previews?.length > 0 && (
        <div className="border-primary/10 bg-smoke-eerie relative flex rounded-lg border">
          {fileInputProps?.multiple && (
            <div className="sticky left-0 mr-1 ml-2 flex items-center justify-start gap-3">
              <label
                htmlFor={fileInputProps.name}
                className={`border-primary/50 bg-tertiary-invert hover:border-tertiary flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border shadow-xs transition-colors duration-300 md:size-16 lg:size-20 ${fileInputProps?.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Icon icon="solar:gallery-add-linear" className="text-primary size-[40%]" />
              </label>
              <div className="group bg-hr-line my-2 h-14 w-px shrink-0 md:h-16 lg:h-20" />
            </div>
          )}
          <MediaErrorStyle errors={errors} />
          <MediaCarousel
            className={`${mediaCarouselClassName}`}
            gradientClassNames={{
              left: 'from-smoke-eerie rounded-l-[7px] z-2',
              right: 'from-smoke-eerie rounded-r-[7px] z-2',
            }}
            media={previews}
            onClick={(i) => {
              setCurrentIndex(i);
              setShowImageModal(true);
            }}
            handleRemove={handleRemove}
          />
        </div>
      )}
      {showImageModal && currentIndex !== null && (
        <MediaModal
          className={mediaModalClassName}
          currentIndex={currentIndex}
          onClose={setShowImageModal}
          opened={showImageModal}
          media={previews}
          setCurrentIndex={setCurrentIndex}
          handleRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default FileInput;
