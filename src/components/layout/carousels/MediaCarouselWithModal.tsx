import type { IMediaCarouselWithParent } from '@/types/component.type';
import { useState } from 'react';
import { MediaModal } from '../modals/MediaModal';
import MediaCarousel from './MediaCarousel';

const MediaCarouselWithModal = ({
  media,
    videoProps,
  className=''
}: Pick<IMediaCarouselWithParent, 'media' | 'videoProps' | 'className'>) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  if (!media.length) return null;

  return (
    <div className={`max-w-full min-w-0 [&>div:first-child>div>div>div]:p-0! ${className}`}>
      <MediaCarousel
        media={media}
        selected={currentIndex}
        onClick={(index) => setCurrentIndex(index)}
      />

      <MediaModal
        media={media}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        opened={currentIndex !== null}
        onClose={() => setCurrentIndex(null)}
        videoProps={videoProps}
      />
    </div>
  );
};

export default MediaCarouselWithModal;
