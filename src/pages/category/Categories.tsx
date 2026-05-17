import PageWrapper from '@/components/layout/containers/PageWrapper';
import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TChildren, TClassName } from '@/types/component.type';
import { debounce } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import AddCategoryModal from './children/AddCategoryModal';

type TSortDirection = '' | 'asc' | 'desc';

const TH_TITLES = ['Category', 'Level', 'Parent', 'Actions'] as const;

const getFilteredAndSortedCategories = (
  categories: ICategory[],
  search: string,
  sort: TSortDirection,
) => {
  const searchValue = search.toLowerCase().trim();
  const filteredCategories = searchValue
    ? categories.filter((category) =>
        [category.name, category.slug, category.parent || '']
          .join(' ')
          .toLowerCase()
          .includes(searchValue),
      )
    : categories;

  if (!sort) return filteredCategories;

  return [...filteredCategories].sort((a, b) => {
    const direction = sort === 'desc' ? -1 : 1;
    return a.name.localeCompare(b.name) * direction;
  });
};

const getNextSort = (sort: TSortDirection): TSortDirection => {
  if (sort === 'asc') return 'desc';
  if (sort === 'desc') return '';
  return 'asc';
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

const THead = ({
  sort,
  setSort,
}: {
  sort: TSortDirection;
  setSort: (sort: TSortDirection) => void;
}) => (
  <thead>
    <tr>
      {TH_TITLES.map((title) => (
        <Th key={title}>
          {title === 'Category' ? (
            <SortableHeader sort={sort} onSort={() => setSort(getNextSort(sort))}>
              {title}
            </SortableHeader>
          ) : (
            title
          )}
        </Th>
      ))}
    </tr>
  </thead>
);

const SearchInput = ({
  needRef,
  onChange,
  placeholder,
  value,
  className = '',
}: {
  needRef?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
} & TClassName) => (
  <Input
    needRef={needRef}
    inputProps={{
      name: placeholder,
      placeholder,
      value: value.trimStart(),
      onChange: (event) => onChange(event.target.value),
    }}
    className={`bg-silver/10! ${className}`}
    icons={{
      right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4 md:size-5' },
    }}
  />
);

const Search = ({ className = '' }: TClassName) => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const [searchQuery, setSearchQuery] = useState(queryParams?.search || '');

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim()) {
          setParams({ search: value.trim() });
        } else {
          removeParams(['search']);
        }
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
  }, [searchQuery, debouncedSetQuery]);

  return (
    <SearchInput
      needRef
      placeholder="Search categories here..."
      value={searchQuery}
      onChange={setSearchQuery}
      className={className}
    />
  );
};

const SortableHeader = ({
  children,
  onSort,
  sort,
}: {
  children: string;
  onSort: () => void;
  sort: TSortDirection;
}) => (
  <button
    type="button"
    onClick={onSort}
    className="text-primary/65 hover:text-primary flex cursor-pointer items-center gap-2 text-left text-xs font-semibold tracking-normal uppercase transition-colors"
  >
    {children}
    <Icon
      icon={
        sort === 'asc'
          ? 'solar:arrow-up-linear'
          : sort === 'desc'
            ? 'solar:arrow-down-linear'
            : 'solar:sort-linear'
      }
      className="size-4"
    />
  </button>
);

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

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="border-primary/10 bg-smoke-eerie flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center">
    <div className="bg-primary/5 text-primary grid size-12 place-items-center rounded-full">
      <Icon icon={icon} className="size-6" />
    </div>
    <div className="space-y-1">
      <p className="text-primary text-base font-semibold">{title}</p>
      <p className="text-primary/55 max-w-md text-sm">{description}</p>
    </div>
  </div>
);

