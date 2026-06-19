import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import { Table, TableBody, TableHead, TableHeadCell, TableRow } from '@/components/layout/table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { ROUTES } from '@/constants/common.constants';
import useDebounce from '@/hooks/useDebounce';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetDashboardProducts } from '@/services/product-service/product.service.query';
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

  const { data, hasNextPage, fetchNextPage } = useGetDashboardProducts({ limit: '10' });
  const counts = data?.counts;

  console.log('🚀 ~ Products ~ data:', data);

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
          <Table>
            <TableHead>
              <TableRow>
                {[
                  'S. No',
                  'Thumbnail',
                  'Title',
                  'Brand',
                  'Category',
                  'Sell Count',
                  'Return Count',
                  'Avg. Rating',
                  'Has Variants',
                  'Try-On',
                  'Sku',
                  'Slug',
                  'Status',
                  'Action',
                ].map((title) => (
                  <TableHeadCell className="first:text-left last:text-right" key={title}>
                    {title}
                  </TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>Hello</TableBody>
          </Table>
        </ScrollableGradientContainer>
      </div>
    </PageWrapper>
  );
};

export default Products;
