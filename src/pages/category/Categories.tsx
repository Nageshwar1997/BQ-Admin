import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import { debounce } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const getCategoryId = (category: ICategory) => category._id;

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

const SearchAndSort = () => {
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
      <Input
        needRef
        inputProps={{
          name: 'search',
          placeholder: 'Search categories here...',
          value: searchQuery.trimStart(),
          onChange: (e) => setSearchQuery(e.target.value),
        }}
        icons={{
          right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4 md:size-5' },
        }}
      />
      <Button
        pattern="outline"
        content={{
          icon: queryParams.sort === 'asc' ? 'solar:list-arrow-up-linear' : 'solar:list-arrow-down-linear',
          className: 'size-full',
          onClick: () => {
            if (queryParams.sort === 'asc') {
              setParams({ sort: 'desc' });
            } else if (queryParams.sort === 'desc') {
              removeParams(['sort']);
            } else {
              setParams({ sort: 'asc' });
            }
          },
        }}
        className="border-primary/10 bg-smoke-eerie size-10 max-w-fit p-2! lg:size-12"
      />
    </div>
  );
};

const LocalSearchAndSort = ({
  search,
  setSearch,
  setSort,
  sort,
  placeholder,
}: {
  search: string;
  setSearch: (search: string) => void;
  setSort: (sort: TSortDirection) => void;
  sort: TSortDirection;
  placeholder: string;
}) => (
  <div className="flex w-full items-center gap-3 sm:max-w-md">
    <Input
      inputProps={{
        name: placeholder,
        placeholder,
        value: search.trimStart(),
        onChange: (e) => setSearch(e.target.value),
      }}
      icons={{
        right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4' },
      }}
    />
    <Button
      pattern="outline"
      content={{
        icon: sort === 'asc' ? 'solar:list-arrow-up-linear' : 'solar:list-arrow-down-linear',
        className: 'size-full',
      }}
      buttonProps={{
        onClick: () => {
          if (sort === 'asc') {
            setSort('desc');
          } else if (sort === 'desc') {
            setSort('');
          } else {
            setSort('asc');
          }
        },
      }}
      className="border-primary/10 bg-smoke-eerie size-10 max-w-fit p-2! lg:size-12"
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

const CategoryTable = ({
  data,
  isLoading,
  onDeleteCategory,
  onEditCategory,
  onViewSubCategories,
  selectedCategoryId,
}: {
  data: ICategory[];
  isLoading: boolean;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
  onViewSubCategories: (category: ICategory) => void;
  selectedCategoryId?: string;
}) => {
  const columns = useMemo<ColumnDef<ICategory>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Category',
        cell: ({ row }) => (
          <div className="flex min-w-52 items-center gap-3">
            <div className="from-sky-blue-burst/20 to-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg bg-linear-to-br">
              <Icon icon="solar:hanger-2-linear" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-primary truncate text-sm font-semibold">{row.original.name}</p>
              <p className="text-primary/45 truncate text-xs">{row.original.slug}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'level',
        header: 'Level',
        cell: ({ row }) => (
          <span className="border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold">
            Level {row.original.level}
          </span>
        ),
      },
      {
        accessorKey: 'parent',
        header: 'Parent',
        cell: ({ row }) => (
          <span className="text-primary/65 text-sm">{row.original.parent || 'Main category'}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Edit category"
              onClick={(event) => {
                event.stopPropagation();
                onEditCategory(row.original._id);
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
                onDeleteCategory(row.original._id);
              }}
              className="border-primary/10 bg-smoke-eerie text-primary hover:border-red-400/50 hover:text-red-500 grid size-9 cursor-pointer place-items-center rounded-lg border transition-colors"
            >
              <Icon icon="solar:trash-bin-trash-linear" className="size-4.5" />
            </button>
          </div>
        ),
      },
    ],
    [onDeleteCategory, onEditCategory],
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (isLoading) {
    return (
      <div className="border-primary/10 bg-smoke-eerie overflow-hidden rounded-xl border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-primary/5 flex animate-pulse items-center gap-4 border-b p-4 last:border-b-0"
          >
            <div className="bg-primary/10 size-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="bg-primary/10 h-3 w-1/3 rounded" />
              <div className="bg-primary/5 h-3 w-1/5 rounded" />
            </div>
            <div className="bg-primary/10 h-8 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!data.length) {
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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-primary/55 border-primary/10 border-b px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase first:pl-5 last:pr-5"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                tabIndex={0}
                onClick={() => onViewSubCategories(row.original)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onViewSubCategories(row.original);
                  }
                }}
                className={`cursor-pointer transition-colors ${
                  selectedCategoryId === getCategoryId(row.original) ? 'bg-primary/5' : 'hover:bg-primary/3'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-primary/5 border-b px-4 py-4 align-middle text-sm first:pl-5 last:pr-5"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CategoryActions = ({
  categoryId,
  onDeleteCategory,
  onEditCategory,
}: {
  categoryId: string;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
}) => (
  <div className="ml-auto flex shrink-0 items-center gap-2">
    <button
      type="button"
      aria-label="Edit category"
      onClick={(event) => {
        event.stopPropagation();
        onEditCategory(categoryId);
      }}
      className="border-primary/10 bg-smoke-eerie text-primary hover:border-primary/30 grid size-8 cursor-pointer place-items-center rounded-lg border transition-colors"
    >
      <Icon icon="solar:pen-linear" className="size-4" />
    </button>
    <button
      type="button"
      aria-label="Delete category"
      onClick={(event) => {
        event.stopPropagation();
        onDeleteCategory(categoryId);
      }}
      className="border-primary/10 bg-smoke-eerie text-primary hover:border-red-400/50 hover:text-red-500 grid size-8 cursor-pointer place-items-center rounded-lg border transition-colors"
    >
      <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
    </button>
  </div>
);

const SubCategoriesPanel = ({
  category,
  onDeleteCategory,
  onEditCategory,
}: {
  category?: ICategory;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<ICategory>();
  const [subCategorySearch, setSubCategorySearch] = useState('');
  const [subCategorySort, setSubCategorySort] = useState<TSortDirection>('');
  const [childCategorySearch, setChildCategorySearch] = useState('');
  const [childCategorySort, setChildCategorySort] = useState<TSortDirection>('');
  const nextLevel = category?.level ? ((category.level + 1) as ICategory['level']) : undefined;
  const { data: subCategoriesData = [], isFetching } = useGetCategoriesByParentLevel({
    level: nextLevel,
    parentId: category?._id,
    enabled: !!category && category.level < 3,
  });
  const subCategories = subCategoriesData as ICategory[];
  const { data: childCategoriesData = [], isFetching: isFetchingChildren } =
    useGetCategoriesByParentLevel({
      level: selectedSubCategory?.level
        ? ((selectedSubCategory.level + 1) as ICategory['level'])
        : undefined,
      parentId: selectedSubCategory?._id,
      enabled: !!selectedSubCategory && selectedSubCategory.level < 3,
    });
  const childCategories = childCategoriesData as ICategory[];
  const filteredSubCategories = useMemo(
    () => getFilteredAndSortedCategories(subCategories, subCategorySearch, subCategorySort),
    [subCategories, subCategorySearch, subCategorySort],
  );
  const filteredChildCategories = useMemo(
    () => getFilteredAndSortedCategories(childCategories, childCategorySearch, childCategorySort),
    [childCategories, childCategorySearch, childCategorySort],
  );

  useEffect(() => {
    setSelectedSubCategory(undefined);
    setSubCategorySearch('');
    setSubCategorySort('');
  }, [category?._id]);

  useEffect(() => {
    setChildCategorySearch('');
    setChildCategorySort('');
  }, [selectedSubCategory?._id]);

  if (!category) return null;

  return (
    <section className="border-primary/10 bg-smoke-eerie flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-primary text-base font-semibold">{category.name}</p>
          <p className="text-primary/50 text-sm">
            {category.level === 1 ? 'Sub-categories' : 'Product categories'}
          </p>
        </div>
        <span className="border-primary/10 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
          <Icon icon="solar:folder-with-files-linear" className="size-4" />
          {filteredSubCategories.length}/{subCategories.length} items
        </span>
      </div>

      <LocalSearchAndSort
        search={subCategorySearch}
        setSearch={setSubCategorySearch}
        sort={subCategorySort}
        setSort={setSubCategorySort}
        placeholder="Search level 2 categories..."
      />

      {isFetching ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-primary/5 h-18 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredSubCategories.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSubCategories.map((item) => (
            <div
              key={item._id}
              role={item.level < 3 ? 'button' : undefined}
              tabIndex={item.level < 3 ? 0 : undefined}
              onClick={() => {
                if (item.level < 3) setSelectedSubCategory(item);
              }}
              onKeyDown={(event) => {
                if (item.level < 3 && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  setSelectedSubCategory(item);
                }
              }}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                selectedSubCategory?._id === item._id
                  ? 'border-primary bg-primary/7'
                  : 'border-primary/10 bg-primary/3 hover:border-primary/30'
              } ${item.level < 3 ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
            >
              <div className="bg-primary/8 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                <Icon icon="solar:tag-linear" className="size-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-primary truncate text-sm font-semibold">{item.name}</p>
                <p className="text-primary/45 truncate text-xs">{item.slug}</p>
              </div>
              <CategoryActions
                categoryId={item._id}
                onDeleteCategory={onDeleteCategory}
                onEditCategory={onEditCategory}
              />
              {item.level < 3 && (
                <Icon icon="solar:alt-arrow-right-linear" className="text-primary/45 size-4" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="solar:folder-error-linear"
          title={subCategories.length ? 'No matching sub-categories' : 'No sub-categories yet'}
          description={
            subCategories.length
              ? 'Try a different search term or reset the sort.'
              : 'This category does not have any child categories at the next level.'
          }
        />
      )}

      {selectedSubCategory && (
        <div className="border-primary/10 border-t pt-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-primary text-sm font-semibold">{selectedSubCategory.name}</p>
              <p className="text-primary/50 text-sm">Level 3 sub-categories</p>
            </div>
            <span className="border-primary/10 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
              <Icon icon="solar:folder-with-files-linear" className="size-4" />
              {filteredChildCategories.length}/{childCategories.length} items
            </span>
          </div>

          <div className="mb-4">
            <LocalSearchAndSort
              search={childCategorySearch}
              setSearch={setChildCategorySearch}
              sort={childCategorySort}
              setSort={setChildCategorySort}
              placeholder="Search level 3 categories..."
            />
          </div>

          {isFetchingChildren ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-primary/5 h-18 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredChildCategories.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredChildCategories.map((item) => (
                <div
                  key={item._id}
                  className="border-primary/10 bg-primary/3 flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="bg-primary/8 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                    <Icon icon="solar:tag-linear" className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-primary truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-primary/45 truncate text-xs">{item.slug}</p>
                  </div>
                  <CategoryActions
                    categoryId={item._id}
                    onDeleteCategory={onDeleteCategory}
                    onEditCategory={onEditCategory}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="solar:folder-error-linear"
              title={
                childCategories.length ? 'No matching level 3 sub-categories' : 'No level 3 sub-categories yet'
              }
              description={
                childCategories.length
                  ? 'Try a different search term or reset the sort.'
                  : 'This level 2 sub-category does not have any child categories.'
              }
            />
          )}
        </div>
      )}
    </section>
  );
};

const Categories = () => {
  const { queryParams } = useQueryParams();
  const { navigate } = usePathParams();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const { data: level1CatsData = [], isLoading } = useGetCategoriesByParentLevel({ level: 1 });
  const level1Cats = level1CatsData as ICategory[];

  const handleEditCategory = (categoryId: string) => {
    console.log('Edit category _id:', categoryId);
  };

  const handleDeleteCategory = (categoryId: string) => {
    console.log('Delete category _id:', categoryId);
  };

  const filteredCategories = useMemo(() => {
    const sort = queryParams.sort === 'asc' || queryParams.sort === 'desc' ? queryParams.sort : '';
    return getFilteredAndSortedCategories(level1Cats, queryParams.search || '', sort);
  }, [level1Cats, queryParams.search, queryParams.sort]);

  return (
    <div className="flex flex-col gap-5">
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
        <SearchAndSort />
      </Navbar>

      <CategoryTable
        data={filteredCategories}
        isLoading={isLoading}
        onDeleteCategory={handleDeleteCategory}
        onEditCategory={handleEditCategory}
        selectedCategoryId={selectedCategory?._id}
        onViewSubCategories={setSelectedCategory}
      />
      <SubCategoriesPanel
        category={selectedCategory}
        onDeleteCategory={handleDeleteCategory}
        onEditCategory={handleEditCategory}
      />
    </div>
  );
};

export default Categories;
