import { CATEGORY_LEVELS_MAP, SORT_MAP } from '@beautinique/frontend-constants';
import { Icon } from '@iconify/react';
import type { ExpandedState, HeaderContext, SortingState, Updater } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import { Fragment, useDeferredValue, useEffect, useMemo, useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import ConfirmModal from '@/components/layout/modals/ConfirmModal';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Badge from '@/components/ui/Badge';
import { EMPTY_ARRAY, QUERY_PARAMS_KEY_MAP } from '@/constants/common.constants';
import {
  CATEGORY_TABLE_FEATURES,
  createCategoryColumnHelper,
  type TCategoryTableFeatures,
  toColumn,
} from '@/constants/table.constants';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useDeleteCategory,
  useGetCategoriesByParentLevel,
} from '@/services/product-service/category.service.query';
import type { TCategory } from '@/types/api.type';
import type { ICatModal, TCatTable } from '@/types/component.type';
import { getFilteredCats } from '@/utils/api.util';

import CategoryActions from './children/CategoryActions';
import CategoryInfo from './children/CategoryInfo';
import CategoryModal from './children/CategoryModal';
import CategoryTableTopInfo from './children/CategoryTableTopInfo';

const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const columnHelper = createCategoryColumnHelper<TCategory>();

// Toggling one row's expanded state should collapse whichever other row was
// open (accordion behavior) - tanstack's own `expanded` state is a map that
// supports many rows open at once, so this diffs old vs. new to find the row
// that was just switched on and keeps only that one.
const toSingleExpanded = (prev: ExpandedState, updater: Updater<ExpandedState>): ExpandedState => {
  const prevMap = prev === true ? {} : prev;
  const nextRaw = typeof updater === 'function' ? updater(prev) : updater;
  const nextMap = nextRaw === true ? {} : nextRaw;
  const toggledOnId = Object.keys(nextMap).find((id) => nextMap[id] && !prevMap[id]);
  return toggledOnId ? { [toggledOnId]: true } : {};
};

const ApiStatusRow = (
  props: Record<'haveLength' | 'isError' | 'isLoading', boolean> & Pick<TCategory, 'level'>,
) => {
  const { isError, isLoading, haveLength, level } = props;

  return (
    <TableRow className="border-y-primary/5 border-y first:border-t-0 last:border-b-0">
      <TableRowCell colSpan={4}>
        {isLoading ? (
          <LoadingText text="Loading..." className="mx-auto my-2" />
        ) : (
          <ApiStatus
            className="min-h-0!"
            status={isError ? 'error' : 'empty'}
            title={
              isError
                ? 'Failed to load categories'
                : haveLength
                  ? 'No matching categories found'
                  : 'No categories available'
            }
            description={
              isError
                ? `Something went wrong while fetching level ${String(level)} categories. Please try again.`
                : haveLength
                  ? 'Try searching with a different keyword or clear the search.'
                  : `No level ${String(level)} categories have been added under this category yet.`
            }
          />
        )}
      </TableRowCell>
    </TableRow>
  );
};

// Renders a header cell driven entirely by tanstack/react-table's own
// row-sorting feature - `column.getToggleSortingHandler()` for the click
// handler and `column.getIsSorted()` for the current direction.
const renderSortableHeader = (label: string) => {
  function SortableHeader<TValue>({
    column,
  }: HeaderContext<TCategoryTableFeatures, TCategory, TValue>) {
    const sorted = column.getIsSorted();
    return (
      <button
        type="button"
        onClick={column.getToggleSortingHandler()}
        className="hover:text-primary/80 group flex cursor-pointer items-center gap-2"
      >
        {label}
        <Icon
          icon={
            sorted === 'asc'
              ? 'solar:arrow-up-linear'
              : sorted === 'desc'
                ? 'solar:arrow-down-linear'
                : 'solar:sort-linear'
          }
          className="group-hover:text-primary/80 size-4"
        />
      </button>
    );
  }

  return SortableHeader;
};

