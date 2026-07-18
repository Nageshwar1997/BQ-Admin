import MediaCarousel from '@/components/layout/carousels/MediaCarousel';
import { MediaModal } from '@/components/layout/modals/MediaModal';
import type { TChildren, TMediaResource } from '@/types/component.type';
import type { IFileInput } from '@/types/input.type';
import { isIconProps } from '@/utils/common.util';
import { FILE_FORMAT, FILE_MIME } from '@beautinique/shared-constants';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { InputError, InputIcon, InputLabel } from './children';

const getMediaType = (value: File | string): TMediaResource => {
  if (value instanceof File) {
    const imgMime: readonly string[] = FILE_MIME.image;
    const vidMime: readonly string[] = FILE_MIME.video;
    if (imgMime.includes(value.type)) {
      return 'image';
    }

    if (vidMime.includes(value.type)) {
      return 'video';
    }

    return 'image';
  }

  const cleanUrl = value.split('?')[0].split('#')[0];

  const extension = cleanUrl.split('.').pop()?.toLowerCase();

  if (!extension) {
    return 'image';
  }

  const imgExtensions: readonly string[] = FILE_FORMAT.image;
  const vidExtensions: readonly string[] = FILE_FORMAT.video;

  if (imgExtensions.includes(extension)) {
    return 'image';
  }

  if (vidExtensions.includes(extension)) {
    return 'video';
  }

  throw new Error('Invalid file type.');
};

const MediaErrorStyle = ({ errors }: Pick<IFileInput, 'errors'>) => {
  if (!errors || !errors.length) return null;

  return (
    <style>
      {errors
        .map((error, index) => {
          if (!error) return '';

          return `.media-carousel > div:nth-child(${index + 1}) { border-color: var(--color-red-c) !important; }`;
        })
        .join('\n')}
    </style>
  );
};

const InputWrapper = ({ children, icons }: TChildren & Pick<IFileInput, 'icons'>) => (
  <div className="flex items-center justify-between gap-3">
    {/* Left Icon */}
    <InputIcon icon={icons?.left} />
    {/* Main Section */}
    {children}
    {/* Right Icon */}
    <InputIcon icon={icons?.right} />
  </div>
);

const InputWithoutIconClick = ({
  fileInputProps,
  className,
  children,
  icons,
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons'> & TChildren) => (
  <label
    htmlFor={fileInputProps.name}
    className={`border-primary/10 bg-smoke-eerie group block rounded-lg border px-3 ${className}`}
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
  <div className={`border-primary/10 bg-smoke-eerie group rounded-lg border px-3 ${className}`}>
    <InputWrapper icons={icons}>
      <label htmlFor={fileInputProps.name} className="block">
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
      role="button"
      className={`flex-1 truncate border-none bg-transparent text-[13px] outline-hidden focus:border-none focus:outline-hidden ${fileInputProps?.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${fileInputProps?.className || ''}`}
    >
      <p className="text-primary/30 w-max truncate py-2 xl:py-3">
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
  return (isIconProps(icons?.left) && icons?.left?.onClick) ||
    (isIconProps(icons?.right) && icons?.right?.onClick) ? (
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
  const [previews, setPreviews] = useState<
    { url: string; type: TMediaResource; isBlob?: boolean }[]
  >([]);

  const previewUrlsRef = useRef<Map<File, string>>(new Map());

  const getPreviewUrl = (file: File) => {
    let url = previewUrlsRef.current.get(file);

    if (!url) {
      url = URL.createObjectURL(file);
      previewUrlsRef.current.set(file, url);
    }

    return url;
  };

  useEffect(() => {
    const value = fileInputProps.value;

    if (!value) {
      setPreviews([]);
      return;
    }

    const files = Array.isArray(value) ? value : [value];

    const nextPreviews = files
      .map((item) => {
        const type = getMediaType(item);

        if (item instanceof File) {
          return { url: getPreviewUrl(item), type, isBlob: true };
        }

        if (typeof item === 'string') {
          return { url: item, type, isBlob: false };
        }

        return null;
      })
      .filter(Boolean) as typeof previews;

    setPreviews(nextPreviews);
  }, [fileInputProps.value]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrlsRef.current.clear();
    };
  }, []);
  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative">
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
          videoProps={{ controls: true }}
        />
      )}
    </div>
  );
};

export default FileInput;
