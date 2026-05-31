import type { TQuillImageBlot } from '@/types/input.type';
import Quill from 'quill';

// Extended Image Blot
const BaseImage = Quill.import('formats/image') as TQuillImageBlot;

class QuillImgBlot extends BaseImage {
  static create(value: { alt: string; src: string } | string) {
    const node = super.create(value) as HTMLImageElement;
    if (typeof value === 'string') {
      node.setAttribute('src', value);
    } else if (value?.src) {
      node.setAttribute('src', value.src);
      if (value.alt) node.setAttribute('alt', value.alt || 'Image');
    }
    return node;
  }
  static value(node: HTMLImageElement) {
    return { src: node.getAttribute('src'), alt: node.getAttribute('alt') };
  }
  static sanitize(url: string) {
    if (url.startsWith('blob:')) return url;
    const Link = Quill.import('formats/link') as { sanitize?: (url: string) => string };
    return Link?.sanitize ? Link.sanitize(url) : url;
  }
}

export default QuillImgBlot;
