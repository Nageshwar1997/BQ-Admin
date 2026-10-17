import '@beautinique/frontend-styles/quill-input.css';

import { InputError, InputLabel } from '@beautinique/frontend-components';
import {
  describeQuillEditorError,
  QuillEditor,
  type QuillImageRef,
} from '@beautinique/frontend-quill/editor';
import type Quill from 'quill';
import { forwardRef, type RefObject, useId } from 'react';

import { toaster } from '@/utils/toaster';

interface IQuillInput {
  label?: string;
  error?: string;
  /** Classes of the whole field (label, editor and message). */
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  /** Where the images picked in the editor wait until the content is saved (see `useProcessQuillContent`). */
  imagesRef?: RefObject<QuillImageRef[]>;
  /** The button that gives a link the id of a button. Default: `true`. */
  needLinkButton?: boolean;
}

/**
 * The editor of the shared quill package with the label and the error message of this app around it.
 * The package's editor is only the box: it reports what it does not allow (a big image, a dragged-in
 * one) and the toaster of the app says it.
 */
const QuillInput = forwardRef<Quill | null, IQuillInput>(
  (
    {
      label,
      error,
      className = '',
      placeholder = 'Write your content here...',
      disabled,
      value,
      onChange,
      imagesRef,
      needLinkButton = true,
    },
    ref,
  ) => {
    const id = useId();
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;

    return (
      <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${className}`}>
        <div className="relative">
          <InputLabel id={labelId}>{label}</InputLabel>

          <QuillEditor
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            imagesRef={imagesRef}
            linkIdButton={needLinkButton}
            onError={(editorError) => {
              toaster.error(describeQuillEditorError(editorError));
            }}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
          />
        </div>

        <InputError id={errorId} error={error} />
      </div>
    );
  },
);

QuillInput.displayName = 'QuillInput';

export default QuillInput;
