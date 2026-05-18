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
import Badge from '@/components/ui/Badge';
import { QUERY_PARAMS_KEY_MAP, SORT_ORDER_MAP } from '@/constants/common.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import type { ICategory } from '@/types/api.type';
import type { TCategoryTable, TSort, TSubCategoryTable } from '@/types/component.type';
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
import CategoryActions from './children/CategoryActions';
import CategoryInfo from './children/CategoryInfo';
import CategoryTableTopInfo from './children/CategoryTableTopInfo';

const TH_TITLES = ['Category', 'Level', 'Parent', 'Actions'] as const;

const queryKeys = QUERY_PARAMS_KEY_MAP;
const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const ApiStatusRow = (
  props: Record<'haveLength' | 'isError' | 'isLoading', boolean> & Pick<ICategory, 'level'>,
) => {
  const { isError, isLoading, haveLength, level } = props;

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

const CategoryRow = (props: TCategoryTable & ComponentProps<'tr'>) => {
  const { category, onDelete, onEdit, className = '', ...trProps } = props;

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
        <CategoryActions catId={category._id} onDelete={onDelete} onEdit={onEdit} />
      </TableRowCell>
    </TableRow>
  );
};

const L3Table = ({ parentCategory, onDelete, onEdit }: TSubCategoryTable) => {
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
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${filteredCategories.length}/${categories.length} items`}
        level={3}
        name={parentCategory.name}
      />
      <Table>
        <CategoryHead />
        <TableBody>
          {filteredCategories.length ? (
            filteredCategories.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
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
              level={3}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const L2Table = ({ parentCategory, onDelete, onEdit }: TSubCategoryTable) => {
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
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${filteredCategories.length}/${categories.length} items`}
        level={2}
        name={parentCategory.name}
      />
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
                  className={`cursor-pointer ${selectedCategoryId === category._id ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
                {selectedCategoryId === category._id && (
                  <TableRow>
                    <TableRowCell colSpan={4} className="border-b-0 p-0! pt-3!">
                      <L3Table onDelete={onDelete} onEdit={onEdit} parentCategory={category} />
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
              level={2}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const L1Table = () => {
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

  const handleEditCategory = (catId: string) => {
    console.log('Edit category _id:', catId);
  };

  const handleDeleteCategory = (catId: string) => {
    console.log('Delete category _id:', catId);
  };

  const filteredCategories = useMemo(
    () => getFilteredAndSortedCategories(level1Cats, deferredSearch, deferredSort),
    [level1Cats, deferredSearch, deferredSort],
  );

  return (
    <div className="border-primary/10 bg-secondary-invert rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${filteredCategories.length}/${level1Cats.length} items`}
        level={1}
        className="flex w-full flex-row-reverse items-center justify-between gap-3 space-y-0!"
      />
      <div className="overflow-x-auto">
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
                    className={`cursor-pointer ${selectedCategory?._id === category._id ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                    onDelete={handleDeleteCategory}
                    onEdit={handleEditCategory}
                  />
                  {selectedCategory?._id === category._id && (
                    <TableRow>
                      <TableRowCell colSpan={4} className="border-b-0 p-0! pt-3!">
                        <L2Table
                          onDelete={handleDeleteCategory}
                          onEdit={handleEditCategory}
                          parentCategory={category}
                        />
                      </TableRowCell>
                    </TableRow>
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
          <L1Table />
        </div>
      </PageWrapper>
    </Fragment>
  );
};

export default Categories;
