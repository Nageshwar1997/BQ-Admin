import QuillImgBlot from '@/classes/QuillImgBlot';
import { defaultQuillToolbar } from '@/constants/input.constants';
import type { IQuillInput } from '@/types/input.type';
import {
  addLinkIdButtonToToolbar,
  blockDraggedOrCopiedImage,
  buildToolbar,
  enableQuillHeadingIds,
  insertImageIntoQuill,
  removeImageFromQuill,
  removePastedStyles,
  toggleLinkId,
} from '@/utils/input.util';
import Quill, { Delta } from 'quill';
import { forwardRef, useEffect, useRef } from 'react';
import { InputError, InputLabel } from '../children';
import './quillInput.css';

Quill.register('formats/image', QuillImgBlot, true);
Quill.register('modules/headingIds', enableQuillHeadingIds);

const QuillInput = forwardRef<Quill | null, IQuillInput>(
  (
    {
      label,
      disabled,
      error,
      className,
      value,
      onChange,
      placeholder = 'Write your content here...',
      quillImagesRef,
      toolbarOptions,
      needLinkButton = true,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Quill | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const editorContainer = document.createElement('div');

      container.innerHTML = '';
      container.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: {
            container: toolbarOptions ? buildToolbar(toolbarOptions) : defaultQuillToolbar,
            handlers: {
              ...(quillImagesRef && {
                image: () => insertImageIntoQuill(quill, quillImagesRef),
              }),
              ...(needLinkButton && { toggleLinkId: () => toggleLinkId(quill) }),
            },
          },
          clipboard: {
            matchVisual: true,
            matchers: [
              // *NOTE - To remove copy pasted images
              ['IMG', () => new Delta()],
              // *NOTE - To remove copy pasted styles
              [Node.ELEMENT_NODE, (_node: HTMLElement, delta: Delta) => removePastedStyles(delta)],
            ],
          },
          headingIds: { enable: true },
        },
      });

      // Add link id button to toolbar
      if (needLinkButton) {
        addLinkIdButtonToToolbar(quill);
      }

      // Hide link tooltip on editor scroll
      const handleScroll = () => {
        const tooltip = (quill.theme as { tooltip?: { hide: () => void } }).tooltip;

        tooltip?.hide();
      };

      quill.root.addEventListener('scroll', handleScroll);

      quill.on('text-change', (delta, _oldDelta, source) => {
        // *NOTE - Don't change order
        const html = quill.root.innerHTML.trim();

        onChange?.(html);

        if (quillImagesRef) {
          removeImageFromQuill(quill, quillImagesRef);
        }

        if (source !== 'user') return; // only block user actions

        // *NOTE - For prevent drag & drop Or Copy images
        const isDraggedOrCopied = blockDraggedOrCopiedImage(delta);

        if (isDraggedOrCopied) {
          quill.history.undo();
        }
      });

      editorRef.current = quill;

      if (ref) {
        if (typeof ref === 'function') {
          ref(quill);
        } else {
          ref.current = quill;
        }
      }

      // Cache current blob URLs for cleanup on unmount
      const blobUrls = quillImagesRef?.current.map((image) => image.blobUrl);

      return () => {
        quill.root.removeEventListener('scroll', handleScroll);

        if (ref && 'current' in ref) {
          ref.current = null;
        }

        container.innerHTML = '';

        if (blobUrls) {
          blobUrls.forEach((url) => URL.revokeObjectURL(url));
        }
      };
    }, []);

    // Set value when it changes from outside
    useEffect(() => {
      if (editorRef.current && value !== editorRef.current.root.innerHTML) {
        editorRef.current.root.innerHTML = value || '';
      }
    }, [value]);

    useEffect(() => {
      editorRef.current?.enable(!disabled);
    }, [disabled]);

    return (
      <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${className}`}>
        <div className="relative">
          <InputLabel children={label} />

          <div
            ref={containerRef}
            className="custom-editor bg-smoke-eerie border-primary/10 text-primary w-full overflow-hidden rounded-lg border"
          />
        </div>

        <InputError error={error} />
      </div>
    );
  },
);

export default QuillInput;
