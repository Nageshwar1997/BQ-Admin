import Footer from '@/components/layout/footer';
import AuthModal from '@/components/layout/modals/AuthModal';
import Sidebar from '@/components/layout/sidebar';
import ScrollToTop from '@/components/ScrollToTop';
import useAutoRetry from '@/hooks/useAutoRetry';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  useAutoRetry(); // It will call api to refresh token when user is online again
  return (
    <div id="main" className="flex min-h-full w-full flex-col">
      <ScrollToTop />
      {/* If the user isn't logged in, show the auth modal. just add queryParams.login = "true" to the url */}
      <AuthModal />
      <div className="flex w-full grow flex-col-reverse md:flex-row">
        <Sidebar />
        <div className="h-full flex-1 grow overflow-x-auto">
          <Outlet />
          <Footer />
        </div>
      </div>
      {/* <Chatbot /> */}
    </div>
  );
};

export default Layout;
