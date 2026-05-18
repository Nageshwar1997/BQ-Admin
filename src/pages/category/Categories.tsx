import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import { QUERY_PARAMS_KEY_MAP, SORT_ORDER_MAP } from '@/constants/common.constants';
import useDebounce from '@/hooks/useDebounce';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TChildren, TClassName, TSort } from '@/types/component.type';
import { getFilteredAndSortedCategories } from '@/utils/api.util';
import { Icon } from '@iconify/react';
import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type TableHTMLAttributes,
} from 'react';
import AddCategoryModal from './children/AddCategoryModal';

const TH_TITLES = ['Category', 'Level', 'Parent', 'Actions'] as const;

const queryKeys = QUERY_PARAMS_KEY_MAP;
const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const QUERY_CLEAR_MAP = {
  [q_cat_keys.level.l1]: [q_cat_keys.level.l2, q_cat_keys.level.l3],
  [q_cat_keys.level.l2]: [q_cat_keys.level.l3],
  [q_cat_keys.level.l3]: [],
};

const Badge = ({ content }: { content: string }) => (
  <span className="border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold">
    {content}
  </span>
);

const Th = ({ children, className = '' }: TChildren & TClassName) => (
  <th
    className={`text-primary/55 border-primary/10 w-auto border-y px-4 py-3 text-center text-xs font-semibold tracking-normal whitespace-nowrap uppercase ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, className = '' }: TChildren & TClassName) => (
  <td
    className={`border-primary/5 w-auto border-y px-4 py-3 text-center align-middle text-sm whitespace-nowrap ${className}`}
  >
    {children}
  </td>
);

const THead = () => {
  const { queryParams, removeParams, setParams } = useQueryParams();
  return (
    <thead>
      <tr>
        {TH_TITLES.map((title) => (
          <Th key={title}>
            {title === 'Category' ? (
              <button
                type="button"
                onClick={() => {
                  if (queryParams[queryKeys.sort] === SORT_ORDER_MAP.asc) {
                    setParams({ [queryKeys.sort]: SORT_ORDER_MAP.desc });
                  } else if (queryParams[queryKeys.sort] === SORT_ORDER_MAP.desc) {
                    removeParams([queryKeys.sort]);
                  } else {
                    setParams({ [queryKeys.sort]: SORT_ORDER_MAP.asc });
                  }
                }}
                className="text-primary/65 hover:text-primary flex cursor-pointer items-center gap-2 text-left text-xs font-semibold tracking-normal uppercase transition-colors"
              >
                {title}
                <Icon
                  icon={
                    queryParams[queryKeys.sort] === SORT_ORDER_MAP.asc
                      ? 'solar:arrow-up-linear'
                      : queryParams[queryKeys.sort] === SORT_ORDER_MAP.desc
                        ? 'solar:arrow-down-linear'
                        : 'solar:sort-linear'
                  }
                  className="size-4"
                />
              </button>
            ) : (
              title
            )}
          </Th>
        ))}
      </tr>
    </thead>
  );
};

const CategoryTr = ({
  category,
  onDeleteCategory,
  onEditCategory,
  ...trProps
}: {
  category: ICategory;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
} & TableHTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr tabIndex={0} {...trProps} className={`transition-colors ${trProps?.className || ''}`}>
      <Td className="text-left">
        <CategoryInfo category={category} />
      </Td>
      <Td>
        <Badge content={`Level ${category.level}`} />
      </Td>
      <Td className="text-primary/65 uppercase">{category.parent || 'N/A'}</Td>
      <Td>
        <CategoryActions
          categoryId={category._id}
          onDeleteCategory={onDeleteCategory}
          onEditCategory={onEditCategory}
        />
      </Td>
    </tr>
  );
};

const ApiStatusTr = ({
  isError,
  isLoading,
  hasLength,
  level,
}: Record<'hasLength' | 'isError' | 'isLoading', boolean> & Pick<ICategory, 'level'>) => {
  return (
    <tr>
      <td colSpan={4} className="pt-4">
        <ApiStatus
          className="border-primary/10 bg-smoke-eerie flex rounded-xl border"
          status={isLoading ? 'loading' : isError ? 'error' : 'empty'}
          title={
            isError
              ? 'Failed to load categories'
              : hasLength
                ? 'No matching categories found'
                : 'No categories available'
          }
          description={
            isError
              ? `Something went wrong while fetching level ${level} categories. Please try again.`
              : hasLength
                ? 'Try searching with a different keyword or clear the search.'
                : `No level ${level} categories have been added under this category yet.`
          }
        />
      </td>
    </tr>
  );
};

const SubCategoryTableTr = (props: {
  parentCategory: ICategory;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
  table: Exclude<ICategory['level'], 1>;
}) => {
  const { table, ...rest } = props;

  const Table = table === 2 ? Level2Table : Level3Table;
  return (
    <tr>
      <td colSpan={4} className="border-primary/5 border-y p-4">
        <Table {...rest} />
      </td>
    </tr>
  );
};

const SearchInput = ({ level }: Pick<ICategory, 'level'>) => {
  const { queryParams, setParams } = useQueryParams();

  const queryKey = `l${level}` as keyof typeof q_cat_keys.level;

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
      className={`bg-silver/10! max-w-md`}
      icons={{
        right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4 md:size-5' },
      }}
    />
  );
};

const CategoryInfo = ({ category }: { category: ICategory }) => (
  <div className="flex items-center gap-3">
    <div className="from-sky-blue-burst/20 to-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg bg-linear-to-br">
      <Icon icon="solar:hanger-2-linear" className="size-5" />
    </div>
    <div>
      <p className="text-primary text-sm font-semibold whitespace-nowrap">{category.name}</p>
      <p className="text-primary/45 text-xs whitespace-nowrap">{category.slug}</p>
      {category.description && (
        <p className="text-primary/30 text-xs whitespace-nowrap">{category.description}</p>
      )}
    </div>
  </div>
);

const CategoryActions = ({
  categoryId,
  onDeleteCategory,
  onEditCategory,
}: {
  categoryId: string;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
}) => (
  <div className="flex items-center justify-center gap-2">
    <Button
      content={{ icon: 'solar:pen-linear', className: 'size-4.5' }}
      pattern="outline"
      buttonProps={{ onClick: (event) => (event.stopPropagation(), onEditCategory(categoryId)) }}
      className="border-primary/20 hover:border-blue-crayola-c/50 hover:text-blue-crayola-c size-9! p-0!"
    />
    <Button
      content={{ icon: 'solar:trash-bin-trash-linear', className: 'size-4.5' }}
      pattern="outline"
      buttonProps={{ onClick: (event) => (event.stopPropagation(), onDeleteCategory(categoryId)) }}
      className="border-primary/20 hover:border-red-c/50 hover:text-red-c size-9! p-0!"
    />
  </div>
);

const Level3Table = ({
  parentCategory,
  onDeleteCategory,
  onEditCategory,
}: {
  parentCategory: ICategory;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
}) => {
  const { queryParams } = useQueryParams();
  const deferredSearch = useDeferredValue(queryParams[q_cat_keys.level.l3]);
  const deferredSort = useDeferredValue(queryParams[queryKeys.sort]) as TSort;

  const {
    data: categoriesData = [],
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: 3,
    parentId: parentCategory._id,
  });
  const categories = categoriesData as ICategory[];
  const filteredCategories = useMemo(
    () => getFilteredAndSortedCategories(categories, deferredSearch, deferredSort),
    [categories, deferredSearch, deferredSort],
  );

  return (
    <div className="border-primary/10 bg-primary/3 rounded-lg border p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-primary text-sm font-semibold">{parentCategory.name}</p>
          <p className="text-primary/50 text-xs">Level 3 categories</p>
        </div>
        <span className="border-primary/10 bg-primary/5 text-primary rounded-full border px-3 py-1.5 text-xs font-semibold">
          {filteredCategories.length}/{categories.length} items
        </span>
      </div>
      <SearchInput level={3} />
      <div className="mt-3 overflow-x-auto rounded-lg">
        <table className="w-full table-auto border-separate border-spacing-0">
          <THead />
          <tbody>
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <CategoryTr
                  key={category._id}
                  category={category}
                  onDeleteCategory={onDeleteCategory}
                  onEditCategory={onEditCategory}
                  className="hover:bg-primary/3"
                />
              ))
            ) : (
              <ApiStatusTr
                hasLength={!!categories.length}
                isError={isError}
                isLoading={isLoading}
                level={3}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Level2Table = ({
  parentCategory,
  onDeleteCategory,
  onEditCategory,
}: {
  parentCategory: ICategory;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
}) => {
  const { queryParams } = useQueryParams();
  const deferredSearch = useDeferredValue(queryParams[q_cat_keys.level.l2]);
  const deferredSort = useDeferredValue(queryParams[queryKeys.sort]) as TSort;

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const {
    data: categoriesData = [],
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: 2,
    parentId: parentCategory._id,
  });
  const categories = categoriesData as ICategory[];
  const filteredCategories = useMemo(
    () => getFilteredAndSortedCategories(categories, deferredSearch, deferredSort),
    [categories, deferredSearch, deferredSort],
  );

  useEffect(() => {
    setSelectedCategoryId('');
  }, [parentCategory._id]);

  return (
    <div className="border-primary/10 bg-primary/3 rounded-xl border p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-primary text-base font-semibold">{parentCategory.name}</p>
          <p className="text-primary/50 text-sm">Level 2 sub-categories</p>
        </div>
        <span className="border-primary/10 bg-primary/5 text-primary rounded-full border px-3 py-1.5 text-xs font-semibold">
          {filteredCategories.length}/{categories.length} items
        </span>
      </div>
      <SearchInput level={2} />
      <div className="mt-3 overflow-x-auto rounded-lg">
        <table className="w-full table-auto border-separate border-spacing-0">
          <THead />
          <tbody>
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <Fragment key={category._id}>
                  <CategoryTr
                    category={category}
                    onClick={() =>
                      setSelectedCategoryId((selected) =>
                        selected === category._id ? '' : category._id,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedCategoryId((selected) =>
                          selected === category._id ? '' : category._id,
                        );
                      }
                    }}
                    className={`cursor-pointer ${selectedCategoryId === category._id ? 'bg-primary/5' : 'hover:bg-primary/3'}`}
                    onDeleteCategory={onDeleteCategory}
                    onEditCategory={onEditCategory}
                  />
                  {selectedCategoryId === category._id && (
                    <SubCategoryTableTr
                      table={3}
                      parentCategory={category}
                      onDeleteCategory={onDeleteCategory}
                      onEditCategory={onEditCategory}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <ApiStatusTr
                hasLength={!!categories.length}
                isError={isError}
                isLoading={isLoading}
                level={2}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Level1Table = () => {
  const { queryParams } = useQueryParams();
  const deferredSearch = useDeferredValue(queryParams[q_cat_keys.level.l1]);
  const deferredSort = useDeferredValue(queryParams[queryKeys.sort]) as TSort;
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const {
    data: level1CatsData = [],
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({ level: 1 });
  const level1Cats = level1CatsData as ICategory[];

  const handleEditCategory = (categoryId: string) => {
    console.log('Edit category _id:', categoryId);
  };

  const handleDeleteCategory = (categoryId: string) => {
    console.log('Delete category _id:', categoryId);
  };

  const filteredCategories = useMemo(
    () => getFilteredAndSortedCategories(level1Cats, deferredSearch, deferredSort),
    [level1Cats, deferredSearch, deferredSort],
  );

  return (
    <div className="border-primary/10 bg-secondary-invert rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <SearchInput level={1} />
        <span className="border-primary/10 bg-primary/5 text-primary rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
          {filteredCategories.length}/{level1Cats.length} items
        </span>
      </div>
      <div className="mt-3 overflow-x-auto rounded-lg">
        <table className="w-full table-auto border-separate border-spacing-0">
          <THead />
          <tbody>
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <Fragment key={category._id}>
                  <CategoryTr
                    category={category}
                    onClick={() =>
                      setSelectedCategory((selected) =>
                        selected?._id === category._id ? undefined : category,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedCategory((selected) =>
                          selected?._id === category._id ? undefined : category,
                        );
                      }
                    }}
                    className={`cursor-pointer ${selectedCategory?._id === category._id ? 'bg-primary/5' : 'hover:bg-primary/3'}`}
                    onDeleteCategory={handleDeleteCategory}
                    onEditCategory={handleEditCategory}
                  />
                  {selectedCategory?._id === category._id && (
                    <SubCategoryTableTr
                      table={2}
                      parentCategory={category}
                      onDeleteCategory={handleDeleteCategory}
                      onEditCategory={handleEditCategory}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <ApiStatusTr
                hasLength={!!level1Cats.length}
                isError={isError}
                isLoading={isLoading}
                level={3}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Categories = () => {
  const { queryParams, setParams } = useQueryParams();

  return (
    <Fragment>
      {queryParams[q_cat_keys.add] === 'true' && <AddCategoryModal />}
      <PageWrapper>
        <Navbar
          buttons={[
            {
              content: 'Add Category',
              pattern: 'primary',
              className: 'whitespace-nowrap',
              leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
              buttonProps: { onClick: () => setParams({ category: 'add' }) },
            },
          ]}
        />

        <div>
          <Level1Table />
        </div>
      </PageWrapper>
    </Fragment>
  );
};

export default Categories;
