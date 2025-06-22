import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/navbar/Navbar";
import Footer from "../../components/layout/footer/Footer";
import Sidebar from "../../components/layout/sidebar/Sidebar";
import { BottomGradient } from "../../components/ui/Gradients";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";

const Main = () => {
  const [showGradient, containerRef] = useVerticalScrollable();

  return (
    <div className="max-h-dvh min-h-dvh max-w-full min-w-full w-dvw h-dvh flex gap-3 overflow-hidden p-2">
      <Sidebar />
      <div className="w-full h-full relative">
        <div
          ref={containerRef}
          className="grow max-w-full h-full overflow-y-scroll rounded-lg relative"
        >
          <div className="bg-primary-inverted w-full sticky top-0 z-50">
            <Navbar />
          </div>
          <div className="w-full">
            <main className="w-full bg-primary-inverted">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
        {showGradient.bottom && (
          <BottomGradient className="!w-full h-8 from-secondary-inverted rounded-b-lg z-[100]" />
        )}
      </div>
    </div>
  );
};

export default Main;
