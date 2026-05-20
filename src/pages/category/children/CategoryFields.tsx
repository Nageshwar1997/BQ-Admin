import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { CATEGORY_LEVELS_MAP } from '@/constants/common.constants';
import type { ICategory } from '@/types/api.type';
import type { TCategory, TLevel2Category, TLevel3Category } from '@/types/schema.type';
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';

type TCommonFields = {
  register: UseFormRegister<TCategory>;
  errors: FieldErrors<TCategory>;
  control: Control<TCategory>;
  level: TCategory['level'];
  setValue: UseFormSetValue<TCategory>;
};

type TLevel1Fields = TCommonFields;
type TLevel2Fields = TCommonFields & {
  level1Cats: ICategory[];
  mainCategory: TLevel2Category['mainCategory'];
};
type TLevel3Fields = Omit<TLevel2Fields, 'mainCategory'> & {
  level2Cats: ICategory[];
  mainCategory: TLevel3Category['mainCategory'];
  subCategory: TLevel3Category['subCategory'];
};

const CommonFields = ({ register, errors, control, level, setValue }: TCommonFields) => (
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

export const Level1Fields = ({ register, errors, control, level, setValue }: TLevel1Fields) => {
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

export const Level2Fields = ({
  register,
  errors,
  control,
  level,
  setValue,
  level1Cats,
  mainCategory,
}: TLevel2Fields) => {
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
            options={level1Cats?.map((cat: ICategory) => ({ label: cat.name, value: cat._id }))}
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

export const Level3Fields = ({
  register,
  errors,
  control,
  level,
  setValue,
  level1Cats,
  level2Cats,
  mainCategory,
  subCategory,
}: TLevel3Fields) => {
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
            options={level1Cats?.map((cat: ICategory) => ({ label: cat.name, value: cat._id }))}
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
        error={'description' in errors ? errors.description?.message : undefined}
        containerClassName="sm:col-span-2"
        inputProps={{
          name: 'description',
          placeholder: 'Short description for this product category',
        }}
      />
    </div>
  );
};
