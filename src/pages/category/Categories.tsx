import PageWrapper from '@/components/layout/containers/PageWrapper';
import Navbar from '@/components/layout/navbar';
import Input from '@/components/ui/inputs/Input';
import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import { debounce } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

type TSortDirection = '' | 'asc' | 'desc';

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

const SearchInput = ({
  needRef,
  onChange,
  placeholder,
  value,
}: {
  needRef?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) => (
  <Input
    needRef={needRef}
    inputProps={{
      name: placeholder,
      placeholder,
      value: value.trimStart(),
      onChange: (event) => onChange(event.target.value),
    }}
    icons={{
      right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4 md:size-5' },
    }}
  />
);

const Search = () => {
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
    <div className="flex items-center justify-between gap-3 md:gap-4">
      <SearchInput
        needRef
        placeholder="Search categories here..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
    </div>
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
  <div className="flex min-w-52 items-center gap-3">
    <div className="from-sky-blue-burst/20 to-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg bg-linear-to-br">
      <Icon icon="solar:hanger-2-linear" className="size-5" />
    </div>
    <div className="min-w-0">
      <p className="text-primary truncate text-sm font-semibold">{category.name}</p>
      <p className="text-primary/45 truncate text-xs">{category.slug}</p>
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
  <div className="flex items-center gap-2">
    <button
      type="button"
      aria-label="Edit category"
      onClick={(event) => {
        event.stopPropagation();
        onEditCategory(categoryId);
      }}
      className="border-primary/10 bg-smoke-eerie text-primary hover:border-primary/30 grid size-9 cursor-pointer place-items-center rounded-lg border transition-colors"
    >
      <Icon icon="solar:pen-linear" className="size-4.5" />
    </button>
    <button
      type="button"
      aria-label="Delete category"
      onClick={(event) => {
        event.stopPropagation();
        onDeleteCategory(categoryId);
      }}
      className="border-primary/10 bg-smoke-eerie text-primary grid size-9 cursor-pointer place-items-center rounded-lg border transition-colors hover:border-red-400/50 hover:text-red-500"
    >
      <Icon icon="solar:trash-bin-trash-linear" className="size-4.5" />
    </button>
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
        <td className="border-primary/5 border-b px-4 py-4 first:pl-5 last:pr-5" colSpan={4}>
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
        <table className="w-full min-w-170 border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-primary/10 border-b px-4 py-3 text-left first:pl-5">
                <SortableHeader sort={sort} onSort={() => setSort(getNextSort(sort))}>
                  Category
                </SortableHeader>
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase">
                Level
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase">
                Parent
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase last:pr-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <LoadingRows rows={3} />
            ) : filteredCategories.length ? (
              filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-primary/3 transition-colors">
                  <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm first:pl-5">
                    <CategoryInfo category={category} />
                  </td>
                  <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm">
                    <span className="border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold">
                      Level {category.level}
                    </span>
                  </td>
                  <td className="text-primary/65 border-primary/5 border-b px-4 py-4 align-middle text-sm">
                    {category.parent || parentCategory.name}
                  </td>
                  <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm last:pr-5">
                    <CategoryActions
                      categoryId={category._id}
                      onDeleteCategory={onDeleteCategory}
                      onEditCategory={onEditCategory}
                    />
                  </td>
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
        <table className="w-full min-w-190 border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-primary/10 border-b px-4 py-3 text-left first:pl-5">
                <SortableHeader sort={sort} onSort={() => setSort(getNextSort(sort))}>
                  Category
                </SortableHeader>
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase">
                Level
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase">
                Parent
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase last:pr-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <LoadingRows rows={3} />
            ) : filteredCategories.length ? (
              filteredCategories.map((category) => (
                <>
                  <tr
                    key={category._id}
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
                    <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm first:pl-5">
                      <CategoryInfo category={category} />
                    </td>
                    <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm">
                      <span className="border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold">
                        Level {category.level}
                      </span>
                    </td>
                    <td className="text-primary/65 border-primary/5 border-b px-4 py-4 align-middle text-sm">
                      {category.parent || parentCategory.name}
                    </td>
                    <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm last:pr-5">
                      <CategoryActions
                        categoryId={category._id}
                        onDeleteCategory={onDeleteCategory}
                        onEditCategory={onEditCategory}
                      />
                    </td>
                  </tr>
                  {selectedCategoryId === category._id && (
                    <tr key={`${category._id}-children`}>
                      <td colSpan={4} className="border-primary/5 border-b p-4">
                        <Level3Table
                          parentCategory={category}
                          onDeleteCategory={onDeleteCategory}
                          onEditCategory={onEditCategory}
                        />
                      </td>
                    </tr>
                  )}
                </>
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
    <div className="border-primary/10 bg-smoke-eerie overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-230 border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-primary/10 border-b px-4 py-3 text-left first:pl-5">
                <SortableHeader sort={sort} onSort={onSort}>
                  Category
                </SortableHeader>
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase">
                Level
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase">
                Parent
              </th>
              <th className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase last:pr-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingRows />
            ) : (
              data.map((category) => (
                <>
                  <tr
                    key={category._id}
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
                    <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm first:pl-5">
                      <CategoryInfo category={category} />
                    </td>
                    <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm">
                      <span className="border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold">
                        Level {category.level}
                      </span>
                    </td>
                    <td className="text-primary/65 border-primary/5 border-b px-4 py-4 align-middle text-sm">
                      {category.parent || 'Main category'}
                    </td>
                    <td className="border-primary/5 border-b px-4 py-4 align-middle text-sm last:pr-5">
                      <CategoryActions
                        categoryId={category._id}
                        onDeleteCategory={onDeleteCategory}
                        onEditCategory={onEditCategory}
                      />
                    </td>
                  </tr>
                  {selectedCategoryId === category._id && (
                    <tr key={`${category._id}-children`}>
                      <td colSpan={4} className="border-primary/5 border-b p-4">
                        <Level2Table
                          parentCategory={category}
                          onDeleteCategory={onDeleteCategory}
                          onEditCategory={onEditCategory}
                        />
                      </td>
                    </tr>
                  )}
                </>
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
  const { navigate } = usePathParams();
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
    <PageWrapper>
      <Navbar
        buttons={[
          {
            content: 'Add Category',
            pattern: 'primary',
            className: 'whitespace-nowrap',
            leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
            buttonProps: { onClick: () => navigate(ROUTES.CATEGORIES.ADD) },
          },
        ]}
        className="[&>:nth-last-child(2)]:border-b-silver/30 [&>:nth-last-child(2)]:border-b [&>div]:py-2"
      >
        <Search />
      </Navbar>

      <div>
        <CategoryTable
          data={filteredCategories}
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
  );
};

export default Categories;
