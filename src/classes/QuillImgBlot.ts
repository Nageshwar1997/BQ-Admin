import type { TQuillImageBlot } from '@/types/input.type';
import Quill from 'quill';

type TQuillImageValue = { src: string; alt?: string; id?: string };

// Extended Image Blot
const BaseImage = Quill.import('formats/image') as TQuillImageBlot;

class QuillImgBlot extends BaseImage {
  static create(value: string | TQuillImageValue) {
    const node = super.create(value) as HTMLImageElement;

    if (typeof value === 'string') {
      node.setAttribute('src', value);
    } else {
      node.setAttribute('src', value.src);

      node.setAttribute('alt', value.alt ?? 'Image');

      if (value.id != null) {
        node.setAttribute('data-image-id', value.id);
      }
    }

    return node;
  }

  static value(node: HTMLImageElement) {
    return {
      src: node.getAttribute('src'),
      alt: node.getAttribute('alt'),
      id: node.getAttribute('data-image-id'),
    };
  }

  static sanitize(url: string) {
    if (url.startsWith('blob:')) {
      return url;
    }

    const Link = Quill.import('formats/link') as { sanitize?: (url: string) => string };

    return Link?.sanitize ? Link.sanitize(url) : url;
  }
}

export default QuillImgBlot;
