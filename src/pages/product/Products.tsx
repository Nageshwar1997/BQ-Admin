import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { debounce } from '@/utils/common.util';
import { useEffect, useMemo, useState } from 'react';

const SearchAndSort = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const [searchQuery, setSearchQuery] = useState(queryParams?.search || '');

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        const trimmedValue = value.trim();

        if (trimmedValue) {
          setParams({ search: trimmedValue });
        } else {
          removeParams(['search']);
        }
      }, 500),
    [],
  );

  useEffect(() => {
    return () => debouncedSetQuery.cancel();
  }, [debouncedSetQuery]);

  useEffect(() => {
    setSearchQuery(queryParams?.search || '');
  }, [queryParams?.search]);

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

            setSearchQuery(value);
            debouncedSetQuery(value);
          },
          disabled: !queryParams.status || queryParams.status === 'draft',
        }}
        icons={{
          right: { icon: 'solar:magnifer-linear', className: 'size-4 md:size-5 text-primary/50' },
        }}
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
        className="border-primary/10 bg-smoke-eerie size-10 max-w-fit p-2! lg:size-12"
      />
    </div>
  );
};

const Products = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const { navigate } = usePathParams();

  return (
    <div className="">
      <Navbar
        buttons={[
          {
            content: 'Add Product',
            pattern: 'primary',
            className: 'whitespace-nowrap',
            leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
            buttonProps: { onClick: () => navigate(ROUTES.PRODUCTS.ADD) },
          },
        ]}
        components={[
          <Select
            options={[
              { label: 'All', value: 'all' },
              { label: 'Published', value: 'published' },
              { label: 'Pending', value: 'pending' },
              { label: 'Draft', value: 'draft' },
            ]}
            selectProps={{
              value: queryParams.status || 'all',
              onChange: ({ currentTarget: { value } }) => {
                if (!value || value === 'all') {
                  removeParams(['status', 'search']);
                } else if (value) {
                  if (value === 'draft') {
                    removeParams(['search']);
                  }
                  setParams({ status: value });
                }
              },
            }}
            containerClassName="max-w-32.5"
          />,
        ]}
        className="[&>:nth-last-child(2)]:border-b-silver/30 [&>:nth-last-child(2)]:border-b [&>div]:py-2"
      >
        {queryParams.status && queryParams.status !== 'draft' && <SearchAndSort />}
      </Navbar>
    </div>
  );
};

export default Products;
