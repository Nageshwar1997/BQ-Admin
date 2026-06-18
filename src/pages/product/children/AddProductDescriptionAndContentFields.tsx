import QuillInput from '@/components/ui/inputs/quillInput';
import Textarea from '@/components/ui/inputs/Textarea';
import { PRODUCT_DESCRIPTION_AND_CONTENT_INPUT_MAP_DATA } from '@/constants/input.constants';
import type { TAddProductStepNumber, TProductQuillImageRefs, TProductQuillRefs } from '@/types/common.type';
import type { TProductDescriptionAndContent } from '@/types/schema.type';
import { Controller, type UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<TProductDescriptionAndContent>;
  imageRefs: TProductQuillImageRefs;
  quillRefs: TProductQuillRefs;
  onEdit: (step: TAddProductStepNumber) => void;
};

const AddProductDescriptionAndContentFields = ({ form, imageRefs, quillRefs }: Props) => {
  return (
    <div className="grid gap-4">
      {PRODUCT_DESCRIPTION_AND_CONTENT_INPUT_MAP_DATA.map(({ label, name, placeholder }) =>
        name === 'shortDescription' ? (
          <Textarea
            key={name}
            label={label}
            register={form.register(name)}
            error={form.formState.errors[name]?.message}
            textAreaProps={{ placeholder, name }}
          />
        ) : (
          <Controller
            key={name}
            control={form.control}
            name={name}
            render={({ field: { onChange, value } }) => (
              <QuillInput
                label={label}
                ref={quillRefs[name]}
                imagesRef={imageRefs[name]}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                error={form.formState.errors[name]?.message}
              />
            )}
          />
        ),
      )}
    </div>
  );
};

export default AddProductDescriptionAndContentFields;
