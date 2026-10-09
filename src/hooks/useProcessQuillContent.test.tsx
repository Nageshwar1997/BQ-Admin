// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useToastStore from '@/stores/toast.store';
import { renderHook, unmountAll } from '@/test-utils/react';
import type { IUploadItemHandle } from '@/types/common.type';
import type { IQuillImageRef } from '@/types/component.type';

import { useProcessQuillContent } from './useProcessQuillContent';

const mutateAsync = vi.fn();
const revokeObjectURL = vi.fn();

vi.mock('@/services/media-service/media.service.query', () => ({
  useUploadMultipleMedia: () => ({ mutateAsync, isPending: false }),
}));

// The sanitizer is tested on its own; here it must not get in the way of what is being checked.
vi.mock('@/utils/input.util', () => ({ sanitizeQuillHtml: (html: string) => html }));

interface IForm {
  description?: string;
}

const file = (name: string) => new File(['x'], name);

const quillWith = (html: string) => {
  const root = { innerHTML: html };

  return { ref: { current: { root } } as never, root };
};

const imagesOf = (...images: IQuillImageRef[]) => ({ current: images });

const run = () => {
  const setValue = vi.fn();
  const hook = renderHook(() => useProcessQuillContent<IForm>());

  return { setValue, process: hook.result.current.processQuillContent };
};

describe('useProcessQuillContent', () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    useToastStore.setState({ toasts: [] });
    revokeObjectURL.mockReset();
    URL.revokeObjectURL = revokeObjectURL;
  });

  afterEach(() => {
    unmountAll();
  });

  it('does nothing without an editor', async () => {
    const { setValue, process } = run();

    const content = await process({
      quillRef: { current: null },
      imagesRef: imagesOf(),
      setValue,
      field: 'description',
      folder: 'Lipstick',
    });

    expect(content).toBe('');
    expect(setValue).not.toHaveBeenCalled();
  });

  it('gives back no content for an empty editor', async () => {
    const { setValue, process } = run();

    const content = await process({
      quillRef: quillWith('<p><br></p>').ref,
      imagesRef: imagesOf(),
      setValue,
      field: 'description',
      folder: 'Lipstick',
    });

    expect(content).toBeUndefined();
    expect(setValue).toHaveBeenCalledWith('description', undefined);
  });

  it('sets the content as it is when there are no images to upload', async () => {
    const { setValue, process } = run();

    const content = await process({
      quillRef: quillWith('<p>Hello</p>').ref,
      imagesRef: imagesOf(),
      setValue,
      field: 'description',
      folder: 'Lipstick',
    });

    expect(content).toBe('<p>Hello</p>');
    expect(setValue).toHaveBeenCalledWith('description', '<p>Hello</p>');
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('uploads the images, hands the row of its toast to the upload, and swaps the blob urls for the uploaded ones', async () => {
    mutateAsync.mockResolvedValue({ data: ['https://cdn/a.png', 'https://cdn/b.png'] });

    const first = file('a.png');
    const second = file('b.png');
    const quill = quillWith('<p><img src="blob:a"><img src="blob:b"></p>');
    const imagesRef = imagesOf(
      { id: '1', file: first, blobUrl: 'blob:a' },
      { id: '2', file: second, blobUrl: 'blob:b' },
    );
    const progress: IUploadItemHandle = { run: vi.fn() };
    const { setValue, process } = run();

    const content = await process({
      quillRef: quill.ref,
      imagesRef,
      setValue,
      field: 'description',
      folder: 'Lipstick',
      progress,
    });

    const payload = mutateAsync.mock.calls[0]?.[0] as {
      data: FormData;
      progress: IUploadItemHandle;
    };

    expect(payload.data.getAll('files')).toEqual([first, second]);
    expect(payload.data.get('folder')).toBe('Lipstick');
    expect(payload.progress).toBe(progress);

    expect(content).toBe('<p><img src="https://cdn/a.png"><img src="https://cdn/b.png"></p>');
    expect(setValue).toHaveBeenCalledWith('description', content);
    expect(quill.root.innerHTML).toBe(content);
    expect(imagesRef.current).toEqual([]);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:a');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:b');
  });

  it('fails, and says so, when not every image came back with a url', async () => {
    mutateAsync.mockResolvedValue({ data: ['https://cdn/a.png'] });

    const { setValue, process } = run();

    await expect(
      process({
        quillRef: quillWith('<p><img src="blob:a"><img src="blob:b"></p>').ref,
        imagesRef: imagesOf(
          { id: '1', file: file('a.png'), blobUrl: 'blob:a' },
          { id: '2', file: file('b.png'), blobUrl: 'blob:b' },
        ),
        setValue,
        field: 'description',
        folder: 'Lipstick',
      }),
    ).rejects.toThrow('File upload count mismatch');

    expect(setValue).not.toHaveBeenCalled();
    expect(useToastStore.getState().toasts).toMatchObject([
      { type: 'error', title: 'Upload failed' },
    ]);
  });
});
