import Navbar from '@/components/layout/navbar';
import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';

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
    </div>
  );
};

export default Categories;
