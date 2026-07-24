import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import Tooltip from '@/components/ui/Tooltip';
import { SIDEBAR_DATA } from '@/constants/common.constants';
import useIsSmallScreen from '@/hooks/useIsSmallScreen';
import usePathParams from '@/hooks/usePathParams';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

const SidebarItem = ({
  isSameRoute,
  isSameIndex,
  onClick,
  ...item
}: (typeof SIDEBAR_DATA)[number] & {
  isSameRoute: boolean;
  onClick?: (handleEvents: (typeof SIDEBAR_DATA)[number]['handler']) => void;
  isSameIndex?: boolean;
}) => {
  const icon = isSameIndex || isSameRoute ? item.icon.replace('-linear', '-bold') : item.icon;
  return (
    <div className="flex flex-col items-center gap-1" onClick={() => onClick?.(item.handler)}>
      <span
        className={`border-primary/50 w-fit rounded-lg border p-1 md:p-1.5 ${isSameRoute ? 'bg-accent-duo shadow-secondary-btn' : 'hover:bg-secondary-invert/40 hover:shadow-tertiary-btn bg-secondary-invert/30'}`}
      >
        <Icon
          icon={icon}
          className={`size-5 md:size-6 ${isSameRoute ? 'text-white' : 'text-tertiary'}`}
        />
      </span>
      <span className="text-[8px] md:hidden">{item.title}</span>
    </div>
  );
};

const Sidebar = () => {
  const { pathname, paths } = usePathParams();
  const isMobile = useIsSmallScreen(767);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleEvents = (event: (typeof SIDEBAR_DATA)[number]['handler']) => {
    switch (event) {
      case 'logout':
        console.warn('Logout');
        break;
      default:
        break;
    }
  };

  return (
    <aside className="border-t-silver/30 md:border-r-silver/30 bg-primary-invert sticky bottom-0 left-0 z-50 flex w-dvw items-center justify-center gap-4 border-t px-2 py-4 md:top-0 md:bottom-auto md:h-dvh md:w-fit md:flex-col md:border-r md:border-t-transparent">
      <Link to="/" className="hidden w-14 items-center justify-center md:flex">
        <img
          src="/images/logo/BQ_gradient_logo.webp"
          alt="Logo"
          className="w-full object-contain"
        />
      </Link>
      <Divider className="hidden md:block" />
      <ScrollableGradientContainer
        direction={isMobile ? 'horizontal' : 'vertical'}
        className="[&>div]:items-center [&>div]:justify-start"
        containerClassName="grow"
      >
        <div className="flex gap-4 md:flex-col">
          {SIDEBAR_DATA.map((item, index) => {
            const path =
              'path' in item ? (item.path !== '/' ? item.path.replace('/', '') : item.path) : '';
            const isSameRoute = path === pathname || paths.includes(path);
            const isSameIndex = hoveredIdx === index;

            return (
              <Tooltip
                key={index}
                title={item.title}
                placement={isMobile ? 'top' : 'right'}
                required={!isMobile}
              >
                {path ? (
                  <>
                    <Link
                      to={path}
                      onMouseEnter={() => {
                        setHoveredIdx(index);
                      }}
                      onMouseLeave={() => {
                        setHoveredIdx(null);
                      }}
                    >
                      <SidebarItem {...item} isSameRoute={isSameRoute} isSameIndex={isSameIndex} />
                    </Link>
                  </>
                ) : (
                  <SidebarItem
                    {...item}
                    isSameRoute={isSameRoute}
                    isSameIndex={isSameIndex}
                    onClick={handleEvents}
                  />
                )}
              </Tooltip>
            );
          })}
        </div>
      </ScrollableGradientContainer>
    </aside>
  );
};

export default Sidebar;
