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
  if (!media || media.length === 0) return null;

  return (
    <ScrollableGradientContainer
      direction="horizontal"
      className={`w-full [&>div]:justify-start ${className}`}
      gradientClassNames={gradientClassNames}
    >
      <div className="flex items-center gap-2 p-2">
        {media.map((item, i) => (
          <div
            key={`${item.url}-${i}`}
            ref={(el) => {
              if (thumbnailRefs?.current) {
                thumbnailRefs.current[i] = el;
              }
            }}
            onClick={() => onClick(i)}
            className={`group relative size-14 shrink-0 overflow-hidden rounded-md border shadow-xs transition-colors duration-300 hover:opacity-100 md:size-16 lg:size-20 ${
              i === selected
                  ? 'border-tertiary opacity-100'
                  : 'border-primary/30 opacity-90'
            } ${item.type === 'video' ? 'relative' : ''}`}
          >
            {item.type === 'video' ? (
              <>
                {i !== selected && (
                  <div className="group pointer-events-none absolute inset-0 flex aspect-square size-full items-center justify-center bg-black/50">
                    <Icon
                      icon="solar:play-linear"
                      className="text-white opacity-90 group-hover:opacity-100"
                    />
                  </div>
                )}
                <VideoPlayer
                  videoProps={{ src: item.url, autoPlay: false }}
                  className="aspect-square h-full w-full cursor-pointer object-cover"
                />
              </>
            ) : (
              <img
                src={item.url}
                alt={`image-${i}`}
                draggable={false}
                className="aspect-square h-full w-full cursor-pointer object-cover"
              />
            )}

            {handleRemove && (
              <button
                type="button"
                className="bg-tertiary/80 absolute top-0.5 right-0.5 z-1 flex size-4 items-center justify-center rounded-full"
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
