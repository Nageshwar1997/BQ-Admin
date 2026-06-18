import type { TPageWrapper } from '@/types/component.type';
import Navbar from '../navbar';

const PageWrapper = ({
  children,
  className = '',
  containerClassName = '',
  navbar,
}: TPageWrapper) => {
  return (
    <div className={`[&>*:not(:first-child)]:p-4 ${containerClassName}`}>
      <Navbar components={navbar?.components} buttons={navbar?.buttons} />
      <div className={`p-4 ${className}`}>{children}</div>
    </div>
  );
};

export default PageWrapper;
