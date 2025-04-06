import { useLocation, useNavigate } from "react-router-dom";
import { DropdownIcon } from "../icons";

const PathNavigation = ({ className = "" }: { className?: string }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const paths = pathname.split("/").filter((path) => path !== "");

  const handleNavigate = (targetIndex: number) => {
    const targetPath =
      targetIndex === -1
        ? "/"
        : "/" + paths.slice(0, targetIndex + 1).join("/");

    if (targetPath !== pathname) {
      navigate(targetPath);
    }
  };

  return (
    <div className={`flex items-center gap-2 text-secondary ${className}`}>
      <div className="flex items-center gap-2">
        <span
          className={`capitalize line-clamp-1 ${
            pathname !== "/" ? "cursor-pointer" : "opacity-80"
          }`}
          onClick={() => handleNavigate(-1)}
        >
          Home
        </span>
        {paths.length > 0 && <DropdownIcon className="-rotate-90" />}
      </div>

      {paths.map((path, index) => {
        const targetPath = "/" + paths.slice(0, index + 1).join("/");
        return (
          <div key={index} className="flex items-center gap-2">
            <span
              className={`capitalize line-clamp-1 ${
                pathname !== targetPath ? "cursor-pointer" : "opacity-80"
              }`}
              onClick={() => handleNavigate(index)}
            >
              {path}
            </span>
            {index < paths.length - 1 && (
              <DropdownIcon className="-rotate-90" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PathNavigation;
