import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
import { RefObject } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { VerticalScrollType } from "../../types";
import { BottomGradient } from "../../components/Gradients";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";

const Main = () => {
  const [showGradient, containerRef] = useVerticalScrollable();

  return (
    <div className="max-h-dvh min-h-dvh max-w-full min-w-full w-dvw h-dvh flex gap-3 overflow-hidden p-2">
      <Sidebar />
      <div className="w-full h-full relative">
        <div
          ref={containerRef as RefObject<HTMLDivElement>}
          className="grow max-w-full h-full overflow-y-scroll rounded-lg relative"
        >
          <div className="bg-primary-inverted w-full sticky top-0 z-50">
            <Navbar />
          </div>
          <div className="w-full">
            <main className="w-full bg-primary-inverted">
              <Outlet />
            </main>
            {/* <Footer /> */}
          </div>
        </div>
        {(showGradient as VerticalScrollType).bottom && (
          <BottomGradient className="!w-full h-8 from-secondary-inverted rounded-b-lg z-[100]" />
        )}
      </div>
    </div>
  );
};

export default Main;
