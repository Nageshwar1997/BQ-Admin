import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/inputs/Input';
import { QUERY_PARAMS_KEY_MAP } from '@/constants/common.constants';
import useDebounce from '@/hooks/useDebounce';
import useQueryParams from '@/hooks/useQueryParams';
import type { TCategory } from '@/types/api.type';
import type { TClassName } from '@/types/component.type';
import { useEffect, useState } from 'react';

const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const QUERY_CLEAR_MAP = {
  [q_cat_keys.level.l1.search]: [q_cat_keys.level.l2.search, q_cat_keys.level.l3.search],
  [q_cat_keys.level.l2.search]: [q_cat_keys.level.l3.search],
  [q_cat_keys.level.l3.search]: [],
};

const CategorySearchInput = ({ level }: Pick<TCategory, 'level'>) => {
  const { queryParams, setParams } = useQueryParams();

  const queryKey =
    `search_${level}` as (typeof q_cat_keys.level)[keyof typeof q_cat_keys.level]['search'];
  const [searchQuery, setSearchQuery] = useState(queryParams[queryKey] || '');

  const handleSearch = useDebounce({
    callback: (value: string) => {
      const trimmedValue = value.trim();
      const keysToClear = QUERY_CLEAR_MAP[queryKey];

      setParams((prevParams) => {
        const updatedParams = { ...prevParams };

        // current query remove
        delete updatedParams[queryKey];

        // dependent queries remove
        keysToClear.forEach((key) => delete updatedParams[key]);

        // new value set
        if (trimmedValue) updatedParams[queryKey] = trimmedValue;

        return updatedParams;
      });
    },
    delay: 600,
  });

  const handleChange = (value: string) => {
    const trimmedValue = value.trimStart();
    // instant ui update
    setSearchQuery(trimmedValue);
    // debounced search action
    handleSearch(trimmedValue);
  };

  useEffect(() => {
    if (!queryParams[queryKey] && searchQuery) {
      setSearchQuery('');
    }
  }, [queryParams[queryKey]]);

  return (
    <Input
      needRef
      inputProps={{
        name: queryKey,
        placeholder: `Search level ${level} categories here...`,
        value: searchQuery,
        onChange: ({ target: { value } }) => handleChange(value),
      }}
      containerClassName="max-w-sm"
      className="bg-silver/10!"
      icons={{
        right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4 md:size-5' },
      }}
    />
  );
};

const CategoryTableTopInfo = ({
  name,
  badgeText,
  level,
  className,
}: TClassName & Pick<TCategory, 'level' | 'name'> & { badgeText: string }) => {
  return (
    <div className={`space-y-3 p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {name && (
          <div className="text-left">
            <p className="text-primary text-sm font-semibold">{name}</p>
            <p className="text-primary/50 text-xs">Level {level} categories</p>
          </div>
        )}
        <Badge content={badgeText} />
      </div>
      <CategorySearchInput level={level} />
    </div>
  );
};

export default CategoryTableTopInfo;