const LoadingRows = ({ rows = 5 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <tr key={index}>
        <td className="border-primary/5 border-y px-4 py-4 first:pl-5 last:pr-5" colSpan={4}>
          <div className="flex animate-pulse items-center gap-4">
            <div className="bg-primary/10 size-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="bg-primary/10 h-3 w-1/3 rounded" />
              <div className="bg-primary/5 h-3 w-1/5 rounded" />
            </div>
            <div className="bg-primary/10 h-8 w-28 rounded-lg" />
          </div>
        </td>
      </tr>
    ))}
  </>
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
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TSortDirection>('');
  const { data: categoriesData = [], isFetching } = useGetCategoriesByParentLevel({
    level: 3,
    parentId: parentCategory._id,
  });
  const categories = categoriesData as ICategory[];
  const filteredCategories = useMemo(
    () => getFilteredAndSortedCategories(categories, search, sort),
    [categories, search, sort],
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
      <div className="mb-3 max-w-md">
        <SearchInput
          placeholder="Search level 3 categories..."
          value={search}
          onChange={setSearch}
        />
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full table-auto border-separate border-spacing-0">
          <THead sort={sort} setSort={setSort} />
          <tbody>
            {isFetching ? (
              <tr className="hover:bg-primary/3 transition-colors">
                <td className="border-primary/5 border-y px-4 py-4 align-middle text-sm whitespace-nowrap first:pl-5">
                  {/* <CategoryInfo category={category} /> */}
                </td>
                <td className="border-primary/5 border-y px-4 py-4 align-middle text-sm whitespace-nowrap">
                  <span className="border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold">
                    {/* Level {category.level} */}
                  </span>
                </td>
                <td className="text-primary/65 border-primary/5 border-y px-4 py-4 align-middle text-sm whitespace-nowrap uppercase">
                  {/* {category.parent || parentCategory.name} */}
                </td>
                <td className="border-primary/5 w-0 border-y px-4 py-4 align-middle text-sm whitespace-nowrap last:pr-5">
                  {/* <CategoryActions
                    categoryId={category._id}
                    onDeleteCategory={onDeleteCategory}
                    onEditCategory={onEditCategory}
                  /> */}
                </td>
              </tr>
            ) : filteredCategories.length ? (
              filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-primary/3 transition-colors">
                  <Td className="text-left">
                    <CategoryInfo category={category} />
                  </Td>
                  <Td>
                    <Badge content={`Level ${category.level}`} />
                  </Td>
                  <Td className={`text-primary/65 ${category.parent ? 'uppercase' : ''}`}>
                    {category.parent || parentCategory.name}
                  </Td>
                  <Td>
                    <CategoryActions
                      categoryId={category._id}
                      onDeleteCategory={onDeleteCategory}
                      onEditCategory={onEditCategory}
                    />
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4">
                  <EmptyState
                    icon="solar:folder-error-linear"
                    title={
                      categories.length
                        ? 'No matching level 3 categories'
                        : 'No level 3 categories yet'
                    }
                    description={
                      categories.length
                        ? 'Try a different search term.'
                        : 'This level 2 category does not have child categories.'
                    }
                  />
                </td>
              </tr>
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
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TSortDirection>('');
  const { data: categoriesData = [], isFetching } = useGetCategoriesByParentLevel({
    level: 2,
    parentId: parentCategory._id,
  });
  const categories = categoriesData as ICategory[];
  const filteredCategories = useMemo(
    () => getFilteredAndSortedCategories(categories, search, sort),
    [categories, search, sort],
  );

  useEffect(() => {
    setSelectedCategoryId('');
    setSearch('');
    setSort('');
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
      <div className="mb-3 max-w-md">
        <SearchInput
          placeholder="Search level 2 categories..."
          value={search}
          onChange={setSearch}
        />
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full table-auto border-separate border-spacing-0">
          <THead sort={sort} setSort={setSort} />
          <tbody>
            {isFetching ? (
              <LoadingRows rows={3} />
            ) : filteredCategories.length ? (
              filteredCategories.map((category) => (
                <Fragment key={category._id}>
                  <tr
                    tabIndex={0}
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
                    className={`cursor-pointer transition-colors ${
                      selectedCategoryId === category._id ? 'bg-primary/5' : 'hover:bg-primary/3'
                    }`}
                  >
                    <Td className="text-left">
                      <CategoryInfo category={category} />
                    </Td>
                    <Td>
                      <Badge content={`Level ${category.level}`} />
                    </Td>
                    <Td className={`text-primary/65 ${!category.parent ? 'uppercase' : ''}`}>
                      {category.parent || parentCategory.name}
                    </Td>
                    <Td>
                      <CategoryActions
                        categoryId={category._id}
                        onDeleteCategory={onDeleteCategory}
                        onEditCategory={onEditCategory}
                      />
                    </Td>
                  </tr>
                  {selectedCategoryId === category._id && (
                    <tr>
                      <td colSpan={4} className="border-primary/5 border-y p-4">
                        <Level3Table
                          parentCategory={category}
                          onDeleteCategory={onDeleteCategory}
                          onEditCategory={onEditCategory}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4">
                  <EmptyState
                    icon="solar:folder-error-linear"
                    title={
                      categories.length ? 'No matching sub-categories' : 'No sub-categories yet'
                    }
                    description={
                      categories.length
                        ? 'Try a different search term.'
                        : 'This level 1 category does not have child categories.'
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CategoryTable = ({
  data,
  totalItems,
  isLoading,
  onDeleteCategory,
  onEditCategory,
  onSort,
  onViewSubCategories,
  selectedCategoryId,
  sort,
}: {
  data: ICategory[];
  isLoading: boolean;
  totalItems: number;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
  onSort: () => void;
  onViewSubCategories: (category: ICategory) => void;
  selectedCategoryId?: string;
  sort: TSortDirection;
}) => {
  if (!isLoading && !data.length) {
    return (
      <EmptyState
        icon="solar:folder-open-linear"
        title="No categories found"
        description="Try a different search term or add your first category from the button above."
      />
    );
  }

  return (
    <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
      <div className="flex items-center gap-4 p-4">
        <Search className="max-w-md" />
        <span className="border-primary/10 bg-primary/5 text-primary rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
          {data.length}/{totalItems} items
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-separate border-spacing-0">
          <THead sort={sort} setSort={onSort} />
          <tbody>
            {isLoading ? (
              <LoadingRows />
            ) : (
              data.map((category) => (
                <Fragment key={category._id}>
                  <tr
                    tabIndex={0}
                    onClick={() => onViewSubCategories(category)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onViewSubCategories(category);
                      }
                    }}
                    className={`cursor-pointer transition-colors ${
                      selectedCategoryId === category._id ? 'bg-primary/5' : 'hover:bg-primary/3'
                    }`}
                  >
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
                  {selectedCategoryId === category._id && (
                    <tr>
                      <td colSpan={4} className="border-primary/5 border-y p-4">
                        <Level2Table
                          parentCategory={category}
                          onDeleteCategory={onDeleteCategory}
                          onEditCategory={onEditCategory}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Categories = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const { data: level1CatsData = [], isLoading } = useGetCategoriesByParentLevel({ level: 1 });
  const level1Cats = level1CatsData as ICategory[];
  const level1Sort =
    queryParams.sort === 'asc' || queryParams.sort === 'desc' ? queryParams.sort : '';

  const handleEditCategory = (categoryId: string) => {
    console.log('Edit category _id:', categoryId);
  };

  const handleDeleteCategory = (categoryId: string) => {
    console.log('Delete category _id:', categoryId);
  };

  const handleLevel1Sort = () => {
    const nextSort = getNextSort(level1Sort);
    if (nextSort) {
      setParams({ sort: nextSort });
    } else {
      removeParams(['sort']);
    }
  };

  const filteredCategories = useMemo(
    () => getFilteredAndSortedCategories(level1Cats, queryParams.search || '', level1Sort),
    [level1Cats, queryParams.search, level1Sort],
  );

  return (
    <>
      {queryParams.category === 'add' && <AddCategoryModal />}
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
          <CategoryTable
            data={filteredCategories}
            totalItems={level1Cats.length}
            isLoading={isLoading}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
            onSort={handleLevel1Sort}
            selectedCategoryId={selectedCategory?._id}
            sort={level1Sort}
            onViewSubCategories={(category) =>
              setSelectedCategory((selected) =>
                selected?._id === category._id ? undefined : category,
              )
            }
          />
        </div>
      </PageWrapper>
    </>
  );
};

export default Categories;
