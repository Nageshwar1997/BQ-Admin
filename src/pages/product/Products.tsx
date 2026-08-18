import { EMPTY_ARRAY, SORT_MAP } from '@beautinique/frontend-constants';
import type { TCategoryLevel, TProductStatus, TSort } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import { createColumnHelper, useTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import HierarchySelect from '@/components/ui/inputs/HierarchySelect';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { ROUTES } from '@/constants/common.constants';
import { APP_TABLE_FEATURES, type TAppTableFeatures, toColumn } from '@/constants/table.constants';
import useDebounce from '@/hooks/useDebounce';
import useIsSmallScreen from '@/hooks/useIsSmallScreen';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetCategoriesHierarchy } from '@/services/product-service/category.service.query';
import { useGetDashboardProducts } from '@/services/product-service/product.service.query';
import type {
  TApiProductPopulated,
  TCategoryHierarchyNode,
  TProductSortBy,
} from '@/types/api.type';
import type { IHierarchySelectOption } from '@/types/input.type';
import { formatDate, formatINRCurrency } from '@/utils/common.util';

const SearchAndSort = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const isSmallScreen = useIsSmallScreen(1024);
  const [searchQuery, setSearchQuery] = useState(queryParams.search ?? '');

  const { data: hierarchy, isLoading, isError } = useGetCategoriesHierarchy();

  const handleSearch = useDebounce({
    callback: (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        setParams({ ...queryParams, search: trimmedValue });
      } else {
        removeParams(['search']);
      }
    },
    delay: 600,
  });

  const categories = useMemo(() => {
    const mapCategoryHierarchy = (
      categories: TCategoryHierarchyNode<TCategoryLevel>[],
    ): IHierarchySelectOption[] => {
      return categories.map((category) => ({
        label: category.name,
        searchLabel: category.name,
        value: category._id,
        children: category.subcategories?.length
          ? mapCategoryHierarchy(category.subcategories)
          : [],
      }));
    };

    return hierarchy ? mapCategoryHierarchy(hierarchy) : [];
  }, [hierarchy]);

  return (
    <div className="base:flex-row flex flex-col items-center justify-between gap-3 md:gap-4">
      <Input
        needRef={!isSmallScreen}
        inputProps={{
          name: 'search',
          placeholder: 'Search products here...',
          value: searchQuery,
          onChange: (e) => {
            const value = (e.target.value || '').trimStart();
            // instant ui update
            setSearchQuery(value);
            // debounced action
            handleSearch(value);
          },
        }}
        containerClassName="max-w-xs! w-full"
        icons={{ right: { icon: 'solar:magnifer-linear', className: 'size-4 text-primary/50' } }}
      />
      <HierarchySelect
        selectProps={{
          value: queryParams.category ?? '',
          placeholder: 'Select Category',
          onChange: (value) => {
            if (value) {
              setParams({ category: String(value) });
            } else {
              removeParams(['category']);
            }
          },
          disabled: isLoading || !hierarchy?.length,
        }}
        icons={{
          ...(queryParams.category && {
            right: {
              icon: 'lucide:x',
              className: 'cursor-pointer size-4',
              onClick: () => {
                removeParams(['category']);
              },
            },
          }),
        }}
        options={categories}
        error={isError ? 'Failed to load categories' : undefined}
        containerClassName="min-w-40 max-w-xs! w-full"
        optionsClassName="base:w-max base:right-0 base:left-auto sm:w-full sm:left-0 sm:right-auto z-50"
      />
    </div>
  );
};

const SortableHeaderLabel = ({
  label,
  sortKey,
  activeSortKey,
  sortOrder,
  onSort,
}: {
  label: string;
  sortKey: TProductSortBy;
  activeSortKey?: string;
  sortOrder?: string;
  onSort: (key: TProductSortBy) => void;
}) => (
  <button
    type="button"
    onClick={() => {
      onSort(sortKey);
    }}
    className="hover:text-primary/90 flex w-full cursor-pointer items-center justify-center gap-1 select-none"
  >
    {label}
    <Icon
      icon={
        activeSortKey === sortKey
          ? sortOrder === SORT_MAP.asc
            ? 'solar:alt-arrow-up-linear'
            : 'solar:alt-arrow-down-linear'
          : 'solar:sort-linear'
      }
      className="size-3.5 shrink-0"
    />
  </button>
);

