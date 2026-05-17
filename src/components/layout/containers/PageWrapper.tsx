import type { TChildren, TClassName } from '@/types/component.type';

const PageWrapper = ({ children, className = '' }: TChildren & TClassName) => {
  return (
    <div className={`flex flex-col gap-5 [&>*:not(:first-child)]:p-4 ${className}`}>{children}</div>
  );
};

export default PageWrapper;
