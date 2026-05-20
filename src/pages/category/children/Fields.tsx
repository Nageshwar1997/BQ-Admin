/* -------------------------------------------------------------------------- */
/*                                LEVEL FIELDS                                */
/* -------------------------------------------------------------------------- */

import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import type { ICategory } from '@/types/api.type';
import type { TCategory } from '@/types/schema.type';
import { Controller } from 'react-hook-form';

const CommonFields = ({
  register,
  errors,
  control,
  level,
  setValue,
}: {
  register: any;
  errors: any;
  control: any;
  level: TCategory['level'];
  setValue: any;
}) => (
  <>
    <Input
      label="Category name"
      register={register('name')}
      error={errors.name?.message}
      inputProps={{
        name: 'name',
        placeholder: 'Category name',
      }}
    />

    <Controller
      name="level"
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select
          label="Category level"
          options={['Main', 'Sub', 'Product'].map((name, i) => ({
            value: i + CATEGORY_LEVELS_MAP.L1,
            label: `L${i + CATEGORY_LEVELS_MAP.L1} - ${name} category`,
            disabled: i + 1 === level,
          }))}
          error={errors.level?.message}
          selectProps={{
            value,
            placeholder: 'Select category level',
            onChange: (value) => {
              onChange(value);

              setValue('mainCategory', undefined);
              setValue('subCategory', undefined);
              setValue('description', undefined);
            },
          }}
        />
      )}
    />
  </>
);

/* -------------------------------------------------------------------------- */
/*                              LEVEL 1 FIELDS                                */
/* -------------------------------------------------------------------------- */

const Level1Fields = ({ register, errors, control, level, setValue }: any) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        setValue={setValue}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              LEVEL 2 FIELDS                                */
/* -------------------------------------------------------------------------- */

const Level2Fields = ({
  register,
  errors,
  control,
  level,
  setValue,
  level1Cats,
  mainCategory,
}: any) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        setValue={setValue}
      />

      <Controller
        name="mainCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Main category"
            options={level1Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.mainCategory?.message}
            selectProps={{
              value: mainCategory,
              placeholder: 'Select main category',
              onChange: onChange,
            }}
          />
        )}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              LEVEL 3 FIELDS                                */
/* -------------------------------------------------------------------------- */

const Level3Fields = ({
  register,
  errors,
  control,
  level,
  setValue,
  level1Cats,
  level2Cats,
  mainCategory,
  subCategory,
}: any) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        setValue={setValue}
      />

      <Controller
        name="mainCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Main category"
            options={level1Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.mainCategory?.message}
            selectProps={{
              value: mainCategory,
              placeholder: 'Select main category',
              onChange: (value) => {
                onChange(value);

                setValue('subCategory', undefined);
              },
            }}
          />
        )}
      />

      <Controller
        name="subCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Sub-category"
            options={level2Cats?.map((cat: ICategory) => ({
              label: cat.name,
              value: cat._id,
            }))}
            error={errors.subCategory?.message}
            selectProps={{
              value: subCategory,
              placeholder: 'Select sub-category',
              disabled: !mainCategory,
              onChange,
            }}
          />
        )}
      />

      <Input
        label="Description"
        register={register('description')}
        error={errors.description?.message}
        containerClassName="sm:col-span-2"
        inputProps={{
          name: 'description',
          placeholder: 'Short description for this product category',
        }}
      />
    </div>
  );
};
