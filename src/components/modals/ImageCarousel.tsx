import { useState } from "react";
import { DropdownIcon } from "../../icons";
import { CloseIcon } from "../layout/sidebar/icons";

const ImageCarousel = ({
  className,
  index,
  previewUrls,
  onClose,
  handleRemoveImage,
}: {
  className?: string;
  index: number;
  previewUrls: string[];
  onClose: () => void;
  handleRemoveImage?: (index: number) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(index);

  return (
    <div
      className={`fixed inset-0 w-dvw h-dvh z-50 bg-primary-inverted-50 backdrop-blur-[2px] flex items-center justify-center ${className}`}
    >
      <div className="bg-primary-inverted rounded-lg p-4 relative max-w-3xl w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-tertiary p-1 rounded-full z-[1] border border-tertiary-inverted"
        >
          <CloseIcon className="w-4 h-4 [&>path]:stroke-tertiary-inverted" />
        </button>

        {/* Main Image */}
        <div className="mb-4 h-[400px] lg:h-[420px] xl:h-[500px] flex items-center justify-center relative">
          <img
            src={previewUrls[currentIndex]}
            alt={`preview-${currentIndex}`}
            className="max-h-full mx-auto object-contain rounded-lg border border-primary-50"
          />
          <div className="w-full py-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-center flex items-center justify-center gap-5">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
              }}
              className="p-[5px] rounded border border-primary-50 bg-primary-inverted-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DropdownIcon className="rotate-90 [&>path]:stroke-primary" />
            </button>

            <span className="py-2 w-24 px-4 min-h-full border border-primary-50 content-center bg-primary-inverted-50 text-primary leading-none rounded">
              {currentIndex + 1} of {previewUrls.length}
            </span>

            <button
              type="button"
              disabled={
                previewUrls.length === 0 ||
                currentIndex === previewUrls.length - 1
              }
              onClick={() => {
                if (currentIndex < previewUrls.length - 1)
                  setCurrentIndex((prev) => prev + 1);
              }}
              className="p-[5px] rounded border border-primary-50 bg-primary-inverted-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DropdownIcon className="-rotate-90 [&>path]:stroke-primary" />
            </button>
          </div>
        </div>

        <hr className="h-px mb-4 block border-none bg-gradient-line" />

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-scroll">
          {previewUrls.map((url, i) => (
            <div
              key={i}
              className="min-w-20 min-h-20 max-w-24 max-h-24 w-full h-full relative group rounded overflow-hidden border border-primary-30 shadow-sm"
            >
              <img
                src={url}
                alt={`thumb-${i}`}
                onClick={() => setCurrentIndex(i)}
                className={`w-full h-full object-cover cursor-pointer rounded-md aspect-square border ${
                  i === currentIndex ? "border-tertiary" : "border-primary-30"
                }`}
              />
              {handleRemoveImage && (
                <button
                  onClick={() => {
                    handleRemoveImage?.(currentIndex);

                    // Adjust index after deletion
                    setCurrentIndex((prev) => {
                      if (previewUrls.length === 1) {
                        onClose(); // close modal if last image
                        return prev;
                      }
                      if (prev === previewUrls.length - 1) {
                        return prev - 1; // move to previous if last image was deleted
                      }
                      return prev; // stay on the same index if possible
                    });
                  }}
                  type="button"
                  className="absolute top-0.5 right-0.5 z-[1] bg-tertiary rounded-full p-0.5 flex items-center justify-center text-xs"
                >
                  <CloseIcon className="w-3 h-3 [&>path]:stroke-primary-inverted" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
