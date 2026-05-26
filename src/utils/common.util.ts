import { DEFAULT_POSTER, TOOLTIP_GAP } from '@/constants/common.constants';
import useToastStore from '@/stores/toast.store';
import type { IButton, ITooltip } from '@/types/component.type';
import type { ICustomToast, IDefaultToast, ILoadingToast } from '@/types/store.type';
import type { CSSProperties } from 'react';

export const getButtonCss = (pattern: IButton['pattern']) => {
  switch (pattern) {
    case 'primary':
      return 'text-white bg-sky-blue-burst shadow-primary-btn hover:shadow-primary-btn-hover';
    case 'secondary':
      return 'text-secondary-invert bg-secondary shadow-secondary-btn hover:shadow-secondary-btn-hover';
    case 'tertiary':
      return 'text-tertiary-invert bg-tertiary shadow-tertiary-btn hover:shadow-tertiary-btn-hover';
    case 'outline':
      return 'text-primary border border-primary shadow-outline-btn hover:shadow-outline-btn-hover';
    case 'transparent':
    default:
      return 'shadow-inner shadow-primary/20 hover:shadow-primary/30 bg-transparent border border-primary/30 text-secondary rotate-180 [&>span]:-rotate-180';
  }
};

export const getTooltipPosition = (
  rect: DOMRect,
  placement: NonNullable<ITooltip['placement']>,
): CSSProperties => {
  switch (placement) {
    case 'bottom':
      return {
        top: rect.bottom,
        left: rect.left + rect.width / 2,
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2,
        left: rect.right,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2,
        left: rect.left,
      };
    case 'top':
    default:
      return {
        top: rect.top,
        left: rect.left + rect.width / 2,
      };
  }
};

export const getTooltipTransform = (
  placement: NonNullable<ITooltip['placement']>,
  isVisible: boolean,
) => {
  switch (placement) {
    case 'bottom':
      return `translate(-50%, ${isVisible ? TOOLTIP_GAP : 0}px)`;
    case 'right':
      return `translate(${isVisible ? TOOLTIP_GAP : 0}px, -50%)`;
    case 'left':
      return `translate(calc(-100% - ${isVisible ? TOOLTIP_GAP : 0}px), -50%)`;
    case 'top':
    default:
      return `translate(-50%, calc(-100% - ${isVisible ? TOOLTIP_GAP : 0}px))`;
  }
};

export const getTooltipArrowCss = (placement: NonNullable<ITooltip['placement']>) => {
  switch (placement) {
    case 'bottom':
      return 'after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-silver-jet-2';
    case 'right':
      return 'after:top-1/2 after:right-full after:-translate-y-1/2 after:border-r-silver-jet-2';
    case 'left':
      return 'after:top-1/2 after:left-full after:-translate-y-1/2 after:border-l-silver-jet-2';
    case 'top':
    default:
      return 'after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-silver-jet-2';
  }
};

const { addToast, removeToast } = useToastStore.getState();
export const toaster = {
  success: (data: Omit<IDefaultToast, 'type'>) => addToast({ ...data, type: 'success' }),

  error: (data: Omit<IDefaultToast, 'type'>) => addToast({ ...data, type: 'error' }),

  warning: (data: Omit<IDefaultToast, 'type'>) => addToast({ ...data, type: 'warning' }),
  loading: (data: Omit<ILoadingToast, 'type'>) => addToast({ ...data, type: 'loading' }),

  custom: (data: ICustomToast) => addToast(data),

  remove: (toastId: string) => removeToast(toastId),
};

export const deepEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);

  if (isArray1 !== isArray2) return false;

  if (isArray1 && isArray2) {
    if (obj1.length !== obj2.length) return false;

    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};

function getPosterFromBlobVideo(blobVideoUrl: string, timeInSeconds = 0): Promise<string> {
  return new Promise((resolve) => {
    let posterCreated = false;
    let isCancelled = false;

    const video = document.createElement('video');
    video.src = blobVideoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadeddata', () => {
      if (!isCancelled) video.currentTime = timeInSeconds;
    });

    video.addEventListener('seeked', () => {
      if (isCancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(DEFAULT_POSTER);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      posterCreated = true;
      resolve(canvas.toDataURL('image/png'));
      video.src = '';
    });

    video.addEventListener('error', () => {
      if (!posterCreated && !isCancelled) {
        resolve(DEFAULT_POSTER); // no console.error to avoid noise
      }
    });

    // Cancel function for cleanup
    return () => {
      isCancelled = true;
      video.src = '';
    };
  });
}

export function convertVideoToPoster(videoUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!videoUrl) {
      resolve(DEFAULT_POSTER);
      return;
    }

    try {
      // Case 1: Cloudinary URL → instant
      if (videoUrl.includes('/upload/')) {
        const [base, versionAndPath] = videoUrl.split('/upload/');
        const cleanedPath = versionAndPath.replace(/^.*?(\/v\d+)/, '$1');
        const posterPath = cleanedPath.replace(/\.(m3u8|mp4|webm|ogg|mov)$/, '.webp');
        resolve(`${base}/upload/so_0${posterPath}`);
        return;
      }

      // Case 2: Blob URL or direct video file → async extract
      if (videoUrl.startsWith('blob:') || /\.(mp4|webm|ogg|m3u8|mov)$/i.test(videoUrl)) {
        getPosterFromBlobVideo(videoUrl)
          .then((poster) => resolve(poster || DEFAULT_POSTER))
          .catch(() => resolve(DEFAULT_POSTER));
        return;
      }

      // Fallback
      resolve(DEFAULT_POSTER);
    } catch (error) {
      console.error('Failed to create poster URL', error);
      resolve(DEFAULT_POSTER);
    }
  });
}
