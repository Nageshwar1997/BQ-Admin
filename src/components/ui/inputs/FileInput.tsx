import MediaCarousel from '@/components/layout/carousels/MediaCarousel';
import { MediaModal } from '@/components/layout/modals/MediaModal';
import { FILE_MIME } from '@/constants/common.constants';
import type { TChildren } from '@/types/component.type';
import type { IFileInput } from '@/types/input.type';
import { useState, type ChangeEvent } from 'react';
import { InputError, InputIcon, InputLabel } from './children';

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

const CenterContent = ({
  fileInputProps,
  register,
}: Pick<IFileInput, 'fileInputProps' | 'register'>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fileInputProps?.disabled) return;
    fileInputProps.onChange?.(event);
    register?.onChange?.(event);
  };
  return (
    <div
      className={`flex h-full w-full flex-1 cursor-pointer items-center justify-start border-none bg-transparent p-3 text-sm font-normal outline-hidden focus:border-none focus:outline-hidden ${fileInputProps?.className || ''}`}
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
        aria-autocomplete="none"
        {...register}
        {...fileInputProps}
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
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons' | 'register'>) => {
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
  previews = [],
  handleRemoveImage,
  fileInputProps = {},
  ...props
}: IFileInput) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  return (
    <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        <InputLabel children={label} htmlFor={fileInputProps.name} />
        <MainSection fileInputProps={fileInputProps} {...props} />
      </div>
      {errors?.length > 0 && (
        <div className="flex flex-col gap-1">
          {errors?.map((error, index) => (
            <InputError key={index} error={error} />
          ))}
        </div>
      )}
      {previews?.length > 0 && (
        <MediaCarousel
          className={`border-primary/10 bg-smoke-eerie rounded-lg border p-2 ${mediaCarouselClassName}`}
          gradientClassNames={{ left: 'w-10! lg:w-20!', right: 'w-10! lg:w-20!' }}
          media={previews}
          onClick={(i) => {
            setCurrentIndex(i);
            setShowImageModal(true);
          }}
          handleRemove={handleRemoveImage}
        />
      )}
      {showImageModal && currentIndex !== null && (
        <MediaModal
          className={mediaModalClassName}
          currentIndex={currentIndex}
          onClose={setShowImageModal}
          opened={showImageModal}
          media={previews}
          setCurrentIndex={setCurrentIndex}
          handleRemove={handleRemoveImage}
        />
      )}
    </div>
  );
};

export default FileInput;
