import { Button, Theme } from '@beautinique/frontend-components';
import { Breadcrumb, getBreadcrumbItems } from '@beautinique/frontend-components/breadcrumb';
import { usePathParams } from '@beautinique/frontend-hooks';
import { Icon } from '@iconify/react';
import { Fragment } from 'react';

import { ROUTES } from '@/constants/common.constants';
import useThemeStore from '@/stores/theme.store';
import useUserStore from '@/stores/user.store';
import type { INavbar } from '@/types/component.type';

const Navbar = ({ buttons, children, components, className = '' }: INavbar) => {
  const user = useUserStore((s) => s.user);
  const { pathname, navigate } = usePathParams();

  return (
    <div
      className={`bg-primary-invert border-b-silver/30 shadow-primary/10 sticky inset-x-0 top-0 z-50 flex flex-col border-b shadow-lg ${className}`}
    >
      <div className="border-b-silver/30 base:gap-3 flex items-center justify-between gap-2 border-b p-4 md:gap-4">
        <div className="base:gap-3 flex items-center gap-2 md:gap-4">
          <div className="size-6 md:size-8">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="border-secondary size-full rounded-full border object-cover"
              />
            ) : (
              <Icon icon="solar:user-circle-linear" className="text-tertiary size-full" />
            )}
          </div>
          <Theme store={useThemeStore} className="size-6 md:size-8" />
        </div>
        {(!!components || !!buttons) && (
          <div className="base:gap-3 flex flex-1 items-center justify-end gap-2 md:gap-4">
            {components?.map((component, index) => (
              <Fragment key={index}>{component}</Fragment>
            ))}
            {buttons?.map((props, idx) => {
              const { children, ...rest } = props;
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const pattern = isFirst ? 'tertiary' : isSecond ? 'secondary' : 'primary';
              const content = isFirst ? 'Save' : isSecond ? 'Cancel' : 'Submit';
              return (
                <div key={idx} className="relative">
                  <Button
                    {...rest}
                    pattern={rest.pattern ?? pattern}
                    content={rest.content ?? content}
                  />
                  {children}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Breadcrumb
        className="p-4"
        items={getBreadcrumbItems(pathname, { homeLabel: 'Dashboard', homeHref: ROUTES.DASHBOARD })}
        onNavigate={(href) => {
          void navigate(href);
        }}
      />
      {children && <div className="border-t-silver/30 border-t p-4">{children}</div>}
    </div>
  );
};
export default Navbar;
