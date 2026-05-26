import type { IMediaCarousel } from '@/types/component.type';
import { Icon } from '@iconify/react';
import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';
import VideoPlayer from '../media/VideoPlayer';

const MediaCarousel = ({
  className = '',
  media,
  selected,
  onClick,
  thumbnailRefs,
  handleRemove,
  gradientClassNames,
}: IMediaCarousel) => {
  if (!media || media?.length === 0) return null;

  return (
    <ScrollableGradientContainer
      direction="horizontal"
      className={`w-full [&>div]:justify-start ${className}`}
      gradientClassNames={gradientClassNames}
    >
      <div className="flex gap-2 items-center p-2">
        {media.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (thumbnailRefs?.current) {
                thumbnailRefs.current[i] = el;
              }
            }}
            onClick={() => onClick(i)}
            className={`group relative size-14 shrink-0 overflow-hidden rounded-md border shadow-xs transition-colors duration-300 hover:opacity-100 md:size-16 lg:size-20 ${
              item.hasError
                ? 'border-red-c'
                : i === selected
                  ? 'border-tertiary opacity-100'
                  : 'border-primary/30 opacity-90'
            } ${item.type === 'video' ? 'relative' : ''}`}
          >
            {item.type === 'video' ? (
              <>
                {i !== selected && (
                  <div
                    key={i}
                    className="group pointer-events-none absolute inset-0 flex aspect-square h-full w-full items-center justify-center bg-black/50"
                  >
                    <Icon
                      icon="solar:play-linear"
                      className="text-white opacity-90 group-hover:opacity-100"
                    />
                  </div>
                )}
                <VideoPlayer
                  key={item.url}
                  videoProps={{ src: item.url, autoPlay: false }}
                  className="aspect-square h-full w-full cursor-pointer object-cover"
                />
              </>
            ) : (
              <img
                src={item.url}
                alt={`image-${i}`}
                className="aspect-square h-full w-full cursor-pointer object-cover"
              />
            )}

            {handleRemove && (
              <button
                type="button"
                className="bg-tertiary/80 absolute top-0.5 right-0.5 z-1 size-4 cursor-pointer rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
              >
                <Icon icon="lucide:x" className="text-primary-invert size-full shrink-0" />
              </button>
            )}
          </div>
        ))}
      </div>
    </ScrollableGradientContainer>
  );
};

export default MediaCarousel;
