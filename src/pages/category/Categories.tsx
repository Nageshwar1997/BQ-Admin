import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import Navbar from '@/components/layout/navbar';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import { QUERY_PARAMS_KEY_MAP, SORT_ORDER_MAP } from '@/constants/common.constants';
import useDebounce from '@/hooks/useDebounce';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TClassName, TSort } from '@/types/component.type';
import { getFilteredAndSortedCategories } from '@/utils/api.util';
import { Icon } from '@iconify/react';
import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
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

type TActions = {
  onEditCategory: (catId: string) => void;
  onDeleteCategory: (catId: string) => void;
};

type TCategoryTable = TActions & {
  category: ICategory;
};

type TSubCategoryTable = TActions & {
  parentCategory: ICategory;
};

const CategoryHead = () => {
  const { queryParams, removeParams, setParams } = useQueryParams();
  return (
    <TableHead>
      <TableRow>
        {TH_TITLES.map((title) => (
          <TableHeadCell key={title}>
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
          </TableHeadCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const Badge = ({ content = '', className = '' }) => (
  <span
    className={`border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
  >
    {content}
  </span>
);

const CategoryRow = ({
  category,
  onDeleteCategory,
  onEditCategory,
  className = '',
  ...trProps
}: TCategoryTable & ComponentProps<'tr'>) => {
  return (
    <TableRow tabIndex={0} {...trProps} className={`transition-colors duration-100 ${className}`}>
      <TableRowCell className="text-left">
        <CategoryInfo category={category} />
      </TableRowCell>
      <TableRowCell>
        <Badge content={`Level ${category.level}`} />
      </TableRowCell>
      <TableRowCell className="text-primary/65 uppercase">{category.parent || 'N/A'}</TableRowCell>
      <TableRowCell>
        <CategoryActions
          categoryId={category._id}
          onDeleteCategory={onDeleteCategory}
          onEditCategory={onEditCategory}
        />
      </TableRowCell>
    </TableRow>
  );
};

const ApiStatusRow = ({
  isError,
  isLoading,
  haveLength,
  level,
}: Record<'haveLength' | 'isError' | 'isLoading', boolean> & Pick<ICategory, 'level'>) => {
  return (
    <TableRow>
      <TableRowCell colSpan={4} className="p-0! pt-4!">
        <ApiStatus
          className="border-primary/10 bg-smoke-eerie flex rounded-xl border"
          status={isLoading ? 'loading' : isError ? 'error' : 'empty'}
          title={
            isError
              ? 'Failed to load categories'
              : haveLength
                ? 'No matching categories found'
                : 'No categories available'
          }
          description={
            isError
              ? `Something went wrong while fetching level ${level} categories. Please try again.`
              : haveLength
                ? 'Try searching with a different keyword or clear the search.'
                : `No level ${level} categories have been added under this category yet.`
          }
        />
      </TableRowCell>
    </TableRow>
  );
};

const SubCategoryTableTr = (
  props: TSubCategoryTable & { level: Exclude<ICategory['level'], 1> },
) => {
  const { level, ...rest } = props;

  const Component = level === 2 ? Level2Table : Level3Table;
  return (
    <TableRow>
      <TableRowCell colSpan={4} className="border-b-0 pt-4 pb-0">
        <Component {...rest} />
      </TableRowCell>
    </TableRow>
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
      containerClassName="max-w-sm"
      className="bg-silver/10!"
      icons={{
        right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4 md:size-5' },
      }}
    />
  );
};

const CategoryInfo = ({ category }: Pick<TCategoryTable, 'category'>) => (
  <div className="flex items-center gap-3">
    <div
      className={`to-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg bg-linear-to-br ${
        category.level === 1
          ? 'from-rose-c/25 via-rose-c/10'
          : category.level === 2
            ? 'from-jade-c/25 via-jade-c/10'
            : 'from-blue-crayola-c/25 via-blue-crayola-c/10'
      }`}
    >
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

const TopDetails = ({
  name,
  badgeText,
  level,
  className,
}: TClassName & {
  name?: string;
  badgeText: string;
  level: ICategory['level'];
}) => {
  return (
    <div className={`space-y-3 pb-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {name && (
          <div className="text-left">
            <p className="text-primary text-sm font-semibold">{name}</p>
            <p className="text-primary/50 text-xs">Level {level} categories</p>
          </div>
        )}
        <Badge content={badgeText} />
      </div>
      <SearchInput level={level} />
    </div>
  );
};

const CategoryActions = ({
  categoryId,
  onDeleteCategory,
  onEditCategory,
}: TActions & { categoryId: string }) => (
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

const Level3Table = ({ parentCategory, onDeleteCategory, onEditCategory }: TSubCategoryTable) => {
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
      <TopDetails
        badgeText={`${filteredCategories.length}/${categories.length} items`}
        level={3}
        name={parentCategory.name}
      />
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <CategoryHead />
          <TableBody>
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  onDeleteCategory={onDeleteCategory}
                  onEditCategory={onEditCategory}
                  className="hover:bg-primary/3"
                />
              ))
            ) : (
              <ApiStatusRow
                haveLength={!!categories.length}
                isError={isError}
                isLoading={isLoading}
                level={3}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const Level2Table = ({ parentCategory, onDeleteCategory, onEditCategory }: TSubCategoryTable) => {
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
      <TopDetails
        badgeText={`${filteredCategories.length}/${categories.length} items`}
        level={2}
        name={parentCategory.name}
      />
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <CategoryHead />
          <TableBody>
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <Fragment key={category._id}>
                  <CategoryRow
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
                      level={3}
                      parentCategory={category}
                      onDeleteCategory={onDeleteCategory}
                      onEditCategory={onEditCategory}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <ApiStatusRow
                haveLength={!!categories.length}
                isError={isError}
                isLoading={isLoading}
                level={2}
              />
            )}
          </TableBody>
        </Table>
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
      <TopDetails
        badgeText={`${filteredCategories.length}/${level1Cats.length} items`}
        level={1}
        className="flex w-full flex-row-reverse items-center justify-between space-y-0"
      />
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <CategoryHead />
          <TableBody>
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <Fragment key={category._id}>
                  <CategoryRow
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
                      level={2}
                      parentCategory={category}
                      onDeleteCategory={handleDeleteCategory}
                      onEditCategory={handleEditCategory}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <ApiStatusRow
                haveLength={!!level1Cats.length}
                isError={isError}
                isLoading={isLoading}
                level={3}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const Categories = () => {
  const { queryParams, setParams } = useQueryParams();

  return (
    <Fragment>
      {queryParams[q_cat_keys.add] === 'true' && <AddCategoryModal />}
      <PageWrapper className="[&>div:nth-of-type(2)]:m-4">
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

        <Level1Table />
      </PageWrapper>
    </Fragment>
  );
};

export default Categories;
