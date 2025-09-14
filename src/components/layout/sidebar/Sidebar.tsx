import usePathParams from "../../../hooks/usePathParams";
import { sidebarData } from "./data";
import { useUserStore } from "../../../store/user.store";
import useVerticalScrollable from "../../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../../ui/Gradients";
import { DropdownIcon } from "../../../icons";

const Sidebar = () => {
  const { navigate } = usePathParams();
  const { user } = useUserStore();

  const [showGradient, containerRef] = useVerticalScrollable();

  return (
    <div className="max-w-[250px] w-full h-full bg-tertiary-inverted text-tertiary rounded-lg shadow-lg shadow-secondary-inverted z-50 hidden lg:block">
      <div className="h-16 w-full px-2">
        <div className="w-full h-full border-b border-primary-50 flex justify-center">
          <img
            src="/images/logo/BQ_gradient_logo.webp"
            alt="Logo"
            className="object-cover w-fit h-full"
            draggable={false}
          />
        </div>
      </div>
      <div className="w-full h-full">
        {/* Profile Section */}
        <div className="w-full flex justify-center items-center gap-1 px-2 py-3">
          <div className="min-h-14 min-w-14 max-w-16 max-h-16 overflow-hidden p-px bg-accent-duo rounded-full shadow-primary-btn">
            <img
              src={user?.profilePic || "/images/sidebar/user-placeholder.webp"}
              alt="Logo"
              className="object-cover w-full h-full rounded-full aspect-square"
              draggable={false}
            />
          </div>
          <div className="text-center grow">
            <p className="text-xl font-bold line-clamp-1 text-transparent bg-accent-duo bg-clip-text capitalize">
              {user?.firstName ?? "John"}
            </p>
            <p className="text-xl font-bold line-clamp-1 text-transparent bg-accent-duo bg-clip-text capitalize">
              {user?.lastName ?? "Doe"}
            </p>
          </div>
        </div>
        <div className="w-full h-[calc(100%-152px)] relative">
          {showGradient.top && (
            <TopGradient className="!w-full h-8 from-secondary-inverted rounded-t-lg" />
          )}
          <div
            className="w-full h-full overflow-y-scroll p-2 flex flex-col gap-3 pb-5"
            ref={containerRef}
          >
            {sidebarData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between gap-2 group cursor-pointer p-2 border border-primary-10 rounded-lg hover:bg-primary-inverted-10 shadow-lg hover:shadow-primary-inverted-50 light:hover:shadow-primary-50 hover:scale-[1.02] duration-300 ${
                    item.disable ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 [&>path]:stroke-tertiary group-hover:[&>path]:stroke-primary" />
                    <p className="text-tertiary group-hover:text-primary text-base">
                      {item.label}
                    </p>
                  </div>
                  <DropdownIcon className="-rotate-90" />
                </div>
              );
            })}
          </div>
          {showGradient.bottom && (
            <BottomGradient className="!w-full h-8 from-secondary-inverted rounded-b-lg" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
