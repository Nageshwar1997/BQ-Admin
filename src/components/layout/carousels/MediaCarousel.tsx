import type { IMediaCarousel } from '@/types/component.type';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';
import VideoPlayer from '../media/VideoPlayer';

const MediaCarousel = ({
  className = '',
  media,
  selected,
  onClick,
  onReorder,
  thumbnailRefs,
  handleRemove,
  gradientClassNames,
}: IMediaCarousel) => {
  const dragIndexRef = useRef<number | null>(null);
  const didDragRef = useRef(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!media || media?.length === 0) return null;

  const isDraggable = !!onReorder && media.length > 1;

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDraggedIndex(null);
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  };

  return (
    <ScrollableGradientContainer
      direction="horizontal"
      className={`w-full [&>div]:justify-start ${className}`}
      gradientClassNames={gradientClassNames}
    >
      <div className="flex gap-2 items-center p-2">
        {media.map((item, i) => (
          <div
            key={item.url}
            ref={(el) => {
              if (thumbnailRefs?.current) {
                thumbnailRefs.current[i] = el;
              }
            }}
            draggable={isDraggable}
            onDragStart={(e) => {
              if (!isDraggable) return;

              dragIndexRef.current = i;
              didDragRef.current = true;
              setDraggedIndex(i);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', String(i));
            }}
            onDragOver={(e) => {
              if (!isDraggable) return;

              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDragEnter={(e) => {
              if (!isDraggable) return;

              e.preventDefault();

              const fromIndex = dragIndexRef.current;
              if (fromIndex === null || fromIndex === i) return;

              onReorder?.(fromIndex, i);
              dragIndexRef.current = i;
              setDraggedIndex(i);
            }}
            onDrop={(e) => {
              if (!isDraggable) return;

              e.preventDefault();
            }}
            onDragEnd={handleDragEnd}
            onClick={() => {
              if (didDragRef.current) {
                didDragRef.current = false;
                return;
              }

              onClick(i);
            }}
            className={`group relative size-14 shrink-0 overflow-hidden rounded-md border shadow-xs transition-colors duration-300 hover:opacity-100 md:size-16 lg:size-20 ${
              item.hasError
                ? 'border-red-c'
                : i === selected
                  ? 'border-tertiary opacity-100'
                  : 'border-primary/30 opacity-90'
            } ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''} ${
              draggedIndex === i ? 'opacity-50' : ''
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
                draggable={false}
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
