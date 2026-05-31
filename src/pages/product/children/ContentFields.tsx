import QuillInput from '@/components/ui/inputs/quillInput';
import Textarea from '@/components/ui/inputs/Textarea';
import type { TProductDescription } from '@/types/schema.type';
import type Quill from 'quill';
import { useRef, type RefObject } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

const ContentFields = ({ form }: { form: UseFormReturn<TProductDescription> }) => {
  const quillRefs: Record<
    keyof Omit<TProductDescription, 'shortDescription'>,
    RefObject<Quill | null>
  > = {
    description: useRef<Quill | null>(null),
    ingredients: useRef<Quill | null>(null),
    instructions: useRef<Quill | null>(null),
    additional: useRef<Quill | null>(null),
  };

  const blobUrlRefs: Record<
    keyof Omit<TProductDescription, 'shortDescription'>,
    RefObject<string[]>
  > = {
    description: useRef<string[]>([]),
    ingredients: useRef<string[]>([]),
    instructions: useRef<string[]>([]),
    additional: useRef<string[]>([]),
  };

  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4">
      <Textarea
        label="Short description"
        register={register('shortDescription')}
        error={errors.shortDescription?.message}
        textAreaProps={{ placeholder: 'Short description', name: 'shortDescription' }}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <QuillInput
            label="Description"
            ref={quillRefs.description}
            blobUrlsRef={blobUrlRefs.description}
            placeholder="Write product description here..."
            value={value}
            onChange={onChange}
            error={errors.description?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="ingredients"
        render={({ field: { onChange, value } }) => (
          <QuillInput
            label="Ingredients"
            ref={quillRefs.ingredients}
            blobUrlsRef={blobUrlRefs.ingredients}
            placeholder="Write product ingredients here..."
            value={value}
            onChange={onChange}
            error={errors.ingredients?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="instructions"
        render={({ field: { onChange, value } }) => (
          <QuillInput
            label="Usage instructions"
            ref={quillRefs.instructions}
            blobUrlsRef={blobUrlRefs.instructions}
            placeholder="Write product usage instructions here..."
            value={value}
            onChange={onChange}
            error={errors.instructions?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="additional"
        render={({ field: { onChange, value } }) => (
          <QuillInput
            label="Additional details"
            ref={quillRefs.additional}
            blobUrlsRef={blobUrlRefs.additional}
            placeholder="Write product additional details here..."
            value={value}
            onChange={onChange}
            error={errors.additional?.message}
          />
        )}
      />
    </div>
  );
};

export default ContentFields;