const columnHelper = createColumnHelper<TAppTableFeatures, TApiProductPopulated>();

const Products = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const { navigate } = usePathParams();
  const { ref, inView } = useInView();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetDashboardProducts({
    search: queryParams.search,
    status: queryParams.status?.toUpperCase() as TProductStatus,
    sortBy: (queryParams.sortBy ?? 'updatedAt') as TProductSortBy,
    sortOrder: (queryParams.sortOrder ?? SORT_MAP.desc) as TSort,
    category: queryParams.category,
  });

  const handleSort = (sortBy: TProductSortBy) => {
    const currentSortBy = queryParams.sortBy;
    const currentSortOrder = queryParams.sortOrder ?? SORT_MAP.desc;

    const nextOrder =
      currentSortBy === sortBy
        ? currentSortOrder === SORT_MAP.asc
          ? SORT_MAP.desc
          : SORT_MAP.asc
        : SORT_MAP.desc;

    setParams({ sortBy, sortOrder: nextOrder });
  };

  // Sorting stays server-driven (via the `sortBy`/`sortOrder` query params, same
  // as before) — tanstack/react-table here is only responsible for the
  // column/header/row model, not for sorting the data itself.
  const columns = useMemo(
    () => [
      toColumn(
        columnHelper.display({
          id: 'serial',
          header: () => 'S. No',
          cell: (info) => info.row.index + 1,
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'view',
          header: () => 'View',
          cell: (info) => (
            <Link className="mx-auto block size-4.5 shrink-0" to={info.row.original.slug}>
              <Icon
                icon="material-symbols:eye-tracking-outline"
                className="text-primary hover:text-blue-crayola-c mx-auto size-full"
              />
            </Link>
          ),
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'thumbnail',
          header: () => 'Thumbnail',
          cell: (info) => (
            <img
              src={info.row.original.thumbnail}
              alt={info.row.original.title}
              loading="lazy"
              className="border-tertiary/20 mx-auto aspect-square size-10 rounded-lg border object-cover"
            />
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('title', {
          header: () => (
            <SortableHeaderLabel
              label="Title"
              sortKey="title"
              activeSortKey={queryParams.sortBy}
              sortOrder={queryParams.sortOrder}
              onSort={handleSort}
            />
          ),
          cell: (info) => <p className="max-w-sm truncate text-left">{info.getValue()}</p>,
        }),
      ),
      toColumn(
        columnHelper.accessor('brand', { header: () => 'Brand', cell: (info) => info.getValue() }),
      ),
      toColumn(
        columnHelper.accessor('sellingPrice', {
          header: () => (
            <SortableHeaderLabel
              label="SP"
              sortKey="sellingPrice"
              activeSortKey={queryParams.sortBy}
              sortOrder={queryParams.sortOrder}
              onSort={handleSort}
            />
          ),
          cell: (info) => (
            <span className="text-primary-green font-medium">
              {formatINRCurrency(info.getValue())}
            </span>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('originalPrice', {
          header: () => (
            <SortableHeaderLabel
              label="MRP"
              sortKey="originalPrice"
              activeSortKey={queryParams.sortBy}
              sortOrder={queryParams.sortOrder}
              onSort={handleSort}
            />
          ),
          cell: (info) => (
            <span className="text-primary-red font-medium">
              {formatINRCurrency(info.getValue())}
            </span>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('status', {
          header: () => 'Status',
          cell: (info) => info.getValue(),
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'stock',
          header: () => 'Stock',
          cell: (info) => {
            const product = info.row.original;
            return !product.hasVariants
              ? product.stock
              : product.variants.reduce((acc, variant) => acc + variant.stock, 0);
          },
        }),
      ),
      toColumn(
        columnHelper.accessor('createdAt', {
          header: () => (
            <SortableHeaderLabel
              label="Created At"
              sortKey="createdAt"
              activeSortKey={queryParams.sortBy}
              sortOrder={queryParams.sortOrder}
              onSort={handleSort}
            />
          ),
          cell: (info) => formatDate(info.getValue(), { month: '2-digit' }),
        }),
      ),
      toColumn(
        columnHelper.accessor('updatedAt', {
          header: () => (
            <SortableHeaderLabel
              label="Updated At"
              sortKey="updatedAt"
              activeSortKey={queryParams.sortBy}
              sortOrder={queryParams.sortOrder}
              onSort={handleSort}
            />
          ),
          cell: (info) => formatDate(info.getValue(), { month: '2-digit' }),
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'tryOn',
          header: () => 'Try-On',
          cell: (info) => {
            const product = info.row.original;
            return product.tryOn.configured && product.tryOn.enabled
              ? `${product.tryOn.category} - ${product.tryOn.subCategory}`
              : 'N/A';
          },
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'variants',
          header: () => 'Variants',
          cell: (info) => {
            const product = info.row.original;
            return product.hasVariants ? product.variants.length : 'N/A';
          },
        }),
      ),
      toColumn(
        columnHelper.accessor('sku', { header: () => 'Sku', cell: (info) => info.getValue() }),
      ),
      toColumn(
        columnHelper.accessor('slug', { header: () => 'Slug', cell: (info) => info.getValue() }),
      ),
      toColumn(
        columnHelper.accessor('soldCount', {
          header: () => (
            <SortableHeaderLabel
              label="Sold"
              sortKey="soldCount"
              activeSortKey={queryParams.sortBy}
              sortOrder={queryParams.sortOrder}
              onSort={handleSort}
            />
          ),
          cell: (info) => info.getValue(),
        }),
      ),
      toColumn(
        columnHelper.accessor('returnCount', {
          header: () => 'Returned',
          cell: (info) => info.getValue(),
        }),
      ),
      toColumn(
        columnHelper.accessor('averageRating', {
          header: () => 'Avg. Rating',
          cell: (info) => info.getValue(),
        }),
      ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleSort closes over queryParams/setParams, re-created each render anyway
    [queryParams.sortBy, queryParams.sortOrder],
  );

  const table = useTable({
    features: APP_TABLE_FEATURES,
    data: data?.products ?? EMPTY_ARRAY,
    columns,
    getRowId: (row) => row._id,
  });

  const rows = table.getRowModel().rows;

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <PageWrapper
      navbar={{
        buttons: [
          {
            content: 'Add Product',
            pattern: 'primary',
            className: 'whitespace-nowrap',
            leftIcon: { icon: 'solar:add-circle-linear' },
            buttonProps: { onClick: () => navigate(ROUTES.PRODUCTS.ADD) },
          },
        ],
        ...(data?.counts && {
          components: [
            <Select
              key="status-count-select"
              options={Object.entries(data.counts).map(([key, value]) => ({
                value: key.toLowerCase(),
                label: `${key} (${String(value)})`.toLowerCase(),
              }))}
              selectProps={{
                value: queryParams.status ?? 'all',
                onChange: (value) => {
                  if (!value || value === 'all') {
                    removeParams(['status', 'search']);
                  } else if (value) {
                    if (value === 'draft') {
                      removeParams(['search']);
                    }
                    setParams({ status: value.toString() });
                  }
                },
              }}
              containerClassName="max-w-32! w-full"
            />,
          ],
        }),
        children: <SearchAndSort />,
      }}
    >
      <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
        {!!rows.length && (
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table className="relative text-xs">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHeadCell key={header.id}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    tabIndex={0}
                    className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                    ref={row.index === rows.length - 4 ? ref : undefined}
                  >
                    {row.getAllCells().map((cell) => (
                      <TableRowCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableRowCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        )}

        {(isLoading ||
          isFetchingNextPage ||
          isError ||
          // typescript-eslint's no-unnecessary-condition misreads isFetchNextPageError as always
          // falsy for this react-query hook shape, even though tsc confirms it's a real boolean.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          isFetchNextPageError ||
          rows.length === 0) && (
          <div
            className={`flex items-center justify-center ${!isFetchingNextPage ? 'min-h-[40dvh]' : ''}`}
          >
            {isLoading || isFetchingNextPage ? (
              <LoadingText
                text={isLoading ? 'Loading products...' : 'Loading more products...'}
                className="my-2"
              />
            ) : (
              <ApiStatus
                className="min-h-0!"
                status={
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                  isError || isFetchNextPageError ? 'error' : 'empty'
                }
                title={
                  isError
                    ? 'Failed to load products'
                    : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                      isFetchNextPageError
                      ? 'Failed to load more products'
                      : 'No products available'
                }
                description={
                  isError
                    ? 'Something went wrong while fetching products. Please try again.'
                    : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                      isFetchNextPageError
                      ? 'Something went wrong while fetching more products. Please try again.'
                      : 'No products have been added yet.'
                }
              />
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Products;
