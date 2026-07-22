import usePathParams from '@/hooks/usePathParams';
import type { IBreadcrumb } from '@/types/component.type';
import { Icon } from '@iconify/react';
import ScrollableGradientContainer from '../layout/containers/ScrollableGradientContainer';

const Breadcrumb = ({ className = '', customPath, customPaths }: IBreadcrumb) => {
  const { pathname, paths, navigate } = usePathParams();
  const finalPathName = customPath ?? pathname;
  const activePaths = customPaths ?? paths;

  const handleNavigate = (targetIndex: number) => {
    const targetPath =
      targetIndex === -1 ? '/' : '/' + activePaths.slice(0, targetIndex + 1).join('/');

    if (targetPath !== finalPathName) {
      navigate(targetPath);
    }
  };

  return (
    <ScrollableGradientContainer direction="horizontal" className="[&>div]:justify-start">
      <div className={`text-secondary flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 truncate">
          <span
            className={`truncate capitalize ${
              finalPathName !== '/' ? 'cursor-pointer' : 'opacity-80'
            }`}
            onClick={() => handleNavigate(-1)}
          >
            Dashboard
          </span>
          {activePaths.length > 0 && <Icon icon="solar:alt-arrow-right-linear" className="" />}
        </div>

        {activePaths.map((path, index) => {
          const targetPath = '/' + activePaths.slice(0, index + 1).join('/');
          const isLast = index === activePaths.length - 1;

          return (
            <div key={index} className="flex items-center gap-2 truncate">
              <span
                className={`truncate capitalize ${
                  !isLast && finalPathName !== targetPath ? 'cursor-pointer' : 'opacity-80'
                }`}
                onClick={!isLast ? () => handleNavigate(index) : undefined}
              >
                {path.replace('-', ' ')}
              </span>
              {!isLast && <Icon icon="solar:alt-arrow-right-linear" />}
            </div>
          );
        })}
      </div>
    </ScrollableGradientContainer>
  );
};

export default Breadcrumb;
