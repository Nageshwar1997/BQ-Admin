import QuillInput from '@/components/ui/inputs/quillInput';
import Textarea from '@/components/ui/inputs/Textarea';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { productDescriptionSchema } from '@/schemas/product.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TQuillImageRef } from '@/types/component.type';
import type { TProductDescription } from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import type Quill from 'quill';
import { useRef, type RefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';

const AddProductDescriptionsForm = ({
  onNext,
  step,
}: {
  onNext: () => void;
  step: TAddProductStepNumber;
}) => {
  const quillRefs: Record<
    keyof Omit<TProductDescription, 'shortDescription'>,
    RefObject<Quill | null>
  > = {
    description: useRef<Quill | null>(null),
    ingredients: useRef<Quill | null>(null),
    instructions: useRef<Quill | null>(null),
    additional: useRef<Quill | null>(null),
  };

  const imageRefs: Record<
    keyof Omit<TProductDescription, 'shortDescription'>,
    RefObject<TQuillImageRef[]>
  > = {
    description: useRef<TQuillImageRef[]>([]),
    ingredients: useRef<TQuillImageRef[]>([]),
    instructions: useRef<TQuillImageRef[]>([]),
    additional: useRef<TQuillImageRef[]>([]),
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TProductDescription>({ resolver: zodResolver(productDescriptionSchema) });

  const onSubmit = (data: TProductDescription) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    onNext();
  };

  return (
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[step]}
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
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
            quillImagesRef={imageRefs.description}
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
            quillImagesRef={imageRefs.ingredients}
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
            quillImagesRef={imageRefs.instructions}
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
            quillImagesRef={imageRefs.additional}
            placeholder="Write product additional details here..."
            value={value}
            onChange={onChange}
            error={errors.additional?.message}
          />
        )}
      />
    </form>
  );
};

export default AddProductDescriptionsForm;
