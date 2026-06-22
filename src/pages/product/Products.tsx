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
import Button from '@/components/ui/Button';
import HierarchySelect from '@/components/ui/inputs/HierarchySelect';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { ROUTES, SORT_ORDER_MAP } from '@/constants/common.constants';
import useDebounce from '@/hooks/useDebounce';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetDashboardProducts } from '@/services/product-service/product.service.query';
import type { TProductStatus } from '@/types/api.type';
import type { TSort } from '@/types/component.type';
import { formatDate, formatINRCurrency } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const TH_TITLES = [
  'S. No',
  'View',
  'Thumbnail',
  'Title',
  'Brand',
  'Category',
  'Price',
  'Status',
  'Stock',
  'Created At',
  'Updated At',
  'Stock',
  'Try-On',
  'Variants',
  'Sku',
  'Slug',
  'Sold',
  'Returned',
  'Avg. Rating',
];

const SearchAndSort = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const [searchQuery, setSearchQuery] = useState(queryParams?.search || '');

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

  return (
    <div className="flex items-center justify-between gap-3 md:gap-4">
      <Input
        needRef
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
        icons={{ right: { icon: 'solar:magnifer-linear', className: 'size-4 text-primary/50' } }}
        containerClassName="[&>div]:h-9!"
      />
      <Button
        pattern="outline"
        content={{
          icon: !!queryParams.sort ? 'solar:list-arrow-up-linear' : 'solar:list-arrow-down-linear',
          className: 'size-full',
          onClick: () => {
            if (queryParams.sort) {
              removeParams(['sort']);
            } else {
              setParams({ sort: SORT_ORDER_MAP.asc });
            }
          },
        }}
        className="border-primary/10 bg-smoke-eerie size-9! max-w-fit shrink-0 p-2!"
      />
    </div>
  );
};

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
    sortBy: 'updatedAt',
    sortOrder: (queryParams.sort || 'desc') as TSort,
  });

  const [val, setVal] = useState<number | string>('');

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <PageWrapper
      navbar={{
        buttons: [
          {
            content: 'Add Product',
            pattern: 'primary',
            className: 'whitespace-nowrap py-2.5! px-3!',
            leftIcon: { icon: 'solar:add-circle-linear' },
            buttonProps: { onClick: () => navigate(ROUTES.PRODUCTS.ADD) },
          },
        ],
        ...(data?.counts && {
          components: [
            <Select
              options={Object.entries(data?.counts ?? {})
                .filter(([, value]) => !!value)
                .map(([key, value]) => ({
                  value: key.toLowerCase(),
                  label: `${key} (${value})`.toLowerCase(),
                }))}
              selectProps={{
                value: queryParams.status || 'all',
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
              containerClassName="max-w-32! w-full [&>div]:max-h-9!"
              className="[&>div]:first:px-2.5! [&>div]:first:text-[13px] [&>div]:first:capitalize"
              optionsClassName="[&>ul>li]:text-xs"
            />,
          ],
        }),
        children: <SearchAndSort />,
      }}
    >
      <HierarchySelect
        selectProps={{
          value: val,
          placeholder: 'Select Category',
          onChange: (v) => setVal(v),
        }}
        options={[
          {
            label: (
              <div className="flex items-center gap-2">
                <Icon icon="solar:laptop-linear" className="size-4" />
                <span>Electronics</span>
              </div>
            ),
            searchLabel: 'Electronics',
            value: 1,
            children: [
              {
                label: 'Mobiles',
                searchLabel: 'Mobiles',
                value: 11,
                children: [
                  // {
                  //   label: (
                  //     <div className="flex items-center gap-2">
                  //       <span>🤖</span>
                  //       <span>Android Phones</span>
                  //     </div>
                  //   ),
                  //   searchLabel: 'Android Phones',
                  //   value: 111,
                  // },
                  // {
                  //   label: 'iPhones',
                  //   searchLabel: 'iPhones',
                  //   value: 112,
                  // },
                  // {
                  //   label: 'Gaming Phones',
                  //   searchLabel: 'Gaming Phones',
                  //   value: 113,
                  // },
                ],
              },
              {
                label: 'Laptops',
                searchLabel: 'Laptops',
                value: 12,
                children: [
                  {
                    label: (
                      <div className="flex items-center gap-2">
                        <span>🎮</span>
                        <span>Gaming Laptops</span>
                      </div>
                    ),
                    searchLabel: 'Gaming Laptops',
                    value: 121,
                  },
                  {
                    label: 'Business Laptops',
                    searchLabel: 'Business Laptops',
                    value: 122,
                  },
                  {
                    label: 'MacBooks',
                    searchLabel: 'MacBooks',
                    value: 123,
                  },
                ],
              },
            ],
          },
          {
            label: (
              <div className="flex items-center gap-2">
                <span>👕</span>
                <span>Fashion</span>
              </div>
            ),
            searchLabel: 'Fashion',
            value: 2,
            children: [
              {
                label: 'Men',
                searchLabel: 'Men',
                value: 21,
                children: [
                  {
                    label: (
                      <div className="flex items-center gap-2">
                        <span>👔</span>
                        <span>Shirts</span>
                      </div>
                    ),
                    searchLabel: 'Shirts',
                    value: 211,
                  },
                  {
                    label: 'T-Shirts',
                    searchLabel: 'T-Shirts',
                    value: 212,
                  },
                  {
                    label: 'Jeans',
                    searchLabel: 'Jeans',
                    value: 213,
                  },
                ],
              },
              {
                label: 'Women',
                searchLabel: 'Women',
                value: 22,
                children: [
                  {
                    label: 'Dresses',
                    searchLabel: 'Dresses',
                    value: 221,
                  },
                  {
                    label: 'Tops',
                    searchLabel: 'Tops',
                    value: 222,
                  },
                  {
                    label: 'Handbags',
                    searchLabel: 'Handbags',
                    value: 223,
                  },
                ],
              },
            ],
          },
          {
            label: 'Beauty',
            searchLabel: 'Beauty',
            value: 3,
            children: [
              {
                label: 'Makeup',
                searchLabel: 'Makeup',
                value: 31,
                children: [
                  {
                    label: 'Lipstick',
                    searchLabel: 'Lipstick',
                    value: 311,
                  },
                  {
                    label: 'Foundation',
                    searchLabel: 'Foundation',
                    value: 312,
                  },
                  {
                    label: 'Mascara',
                    searchLabel: 'Mascara',
                    value: 313,
                  },
                ],
              },
              {
                label: 'Skincare',
                searchLabel: 'Skincare',
                value: 32,
                children: [
                  {
                    label: 'Face Wash',
                    searchLabel: 'Face Wash',
                    value: 321,
                  },
                  {
                    label: 'Moisturizer',
                    searchLabel: 'Moisturizer',
                    value: 322,
                  },
                  {
                    label: 'Sunscreen',
                    searchLabel: 'Sunscreen',
                    value: 323,
                  },
                ],
              },
            ],
          },
        ]}
      />
      <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
        {!!data?.products?.length && (
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table className="relative text-xs">
              <TableHead>
                <TableRow>
                  {TH_TITLES.map((title) => (
                    <TableHeadCell key={title}>{title}</TableHeadCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.products.map((product, index) => {
                  return (
                    <TableRow
                      key={product._id + index}
                      tabIndex={0}
                      className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                      ref={index === data.products.length - 4 ? ref : undefined}
                    >
                      <TableRowCell>{index + 1}</TableRowCell>
                      <TableRowCell>
                        <Icon
                          icon="material-symbols:eye-tracking-outline"
                          className="text-primary hover:text-blue-crayola-c mx-auto size-4.5 cursor-pointer"
                        />
                      </TableRowCell>
                      <TableRowCell className="grid place-items-center">
                        <img
                          src={product.thumbnail}
                          alt="Thumbnail"
                          className="border-tertiary/20 aspect-square size-10 rounded-lg border object-cover"
                        />
                      </TableRowCell>
                      <TableRowCell>
                        <p className="max-w-sm truncate text-left">{product.title}</p>
                      </TableRowCell>
                      <TableRowCell>{product.brand}</TableRowCell>
                      <TableRowCell>{product.category.name}</TableRowCell>
                      <TableRowCell className="font-medium">
                        <p className="text-primary-green">
                          {formatINRCurrency(product.sellingPrice)}
                        </p>
                        <p className="text-primary-red">
                          {formatINRCurrency(product.originalPrice)}
                        </p>
                      </TableRowCell>
                      <TableRowCell>{product.status}</TableRowCell>
                      <TableRowCell>
                        {!product.hasVariants
                          ? product.stock
                          : product.variants?.reduce((acc, variant) => acc + variant.stock, 0)}
                      </TableRowCell>
                      <TableRowCell>
                        {formatDate(product.createdAt, { month: '2-digit' })}
                      </TableRowCell>
                      <TableRowCell>
                        {formatDate(product.updatedAt, { month: '2-digit' })}
                      </TableRowCell>
                      <TableRowCell>
                        {product.tryOn.enabled
                          ? `${product.tryOn.category} - ${product.tryOn.subCategory}`
                          : 'N/A'}
                      </TableRowCell>
                      <TableRowCell>
                        {product.hasVariants ? product.variants.length : 'N/A'}
                      </TableRowCell>
                      <TableRowCell>{product.sku}</TableRowCell>
                      <TableRowCell>{product.slug}</TableRowCell>
                      <TableRowCell>{product.soldCount}</TableRowCell>
                      <TableRowCell>{product.returnCount}</TableRowCell>
                      <TableRowCell>{product.averageRating}</TableRowCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        )}

        {(isLoading ||
          isFetchingNextPage ||
          isError ||
          isFetchNextPageError ||
          // Check if there are no products
          (!isLoading &&
            !isFetchingNextPage &&
            !isError &&
            !isFetchNextPageError &&
            data?.products?.length === 0)) && (
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
                status={isError || isFetchNextPageError ? 'error' : 'empty'}
                title={
                  isError
                    ? 'Failed to load products'
                    : isFetchNextPageError
                      ? 'Failed to load more products'
                      : 'No products available'
                }
                description={
                  isError
                    ? 'Something went wrong while fetching products. Please try again.'
                    : isFetchNextPageError
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
