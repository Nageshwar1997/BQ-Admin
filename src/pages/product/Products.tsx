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
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { PRODUCT_STATUS_MAP } from '@/constants/api.constants';
import { ROUTES } from '@/constants/common.constants';
import useDebounce from '@/hooks/useDebounce';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetDashboardProducts } from '@/services/product-service/product.service.query';
import { formatINRCurrency } from '@/utils/common.util';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

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
          disabled: !queryParams.status || queryParams.status === 'draft',
        }}
        icons={{
          right: { icon: 'solar:magnifer-linear', className: 'size-4 text-primary/50' },
        }}
        containerClassName="[&>div]:h-10!"
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
              setParams({ sort: 'asc' });
            }
          },
        }}
        className="border-primary/10 bg-smoke-eerie size-10! max-w-fit p-2!"
      />
    </div>
  );
};

const Products = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const { navigate } = usePathParams();
  const { ref, inView } = useInView();

  const { data, hasNextPage, fetchNextPage, isLoading, isError } = useGetDashboardProducts({
    limit: '10',
  });
  const counts = data?.counts;
  const products = data?.products;

  console.log('🚀 ~ Products ~ data:', data);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  console.log('product.tryOn', products?.[0]?.tryOn);
  return (
    <PageWrapper
      navbar={{
        buttons: [
          {
            content: 'Add Product',
            pattern: 'primary',
            className: 'whitespace-nowrap',
            leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
            buttonProps: { onClick: () => navigate(ROUTES.PRODUCTS.ADD) },
          },
        ],
        ...(counts && {
          components: [
            <Select
              options={[
                { label: 'All', value: 'all' },
                { label: 'Published', value: 'published' },
                { label: 'Pending', value: 'pending' },
                { label: 'Draft', value: 'draft' },
              ]}
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
              containerClassName="max-w-32.5! w-full"
            />,
          ],
        }),
        children: <SearchAndSort />,
      }}
    >
      <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
        <ScrollableGradientContainer
          direction="horizontal"
          gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
        >
          <Table className="text-xs">
            <TableHead>
              <TableRow>
                {[
                  'S. No',
                  'Thumbnail',
                  'Title',
                  'Brand',
                  'Category',
                  'Price',
                  'Sold',
                  'Returned',
                  'Avg. Rating',
                  'Variants',
                  'Stock',
                  'Try-On',
                  'Sku',
                  'Slug',
                  'Status',
                  'Update',
                  'Action',
                ].map((title) => (
                  <TableHeadCell key={title}>{title}</TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.length ? (
                products.map((product, index) => {
                  return (
                    <TableRow
                      key={product._id}
                      tabIndex={0}
                      className="border-y-primary/5 border-y first:border-t-0 last:border-b-0 [&>td]:text-xs"
                      ref={index === products.length - 4 ? ref : undefined}
                    >
                      <TableRowCell>{index + 1}</TableRowCell>
                      <TableRowCell className="grid place-items-center">
                        <img
                          src={product.thumbnail}
                          alt="Thumbnail"
                          className="border-tertiary/20 aspect-square size-10 rounded-lg border object-cover"
                        />
                      </TableRowCell>
                      <TableRowCell className="max-w-sm truncate text-left">
                        {product.title}
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
                      <TableRowCell>{product.soldCount}</TableRowCell>
                      <TableRowCell>{product.returnCount}</TableRowCell>
                      <TableRowCell>{product.averageRating}</TableRowCell>
                      <TableRowCell>
                        {product.hasVariants ? product.variants.length : 'N/A'}
                      </TableRowCell>
                      <TableRowCell>
                        {!product.hasVariants
                          ? product.stock
                          : product.variants?.reduce((acc, variant) => acc + variant.stock, 0)}
                      </TableRowCell>
                      <TableRowCell>
                        {product.tryOn.enabled
                          ? `${product.tryOn.category} - ${product.tryOn.subCategory}`
                          : 'N/A'}
                      </TableRowCell>
                      <TableRowCell>{product.sku}</TableRowCell>
                      <TableRowCell>{product.slug}</TableRowCell>
                      <TableRowCell>{product.status}</TableRowCell>
                      <TableRowCell>
                        <Select
                          options={[
                            PRODUCT_STATUS_MAP.PENDING,
                            PRODUCT_STATUS_MAP.PUBLISHED,
                            PRODUCT_STATUS_MAP.REJECTED,
                            PRODUCT_STATUS_MAP.BLOCKED,
                          ].map((status) => ({
                            label: status,
                            value: status,
                          }))}
                          selectProps={{ value: product.status }}
                          optionsClassName="[&>ul>li]:text-xs"
                          containerClassName="[&>div]:h-9"
                          className="[&>div>span]:pr-1 [&>div>span]:text-xs"
                        />
                      </TableRowCell>
                      <TableRowCell>
                        <div className="inline-flex items-center justify-center gap-2">
                          <Button
                            content={{ icon: 'solar:pen-linear', className: 'size-4.5' }}
                            pattern="outline"
                            buttonProps={{
                              onClick: (event) => {
                                event.stopPropagation();
                                // onEdit(data);
                              },
                            }}
                            className="border-primary/20 hover:border-blue-crayola-c/50 hover:text-blue-crayola-c size-9! p-0!"
                          />
                          <Button
                            content={{
                              icon: 'solar:trash-bin-trash-linear',
                              className: 'size-4.5',
                            }}
                            pattern="outline"
                            buttonProps={{
                              onClick: (event) => {
                                event.stopPropagation();
                                // onDelete(data.category._id)
                              },
                            }}
                            className="border-primary/20 hover:border-red-c/50 hover:text-red-c size-9! p-0!"
                          />
                        </div>
                      </TableRowCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-y-primary/5 border-y first:border-t-0 last:border-b-0">
                  <TableRowCell colSpan={4}>
                    {isLoading ? (
                      <LoadingText text="Loading..." className="mx-auto my-2" />
                    ) : (
                      <ApiStatus
                        className="min-h-0!"
                        status={isError ? 'error' : 'empty'}
                        title="Hello"
                        description="Hello"
                        // title={
                        //   isError
                        //     ? 'Failed to load categories'
                        //     : // : haveLength
                        //       false
                        //       ? 'No matching categories found'
                        //       : 'No categories available'
                        // }
                        // description={
                        //   isError
                        //     ? `Something went wrong while fetching level ${level} categories. Please try again.`
                        //     : haveLength
                        //       ? 'Try searching with a different keyword or clear the search.'
                        //       : `No level ${level} categories have been added under this category yet.`
                        // }
                      />
                    )}
                  </TableRowCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollableGradientContainer>
      </div>
    </PageWrapper>
  );
};

export default Products;
