import Input from '@/components/ui/inputs/Input';
import QuillInput from '@/components/ui/inputs/quillInput';
import type { TProductDescription } from '@/types/schema.type';
import type Quill from 'quill';
import { useRef } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

const ContentFields = ({ form }: { form: UseFormReturn<TProductDescription> }) => {
  const quillRefs = {
    description: useRef<Quill | null>(null),
  };

  const blobUrlRefs = {
    description: useRef<string[]>([]),
  };

  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div>
      <Input
        label="Short description"
        register={register('shortDescription')}
        error={errors.shortDescription?.message}
        inputProps={{
          placeholder: 'Short description',
        }}
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
    </div>
  );
};

export default ContentFields;
