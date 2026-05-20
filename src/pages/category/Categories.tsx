import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import ConfirmModal from '@/components/layout/modals/ConfirmModal';
import Navbar from '@/components/layout/navbar';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Badge from '@/components/ui/Badge';
import {
  CATEGORY_LEVELS_MAP,
  QUERY_PARAMS_KEY_MAP,
  SORT_ORDER_MAP,
} from '@/constants/common.constants';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useDeleteCategory,
  useGetCategoriesByParentLevel,
} from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TCatModal, TCatTable, TSort } from '@/types/component.type';
import { getFilteredAndSortedCats } from '@/utils/api.util';
import { Icon } from '@iconify/react';
import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from 'react';
import CategoryActions from './children/CategoryActions';
import CategoryInfo from './children/CategoryInfo';
import CategoryModal from './children/CategoryModal';
import CategoryTableTopInfo from './children/CategoryTableTopInfo';

const TH_TITLES = ['Category', 'Level', 'Parent', 'Actions'] as const;

const queryKeys = QUERY_PARAMS_KEY_MAP;
const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const ApiStatusRow = (
  props: Record<'haveLength' | 'isError' | 'isLoading', boolean> & Pick<ICategory, 'level'>,
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
                ? `Something went wrong while fetching level ${level} categories. Please try again.`
                : haveLength
                  ? 'Try searching with a different keyword or clear the search.'
                  : `No level ${level} categories have been added under this category yet.`
            }
          />
        )}
      </TableRowCell>
    </TableRow>
  );
};

