import FileInput from '@/components/ui/inputs/FileInput';
import { EMPTY_ARRAY, FILE_MIME } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { productMediaSchema } from '@/schemas/product.schema';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { TBaseProduct, TProductMedia } from '@/types/schema.type';
import { toErrorMessageArray } from '@/utils/form.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

const AddProductMediaForm = ({
  onNext,
  step,
}: {
  onNext: (key: keyof TBaseProduct, value: TBaseProduct[keyof TBaseProduct]) => void;
  step: TAddProductStepNumber;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    resetField,
    setValue,
  } = useForm<TProductMedia>({ resolver: zodResolver(productMediaSchema) });

  const images = useWatch({ control, name: 'images' });
  const thumbnail = useWatch({ control, name: 'thumbnail' });
  const video = useWatch({ control, name: 'video' });

  const getInputErrors = (field: keyof TProductMedia) => {
    return toErrorMessageArray<TProductMedia>(errors[field]);
  };

  const onSubmit = (data: TProductMedia) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    onNext('media', data);
  };

  return (
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[step]}
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="thumbnail"
          render={({ field: { name, onChange, value } }) => (
            <FileInput
              label="Thumbnail"
              fileInputProps={{
                name,
                placeholder: !!thumbnail ? 'Change thumbnail' : 'Select thumbnail',
                onChange: ({ target: { files } }) => onChange(files?.[0]),
                value,
              }}
              errors={getInputErrors('thumbnail')}
              handleRemove={() => resetField('thumbnail')}
            />
          )}
        />
        <Controller
          control={control}
          name="video"
          render={({ field: { name, value, onChange } }) => (
            <FileInput
              label="Video"
              fileInputProps={{
                name,
                placeholder: !!video ? 'Change video' : 'Select video',
                accept: FILE_MIME.video.join(','),
                onChange: ({ target: { files } }) => onChange(files?.[0]),
                value,
              }}
              errors={getInputErrors('video')}
              handleRemove={() => resetField('video')}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="images"
        defaultValue={[]}
        render={({ field: { name, onChange, value } }) => (
          <FileInput
            label="Images"
            fileInputProps={{
              name,
              placeholder: images?.length ? 'Change images' : 'Select images',
              multiple: true,
              disabled: images?.length >= 10,
              onChange: (event) => {
                const newFiles = Array.from(event.target.files || EMPTY_ARRAY);
                const files = [...images, ...newFiles];
                onChange(files);
              },
              value,
            }}
            errors={getInputErrors('images')}
            handleRemove={(index) => {
              const nextValue = images.filter((_, currentIndex) => currentIndex !== index);

              setValue('images', nextValue, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
        )}
      />
    </form>
  );
};
export default AddProductMediaForm;