/**
 * Column defs shared by the L1/L2/L3 category tables - each level renders its
 * own <Table> (see L1Table/L2Table/L3Table below) since expanding a row
 * inlines a nested table for the next level, rather than nesting rows within
 * one table. Sorting/searching are per-level, keyed by `sort_<level>`/
 * `search_<level>` query params: search is applied to the raw `categories`
 * array before it reaches the table (`getFilteredCats`), sorting is real
 * tanstack/react-table state - `CATEGORY_TABLE_FEATURES` registers a
 * `sortedRowModel`, so tanstack actually reorders the rows client-side.
 */
const useCategoryColumns = ({
  level,
  mainCatId,
  onDelete,
  onEdit,
}: {
  level: TCategory['level'];
  mainCatId?: string;
  onDelete: (categoryId: string) => void;
  onEdit: (data: ICatModal) => void;
}) => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const sortKey =
    `sort_${String(level)}` as (typeof q_cat_keys.level)[keyof typeof q_cat_keys.level]['sort'];
  const sortValue = queryParams[sortKey];

  const sorting: SortingState = sortValue
    ? [{ id: 'category', desc: sortValue === SORT_MAP.desc }]
    : [];

  const onSortingChange = (updater: Updater<SortingState>) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    const first = next[0];
    if (!first) {
      removeParams([sortKey]);
      return;
    }
    setParams({ [sortKey]: first.desc ? SORT_MAP.desc : SORT_MAP.asc });
  };

  const columns = useMemo(
    () => [
      toColumn(
        columnHelper.accessor('name', {
          id: 'category',
          header: renderSortableHeader('Category'),
          enableSorting: true,
          sortFn: (rowA, rowB) => rowA.original.name.localeCompare(rowB.original.name),
          cell: (info) => <CategoryInfo category={info.row.original} />,
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'level',
          header: () => 'Level',
          cell: (info) => <Badge content={`Level ${String(info.row.original.level)}`} />,
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'parent',
          header: () => 'Parent',
          cell: (info) => {
            const category = info.row.original;
            return (
              <span className="text-primary/65 uppercase">
                {'parent' in category ? category.parent : 'N/A'}
              </span>
            );
          },
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'actions',
          header: () => 'Actions',
          cell: (info) => (
            <CategoryActions
              category={info.row.original}
              mainCatId={mainCatId}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ),
        }),
      ),
    ],
    [mainCatId, onDelete, onEdit],
  );

  return { columns, sorting, onSortingChange };
};

