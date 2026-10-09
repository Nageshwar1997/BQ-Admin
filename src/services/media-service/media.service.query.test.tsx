// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AxiosProgressEvent } from 'axios';
import { act, useLayoutEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mediaApi } from '@/classes/apis';
import useToastStore from '@/stores/toast.store';
import { mount, unmountAll } from '@/test-utils/react';
import type { IUploadItemHandle } from '@/types/common.type';

import { useUploadMultipleMedia, useUploadSingleMedia } from './media.service.query';

vi.mock('@/classes/apis', () => ({
  mediaApi: { uploadSingle: vi.fn(), uploadMultiple: vi.fn() },
}));

const file = (name: string, size: number) => new File([new Uint8Array(size)], name);

const formDataOf = (...files: File[]) => {
  const data = new FormData();

  files.forEach((one) => {
    data.append('files', one);
  });
  data.append('folder', 'Lipstick');

  return data;
};

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const mountHook = <T,>(useHook: () => T) => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const result = { current: undefined as T };

  const Probe = () => {
    const value = useHook();

    useLayoutEffect(() => {
      result.current = value;
    });

    return null;
  };

  mount(
    <QueryClientProvider client={queryClient}>
      <Probe />
    </QueryClientProvider>,
  );

  return result;
};

/** Lets the mutation get as far as calling the API. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

const toasts = () => useToastStore.getState().toasts;

const uploadsToast = () => {
  const toast = toasts().find(({ type }) => type === 'uploads');

  if (toast?.type !== 'uploads') throw new Error('There is no uploads toast');

  return toast;
};

describe('useUploadMultipleMedia', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.mocked(mediaApi.uploadMultiple).mockReset();
  });

  afterEach(() => {
    unmountAll();
  });

  it('shows one toast with how many of the files are through, and nothing else when it is done', async () => {
    const request = deferred<unknown>();
    let onUploadProgress: ((event: AxiosProgressEvent) => void) | undefined;

    vi.mocked(mediaApi.uploadMultiple).mockImplementation((props) => {
      onUploadProgress = props.onUploadProgress;

      return request.promise as never;
    });

    const mutation = mountHook(() => useUploadMultipleMedia());
    let upload!: Promise<unknown>;

    act(() => {
      upload = mutation.current.mutateAsync({
        data: formDataOf(file('a.png', 100), file('b.png', 200), file('c.png', 300)),
        toasterInfo: { title: 'Please wait...', description: 'Uploading images' },
      });
    });
    await settle();

    expect(toasts()).toHaveLength(1);
    expect(uploadsToast()).toMatchObject({
      title: 'Please wait...',
      description: 'Uploading images',
    });
    expect(uploadsToast().items).toMatchObject([
      { status: 'uploading', fileSizes: [100, 200, 300], total: 600 },
    ]);

    act(() => {
      onUploadProgress?.({ loaded: 250, total: 650 } as AxiosProgressEvent);
    });

    expect(uploadsToast().items[0]).toMatchObject({ loaded: 250, total: 650 });

    request.resolve({ message: 'Files uploaded', data: ['a', 'b', 'c'] });

    await expect(upload).resolves.toMatchObject({ data: ['a', 'b', 'c'] });
    expect(toasts()).toHaveLength(1); // no extra "uploaded" toast: this one says it
    expect(uploadsToast().items[0]?.status).toBe('success');
  });

  it('uses the row it is given instead of opening a toast of its own', async () => {
    const run = vi.fn(<T,>(request: (onProgress: () => void) => Promise<T>) =>
      request(() => undefined),
    );
    const progress: IUploadItemHandle = { run: run as IUploadItemHandle['run'] };

    vi.mocked(mediaApi.uploadMultiple).mockResolvedValue({ message: 'ok', data: ['a'] });

    const mutation = mountHook(() => useUploadMultipleMedia());
    let upload!: Promise<unknown>;

    act(() => {
      upload = mutation.current.mutateAsync({ data: formDataOf(file('a.png', 1)), progress });
    });

    await expect(upload).resolves.toMatchObject({ data: ['a'] });
    expect(run).toHaveBeenCalledTimes(1);
    expect(toasts()).toEqual([]);
  });

  it('opens no toast when there are no files', async () => {
    vi.mocked(mediaApi.uploadMultiple).mockResolvedValue({ message: 'ok', data: [] });

    const mutation = mountHook(() => useUploadMultipleMedia());
    let upload!: Promise<unknown>;

    act(() => {
      upload = mutation.current.mutateAsync({ data: formDataOf() });
    });

    await expect(upload).resolves.toMatchObject({ data: [] });
    expect(toasts()).toEqual([]);
  });

  it('shows the upload as failed, with the error of the server', async () => {
    vi.mocked(mediaApi.uploadMultiple).mockRejectedValue({ message: 'File is too large' });

    const mutation = mountHook(() => useUploadMultipleMedia());
    let upload!: Promise<unknown>;

    act(() => {
      upload = mutation.current.mutateAsync({ data: formDataOf(file('a.png', 1)) });
    });

    await expect(upload).rejects.toMatchObject({ message: 'File is too large' });
    expect(uploadsToast().items[0]?.status).toBe('error');
    expect(
      toasts().some((toast) => toast.type === 'error' && toast.description === 'File is too large'),
    ).toBe(true);
  });
});

describe('useUploadSingleMedia', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.mocked(mediaApi.uploadSingle).mockReset();
  });

  afterEach(() => {
    unmountAll();
  });

  it('still shows its own progress toast, then the "uploaded" message', async () => {
    const request = deferred<unknown>();

    vi.mocked(mediaApi.uploadSingle).mockImplementation(() => request.promise as never);

    const mutation = mountHook(() => useUploadSingleMedia());
    let upload!: Promise<unknown>;
    const data = new FormData();

    data.append('file', file('thumbnail.png', 10));

    act(() => {
      upload = mutation.current.mutateAsync({
        data,
        toasterInfo: { description: 'Uploading thumbnail' },
      });
    });
    await settle();

    expect(toasts()).toMatchObject([
      {
        type: 'progress',
        title: 'Please wait...',
        description: 'Uploading thumbnail',
        progress: 0,
      },
    ]);

    request.resolve({ message: 'Thumbnail uploaded', data: 'https://cdn/t.png' });
    await upload;
    await settle();

    expect(toasts()).toMatchObject([{ type: 'success', description: 'Thumbnail uploaded' }]);
  });
});
