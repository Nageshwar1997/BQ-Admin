import Navbar from '@/components/layout/navbar';
import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import { Icon } from '@iconify/react';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const data = [{ id: 1, name: 'Ada' }];
const columns = [{ accessorKey: 'name', header: 'Name' }];

const Table = () => {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const { data: level1Cats } = useGetCategoriesByParentLevel({ level: 1 });
  console.log('🚀 ~ Table ~ level1Cats:', level1Cats);

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
            <td>
              <div className="flex">
                <Icon icon="solar:pen-linear" className="size-5 text-primary" />
                <Icon icon="solar:trash-bin-trash-linear" className="size-5 text-primary" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Categories = () => {
  const { navigate } = usePathParams();
  return (
    <div className="">
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
      />
      <Table />
    </div>
  );
};

export default Categories;
