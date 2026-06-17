import { EMPTY_OBJECT } from '@/constants/common.constants';
import type { IVideoPlayer } from '@/types/component.type';
import { convertVideoToPoster } from '@/utils/common.util';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({ className = '', videoProps = EMPTY_OBJECT, ref }: IVideoPlayer) => {
  const videoRef = useRef<HTMLVideoElement | null>(ref?.current ?? null);
  const [poster, setPoster] = useState<string | undefined>(videoProps.poster);

  useEffect(() => {
    setPoster(videoProps.poster);
  }, [videoProps.poster]);

  useEffect(() => {
    let isMounted = true;

    const loadPoster = async () => {
      if (!videoProps.src || videoProps.poster) return;

      try {
        const generatedPoster = await convertVideoToPoster(videoProps.src);

        if (isMounted) {
          setPoster(generatedPoster);
        }
      } catch (error) {
        console.error('Poster generation failed:', error);
      }
    };

    loadPoster();

    return () => {
      isMounted = false;
    };
  }, [videoProps.src, videoProps.poster]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoProps.src) return;

    let hls: Hls | null = null;

    const isHls = videoProps.src.endsWith('.m3u8');

    if (isHls) {
      video.pause();

      video.removeAttribute('src');
      video.load();

      if (Hls.isSupported()) {
        hls = new Hls();

        hls.loadSource(videoProps.src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoProps.autoPlay) {
            video.play().catch((err) => {
              console.warn('Autoplay blocked:', err);
            });
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoProps.src;

        video.addEventListener(
          'loadedmetadata',
          () => {
            if (videoProps.autoPlay) {
              video.play().catch((err) => {
                console.warn('Autoplay blocked:', err);
              });
            }
          },
          { once: true },
        );
      }
    }

    return () => {
      hls?.destroy();
    };
  }, [videoProps.src, videoProps.autoPlay, videoProps]);

  return (
    <div className={`h-full w-full ${className}`}>
      <video
        key={videoProps.src}
        ref={videoRef}
        {...videoProps}
        playsInline={videoProps.playsInline ?? true}
        autoPlay={videoProps.autoPlay ?? true}
        muted={videoProps.muted ?? true}
        loop={videoProps.loop ?? false}
        controls={videoProps.controls ?? false}
        className={`aspect-auto h-full w-full object-cover ${videoProps.className ?? ''}`}
        poster={poster}
      />
    </div>
  );
};

export default VideoPlayer;
