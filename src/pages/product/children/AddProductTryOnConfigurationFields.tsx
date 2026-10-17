import { Button, Checkbox, Select } from '@beautinique/frontend-components';
import { TRY_ON_CATEGORIES, TRY_ON_MAP } from '@beautinique/frontend-constants';
import type { IShade } from '@beautinique/frontend-tryon';
import type {
  TProductTryOnConfigurationZodSchema,
  TTryOnSelection,
} from '@beautinique/frontend-types';
import { useMemo, useState } from 'react';
import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';

import TryOnModal from '@/components/layout/tryons';
import { PRODUCT_TRYON_INPUT_MAP_DATA } from '@/constants/input.constants';

interface Props {
  form: UseFormReturn<TProductTryOnConfigurationZodSchema>;
  /** The colour variants of the product (step 4): the shades the try-on tries. May be empty. */
  shades: IShade[];
}

/** Both selects are filled (while a person chooses, the form can hold a category without its subcategory). */
const isComplete = (
  selection: Partial<TTryOnSelection> | undefined,
): selection is TTryOnSelection => Boolean(selection?.category && selection.subCategory);

const AddProductTryOnConfigurationFields = ({ form, shades }: Props) => {
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const {
    control,
    formState: { errors },
    register,
    resetField,
  } = form;

  const enabled = useWatch({ control, name: 'enabled' });
  const tryOn = useWatch({ control, name: 'tryOn' });

  const subCategories = useMemo(() => {
    return tryOn?.category ? TRY_ON_MAP[tryOn.category] : [];
  }, [tryOn]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {PRODUCT_TRYON_INPUT_MAP_DATA.map((input) => {
        if (input.type === 'select' && !enabled) return null;
        return input.type === 'select' ? (
          <Controller
            key={input.name}
            name={`tryOn.${input.name}`}
            control={control}
            render={({ field: { onChange, value } }) => {
              const options = input.name === 'subCategory' ? subCategories : TRY_ON_CATEGORIES;
              return (
                <Select
                  label={input.label}
                  error={'tryOn' in errors ? errors.tryOn?.[input.name]?.message : undefined}
                  options={options.map((category) => ({ label: category, value: category }))}
                  selectProps={{
                    value: value ?? '',
                    placeholder: input.placeholder,
                    disabled: input.name === 'subCategory' && !tryOn?.category,
                    onChange: (value) => {
                      if (input.name === 'category') {
                        resetField('tryOn.subCategory');
                      }
                      onChange(value);
                    },
                  }}
                  className="lowercase"
                  optionsClassName="lowercase"
                />
              );
            }}
          />
        ) : (
          <Checkbox
            key={input.name}
            register={register('enabled')}
            error={errors.enabled?.message}
            content="Enable TryOn"
            checkboxProps={{
              name: 'enabled',
              onChange: () => {
                resetField('tryOn');
              },
            }}
            containerClassName="col-span-2"
          />
        );
      })}
      {enabled && (
        <>
          <Button
            content="Try it on"
            pattern="secondary"
            className="col-span-2"
            leftIcon={{ icon: 'solar:magic-stick-3-linear' }}
            buttonProps={{
              onClick: () => {
                setIsTryOnOpen(true);
              },
            }}
          />
          {/* The modal where the category and the subcategory are tried on and chosen: Apply fills the two fields above */}
          <TryOnModal
            selectable
            isOpen={isTryOnOpen}
            onClose={() => {
              setIsTryOnOpen(false);
            }}
            tryOn={isComplete(tryOn) ? tryOn : undefined}
            shades={shades}
            onApply={(selection) => {
              form.setValue('tryOn.category', selection.category, {
                shouldDirty: true,
                shouldValidate: true,
              });
              form.setValue('tryOn.subCategory', selection.subCategory, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
        </>
      )}
    </div>
  );
};

export default AddProductTryOnConfigurationFields;