const L3Table = ({ category: parentCat, mainCatId, onDelete, onEdit }: TCatTable) => {
  const { queryParams } = useQueryParams();
  const search = useDeferredValue(queryParams[q_cat_keys.level.l3.search] ?? '');

  const {
    data: categories = EMPTY_ARRAY,
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: parentCat._id,
  });
  const filteredCats = useMemo(() => getFilteredCats(categories, search), [categories, search]);

  const { columns, sorting, onSortingChange } = useCategoryColumns({
    level: CATEGORY_LEVELS_MAP.L3,
    mainCatId,
    onDelete,
    onEdit,
  });
  const table = useTable({
    features: CATEGORY_TABLE_FEATURES,
    data: filteredCats,
    columns,
    getRowId: (row) => row._id,
    state: { sorting },
    onSortingChange,
    enableMultiSort: false,
  });
  const rows = table.getRowModel().rows;

  return (
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${String(filteredCats.length)}/${String(categories.length)} items`}
        level={CATEGORY_LEVELS_MAP.L3}
        name={parentCat.name}
      />
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeadCell className="first:text-left last:text-right" key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHeadCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                tabIndex={0}
                className="border-y-primary/5 hover:bg-primary/1 border-y first:border-t-0 last:border-b-0"
              >
                {row.getAllCells().map((cell) => (
                  <TableRowCell className="first:text-left last:text-right" key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableRowCell>
                ))}
              </TableRow>
            ))
          ) : (
            <ApiStatusRow
              haveLength={!!categories.length}
              isError={isError}
              isLoading={isLoading}
              level={CATEGORY_LEVELS_MAP.L3}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const L2Table = ({ category: parentCat, onDelete, onEdit }: TCatTable) => {
  const { queryParams } = useQueryParams();
  const search = useDeferredValue(queryParams[q_cat_keys.level.l2.search] ?? '');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [prevParentCatId, setPrevParentCatId] = useState(parentCat._id);

  if (parentCat._id !== prevParentCatId) {
    setPrevParentCatId(parentCat._id);
    setExpanded({});
  }

  const {
    data: categories = EMPTY_ARRAY,
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: parentCat._id,
  });
  const filteredCats = useMemo(() => getFilteredCats(categories, search), [categories, search]);

  const { columns, sorting, onSortingChange } = useCategoryColumns({
    level: CATEGORY_LEVELS_MAP.L2,
    onDelete,
    onEdit,
  });
  const table = useTable({
    features: CATEGORY_TABLE_FEATURES,
    data: filteredCats,
    columns,
    getRowId: (row) => row._id,
    state: { sorting, expanded },
    onSortingChange,
    enableMultiSort: false,
    getRowCanExpand: () => true,
    onExpandedChange: (updater) => {
      setExpanded((prev) => toSingleExpanded(prev, updater));
    },
  });
  const rows = table.getRowModel().rows;

  return (
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${String(filteredCats.length)}/${String(categories.length)} items`}
        level={CATEGORY_LEVELS_MAP.L2}
        name={parentCat.name}
      />
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeadCell className="first:text-left last:text-right" key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHeadCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  tabIndex={0}
                  onClick={row.getToggleExpandedHandler()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      row.toggleExpanded();
                    }
                  }}
                  className={`border-y-primary/5 cursor-pointer border-y first:border-t-0 last:border-b-0 ${row.getIsExpanded() ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                >
                  {row.getAllCells().map((cell) => (
                    <TableRowCell className="first:text-left last:text-right" key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableRowCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableRowCell colSpan={4} className="border-b-0 px-0!">
                      <L3Table
                        onDelete={onDelete}
                        onEdit={onEdit}
                        category={row.original}
                        mainCatId={parentCat._id}
                      />
                    </TableRowCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <ApiStatusRow
              haveLength={!!categories.length}
              isError={isError}
              isLoading={isLoading}
              level={CATEGORY_LEVELS_MAP.L2}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const L1Table = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const search = useDeferredValue(queryParams[q_cat_keys.level.l1.search] ?? '');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [editData, setEditData] = useState<ICatModal | null>(null);
  const [deleteId, setDeleteId] = useState('');
  const {
    data: categories = EMPTY_ARRAY,
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({ level: CATEGORY_LEVELS_MAP.L1 });

  const deleteCategory = useDeleteCategory({ categoryId: deleteId });

  const handleEdit = (data: ICatModal) => {
    setEditData(data);

    setParams({ [q_cat_keys.mode]: q_cat_keys.edit });
  };

  const handleDelete = async () => {
    await deleteCategory.mutateAsync(deleteId, {
      onSettled: () => {
        setDeleteId('');

        setExpanded((prev) => {
          const map = prev === true ? {} : prev;
          if (!map[deleteId]) return prev;
          const { [deleteId]: _removed, ...rest } = map;
          return rest;
        });
      },
    });
  };

  const handleOnClose = () => {
    setEditData(null);
    removeParams([q_cat_keys.mode]);
  };

  const filteredCats = useMemo(() => getFilteredCats(categories, search), [categories, search]);

  const { columns, sorting, onSortingChange } = useCategoryColumns({
    level: CATEGORY_LEVELS_MAP.L1,
    onDelete: (categoryId) => {
      setDeleteId(categoryId);
    },
    onEdit: handleEdit,
  });
  const table = useTable({
    features: CATEGORY_TABLE_FEATURES,
    data: filteredCats,
    columns,
    getRowId: (row) => row._id,
    state: { sorting, expanded },
    onSortingChange,
    enableMultiSort: false,
    getRowCanExpand: () => true,
    onExpandedChange: (updater) => {
      setExpanded((prev) => toSingleExpanded(prev, updater));
    },
  });
  const rows = table.getRowModel().rows;

  /**
   * Intentionally runs once on mount only, to clear a stray leftover `?mode=` param left over from
   * a previous session/reload - re-running this on every query-param change would close the
   * add/edit modal the moment the user opens it.
   */
  useEffect(() => {
    removeParams([q_cat_keys.mode]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border-primary/10 bg-secondary-invert rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${String(filteredCats.length)}/${String(categories.length)} items`}
        level={CATEGORY_LEVELS_MAP.L1}
        name=""
        className="flex w-full flex-row-reverse items-center justify-between gap-3 space-y-0!"
      />
      <ScrollableGradientContainer
        direction="horizontal"
        gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
      >
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeadCell className="first:text-left last:text-right" key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHeadCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    tabIndex={0}
                    onClick={row.getToggleExpandedHandler()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        row.toggleExpanded();
                      }
                    }}
                    className={`border-y-primary/5 cursor-pointer border-y first:border-t-0 last:border-b-0 ${row.getIsExpanded() ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                  >
                    {row.getAllCells().map((cell) => (
                      <TableRowCell className="first:text-left last:text-right" key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableRowCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableRowCell colSpan={4} className="border-b-0 px-0!">
                        <L2Table
                          onDelete={(categoryId) => {
                            setDeleteId(categoryId);
                          }}
                          onEdit={handleEdit}
                          category={row.original}
                        />
                      </TableRowCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <ApiStatusRow
                haveLength={!!categories.length}
                isError={isError}
                isLoading={isLoading}
                level={CATEGORY_LEVELS_MAP.L3}
              />
            )}
          </TableBody>
        </Table>
      </ScrollableGradientContainer>
      {!!editData && queryParams[q_cat_keys.mode] === q_cat_keys.edit && (
        <CategoryModal {...editData} onClose={handleOnClose} />
      )}
      {!!deleteId && (
        <ConfirmModal
          modalProps={{
            isOpen: !!deleteId,
            onClose: () => {
              setDeleteId('');
            },
          }}
          type="warning"
          title="Are you sure?"
          description="Are you sure you want to delete this category? This action cannot be undone."
          buttons={{
            left: {
              content: 'Cancel',
              buttonProps: {
                onClick: () => {
                  setDeleteId('');
                },
              },
            },
            right: { content: 'Delete', buttonProps: { onClick: handleDelete } },
          }}
        />
      )}
    </div>
  );
};

const Categories = () => {
  const { queryParams, setParams, clearParams } = useQueryParams();

  const params = useMemo(() => {
    return [
      queryParams[q_cat_keys.level.l1.search],
      queryParams[q_cat_keys.level.l1.sort],
      queryParams[q_cat_keys.level.l2.search],
      queryParams[q_cat_keys.level.l2.sort],
      queryParams[q_cat_keys.level.l3.search],
      queryParams[q_cat_keys.level.l3.sort],
    ].filter(Boolean);
  }, [queryParams]);

  return (
    <Fragment>
      {queryParams[q_cat_keys.mode] === q_cat_keys.add && <CategoryModal />}
      <PageWrapper
        navbar={{
          buttons: [
            {
              content: 'Clear',
              pattern: 'secondary',
              leftIcon: { icon: 'solar:eraser-linear', className: '*:stroke-[2.5]' },
              buttonProps: { onClick: clearParams },
              className: !params.length ? 'hidden' : '',
            },
            {
              content: 'Add',
              pattern: 'primary',
              leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
              buttonProps: {
                onClick: () => {
                  setParams({ [q_cat_keys.mode]: q_cat_keys.add });
                },
              },
            },
          ],
        }}
      >
        <L1Table />
      </PageWrapper>
    </Fragment>
  );
};

export default Categories;
