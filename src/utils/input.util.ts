import { FILE_EXTENSIONS, FILE_MIME, MAX_IMAGE_FILE_SIZE } from '@/constants/common.constants';
import { DEFAULT_QUILL_LINK_ID } from '@/constants/input.constants';
import type { TQuillImageRef } from '@/types/component.type';
import type { IQuillToolbar, IToolBarOptions, TQuillToolbar } from '@/types/input.type';
import { nanoid } from 'nanoid';
import type Quill from 'quill';
import type { Delta } from 'quill';
import Inline from 'quill/blots/inline';
import type { RefObject } from 'react';
import { formatFileSize, toaster } from './common.util';

// Add Blob URL to Image
export const insertImageIntoQuill = (quill: Quill, imagesRef: RefObject<TQuillImageRef[]>) => {
  const input = document.createElement('input');

  input.type = 'file';
  input.accept = FILE_MIME.image.join(', ');
  input.click();

  input.onchange = () => {
    if (!input.files?.length) return;

    const file = input.files[0];

    // Validate file size
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      return toaster.error({
        title: 'File size limit exceeded',
        description: `Image size is ${formatFileSize(file.size)}. Max allowed size is ${formatFileSize(MAX_IMAGE_FILE_SIZE)}.`,
      });
    }

    // Validate extension and file type
    const fileTypes: readonly string[] = FILE_MIME.image;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const extensions: readonly string[] = FILE_EXTENSIONS.image;

    if (!fileTypes.includes(file.type) || !ext || !extensions.includes(ext)) {
      return toaster.error({
        title: 'Invalid file type',
        description: `File extension is .${ext ?? 'unknown'}. Allowed extensions are ${extensions.join(', ')}.`,
      });
    }

    const range = quill.getSelection();

    if (!range) return;

    const image: TQuillImageRef = { id: nanoid(), file, blobUrl: URL.createObjectURL(file) };

    imagesRef.current.push(image);

    quill.insertEmbed(
      range.index,
      'image',
      { src: image.blobUrl, alt: file.name || 'Image', id: image.id },
      'user',
    );

    // NOTE: Without 'silent', cursor may jump to the end in some cases
    quill.setSelection(range.index + 1, 0, 'silent'); // if it's not silent, the cursor will be at the end (If not working use below code)
    // quill.setSelection({ index: range.index + 1, length: 0, silent: true });
  };
};

// Clean unused images
export const removeImageFromQuill = (quill: Quill, imagesRef: RefObject<TQuillImageRef[]>) => {
  const imgs = quill.root.querySelectorAll('img');

  const editorImageIds = Array.from(imgs)
    .map((img) => img.getAttribute('data-image-id'))
    .filter((id): id is string => Boolean(id));

  const removedImages = imagesRef.current.filter((image) => !editorImageIds.includes(image.id));

  removedImages.forEach((image) => {
    URL.revokeObjectURL(image.blobUrl);
  });

  const filteredImages = imagesRef.current.filter((image) => editorImageIds.includes(image.id));

  imagesRef.current.length = 0; // clear old
  imagesRef.current.push(...filteredImages); // add new
};

// Add IDs to headings
export function enableQuillHeadingIds(quill: Quill, options: { enable: boolean }) {
  if (!options.enable) return;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const processHeadings = () => {
    const headings = quill.root.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((heading) => {
      if (heading.id) return;
      heading.id = nanoid();
    });
  };

  const debouncedProcess = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      processHeadings();
    }, 200);
  };

  quill.on('text-change', debouncedProcess);
}

// Remove copy pasted styles
export const removePastedStyles = (delta: Delta) => {
  delta.ops = delta.ops.map((op: (typeof delta.ops)[0]) => {
    if (op.attributes) {
      ['color', 'background-color', 'background-image', 'background'].forEach(
        (attr) => delete op?.attributes?.[attr],
      );
    }
    return op;
  });
  return delta;
};

// Toggle ID on link
export const toggleLinkId = (quill: Quill) => {
  const range = quill.getSelection();
  if (!range) return;

  const [link] = quill.scroll.descendant(Inline, range.index);

  if (!link) return;

  const domNode = link.domNode;
  if (domNode.getAttribute('id') === DEFAULT_QUILL_LINK_ID) {
    domNode.removeAttribute('id');
  } else {
    domNode.setAttribute('id', DEFAULT_QUILL_LINK_ID);
  }
};

// Block dragged or copied image
export const blockDraggedOrCopiedImage = (delta: Delta): boolean => {
  let block = false;

  delta.ops.forEach((op) => {
    if (op.insert && typeof op.insert === 'object' && 'image' in op.insert) {
      const image = op.insert.image as { src: string; alt?: string; id?: string };

      const isAllowedURL = image.src.startsWith('blob:');

      if (!isAllowedURL) {
        block = true;
        return;
      }
    }
  });

  if (block) {
    toaster.error({
      title: 'You cannot copy, drag & drop images here.',
      description: 'Please upload it using the upload image button.',
    });
  }

  return block;
};

// Toolbar builder
export const buildToolbar = (options?: IToolBarOptions): TQuillToolbar => {
  if (!options) return [];

  const toolbar: TQuillToolbar = [];

  if (options.header?.length) toolbar.push([{ header: options.header }]);
  if (options.text?.length) toolbar.push(options.text);
  if (options.list?.length) toolbar.push(options.list.map((item) => ({ list: item })));
  if (options.script?.length) toolbar.push(options.script.map((item) => ({ script: item })));
  if (options.indent?.length) toolbar.push(options.indent.map((item) => ({ indent: item })));
  if (options.color || options.background) {
    const colorOptions = [
      ...(options.color ? [{ color: [] }] : []),
      ...(options.background ? [{ background: [] }] : []),
    ];
    if (colorOptions.length) toolbar.push(colorOptions);
  }
  if (options.align) toolbar.push([{ align: [] }]);
  if (options.direction) toolbar.push([{ direction: options.direction }]);
  if (options.media?.length) toolbar.push(options.media);
  if (options.misc?.length) toolbar.push(options.misc);

  return toolbar;
};

// Toolbar link button
export const addLinkIdButtonToToolbar = (quill: Quill) => {
  const toolbarModule = quill.getModule('toolbar') as IQuillToolbar;

  const toolbarContainer = toolbarModule.container as HTMLElement;
  const button = document.createElement('button');
  const section = document.createElement('span');

  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" class="ql-fill">
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
      <circle cx="12" cy="12" r="5"></circle>
    </svg>
  `;

  button.type = 'button';
  button.onclick = () => toolbarModule.handlers.toggleLinkId();

  section.classList.add('ql-formats');
  section.appendChild(button);

  toolbarContainer.appendChild(section);
};
