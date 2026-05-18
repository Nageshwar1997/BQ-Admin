import type { ComponentProps } from 'react';

export const Table = ({ className = '', ...props }: ComponentProps<'table'>) => (
  <table {...props} className={`w-full table-auto border-separate border-spacing-0 ${className}`} />
);

export const TableHead = (props: ComponentProps<'thead'>) => <thead {...props} />;

export const TableBody = (props: ComponentProps<'tbody'>) => <tbody {...props} />;

export const TableRow = (props: ComponentProps<'tr'>) => <tr {...props} />;

export const TableHeadCell = ({ className = '', ...props }: ComponentProps<'th'>) => (
  <th
    {...props}
    className={`text-primary/55 border-primary/10 w-auto border-y px-4 py-3 text-center text-xs font-semibold tracking-normal whitespace-nowrap uppercase ${className}`}
  />
);

export const TableRowCell = ({ className = '', ...props }: ComponentProps<'td'>) => (
  <td
    {...props}
    className={`border-primary/5 w-auto border-y px-4 py-3 text-center align-middle text-sm whitespace-nowrap ${className}`}
  />
);