const CategoryHead = () => {
  const { queryParams, removeParams, setParams } = useQueryParams();
  return (
    <TableHead>
      <TableRow>
        {TH_TITLES.map((title) => (
          <TableHeadCell className="first:text-left last:text-right" key={title}>
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
                className="hover:text-primary/80 group flex cursor-pointer items-center gap-2"
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
                  className="group-hover:text-primary/80 size-4"
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

const CategoryRow = (props: TCatTable & ComponentProps<'tr'>) => {
  const { category, mainCatId, onDelete, onEdit, className = '', ...trProps } = props;

  return (
    <TableRow
      tabIndex={0}
      {...trProps}
      className={`border-y-primary/5 border-y first:border-t-0 last:border-b-0 ${className}`}
    >
      <TableRowCell className="text-left">
        <CategoryInfo category={category} />
      </TableRowCell>
      <TableRowCell>
        <Badge content={`Level ${category.level}`} />
      </TableRowCell>
      <TableRowCell className="text-primary/65 uppercase">{category.parent || 'N/A'}</TableRowCell>
      <TableRowCell className="text-right">
        <CategoryActions
          category={category}
          mainCatId={mainCatId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </TableRowCell>
    </TableRow>
  );
};

const L3Table = ({ category: parentCat, mainCatId, onDelete, onEdit }: TCatTable) => {
  const { queryParams } = useQueryParams();
  const search = useDeferredValue(queryParams[q_cat_keys.level.l3]);
  const sort = useDeferredValue(queryParams[queryKeys.sort]) as TSort;

  const {
    data = [],
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: parentCat._id,
  });
  const categories = data as ICategory[];
  const filteredCats = useMemo(
    () => getFilteredAndSortedCats(categories, search, sort),
    [categories, search, sort],
  );

  return (
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${filteredCats.length}/${categories.length} items`}
        level={CATEGORY_LEVELS_MAP.L3}
        name={parentCat.name}
      />
      <Table>
        <CategoryHead />
        <TableBody>
          {filteredCats.length ? (
            filteredCats.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                mainCatId={mainCatId}
                onDelete={onDelete}
                onEdit={onEdit}
                className="hover:bg-primary/1"
              />
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
  const search = useDeferredValue(queryParams[q_cat_keys.level.l2]);
  const sort = useDeferredValue(queryParams[queryKeys.sort]) as TSort;
  const [selectedId, setSelectedId] = useState('');
  const {
    data = [],
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: parentCat._id,
  });
  const categories = data as ICategory[];
  const filteredCats = useMemo(
    () => getFilteredAndSortedCats(categories, search, sort),
    [categories, search, sort],
  );

  useEffect(() => {
    setSelectedId('');
  }, [parentCat._id]);

  return (
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${filteredCats.length}/${categories.length} items`}
        level={CATEGORY_LEVELS_MAP.L2}
        name={parentCat.name}
      />
      <Table>
        <CategoryHead />
        <TableBody>
          {filteredCats.length ? (
            filteredCats.map((category) => (
              <Fragment key={category._id}>
                <CategoryRow
                  category={category}
                  onClick={() =>
                    setSelectedId((prevId) => (prevId === category._id ? '' : category._id))
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedId((prevId) => (prevId === category._id ? '' : category._id));
                    }
                  }}
                  className={`cursor-pointer ${selectedId === category._id ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
                {selectedId === category._id && (
                  <TableRow>
                    <TableRowCell colSpan={4} className="border-b-0 p-0! pt-3!">
                      <L3Table
                        onDelete={onDelete}
                        onEdit={onEdit}
                        category={category}
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
  const search = useDeferredValue(queryParams[q_cat_keys.level.l1]);
  const sort = useDeferredValue(queryParams[queryKeys.sort]) as TSort;
  const [selectedId, setSelectedId] = useState('');
  const [editData, setEditData] = useState<TCatModal | null>(null);
  const [deleteId, setDeleteId] = useState('');
  const {
    data = [],
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({ level: CATEGORY_LEVELS_MAP.L1 });

  const { mutateAsync: deleteCategoryAsync } = useDeleteCategory();
  const categories = data as ICategory[];

  const handleEdit = (data: TCatModal) => {
    setEditData(data);

    setParams({ [q_cat_keys.mode]: q_cat_keys.edit });
  };

  const handleDelete = async () => {
    await deleteCategoryAsync(deleteId, { onSuccess: () => setDeleteId('') });
  };

  const handleOnClose = () => {
    setEditData(null);
    removeParams([q_cat_keys.mode]);
  };

  const filteredCats = useMemo(
    () => getFilteredAndSortedCats(categories, search, sort),
    [categories, search, sort],
  );

  useEffect(() => {
    removeParams([q_cat_keys.mode]);
  }, []);

  return (
    <div className="border-primary/10 bg-secondary-invert rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${filteredCats.length}/${categories.length} items`}
        level={CATEGORY_LEVELS_MAP.L1}
        name=""
        className="flex w-full flex-row-reverse items-center justify-between gap-3 space-y-0!"
      />
      <ScrollableGradientContainer
        direction="horizontal"
        gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
      >
        <Table>
          <CategoryHead />
          <TableBody>
            {filteredCats.length ? (
              filteredCats.map((category) => (
                <Fragment key={category._id}>
                  <CategoryRow
                    category={category}
                    onClick={() =>
                      setSelectedId((prevId) => (prevId === category._id ? '' : category._id))
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedId((prevId) => (prevId === category._id ? '' : category._id));
                      }
                    }}
                    className={`cursor-pointer ${selectedId === category._id ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                    onDelete={(categoryId) => setDeleteId(categoryId)}
                    onEdit={handleEdit}
                  />
                  {selectedId === category._id && (
                    <TableRow>
                      <TableRowCell colSpan={4} className="border-b-0 p-0! pt-3!">
                        <L2Table
                          onDelete={(categoryId) => setDeleteId(categoryId)}
                          onEdit={handleEdit}
                          category={category}
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
          modalProps={{ isOpen: !!deleteId, onClose: () => setDeleteId('') }}
          type="warning"
          title="Are you sure?"
          description="Are you sure you want to delete this category? This action cannot be undone."
          buttons={{
            left: { content: 'Cancel', buttonProps: { onClick: () => setDeleteId('') } },
            right: { content: 'Delete', buttonProps: { onClick: handleDelete } },
          }}
        />
      )}
      s{' '}
    </div>
  );
};

const Categories = () => {
  const { queryParams, setParams } = useQueryParams();

  return (
    <Fragment>
      {queryParams[q_cat_keys.mode] === q_cat_keys.add && <CategoryModal />}
      <PageWrapper>
        <Navbar
          buttons={[
            {
              content: 'Add Category',
              pattern: 'primary',
              className: 'whitespace-nowrap',
              leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
              buttonProps: { onClick: () => setParams({ [q_cat_keys.mode]: q_cat_keys.add }) },
            },
          ]}
        />

        <div>
          <L1Table />
        </div>
      </PageWrapper>
    </Fragment>
  );
};

export default Categories;
