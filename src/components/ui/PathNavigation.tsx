import { DropdownIcon } from "../../icons";
import usePathParams from "../../hooks/usePathParams";

type TPathNavigation = {
  className?: string;
  customPath?: string;
  customPaths?: string[];
};

const PathNavigation = ({
  className = "",
  customPath,
  customPaths,
}: TPathNavigation) => {
  const { pathname, paths, navigate } = usePathParams();
  const finalPathName = customPath ?? pathname;
  const activePaths = customPaths ?? paths;

  const handleNavigate = (targetIndex: number) => {
    const targetPath =
      targetIndex === -1
        ? "/"
        : "/" + activePaths.slice(0, targetIndex + 1).join("/");

    if (targetPath !== finalPathName) {
      navigate(targetPath);
    }
  };

  return (
    <div className={`flex items-center gap-2 text-secondary ${className}`}>
      <div className="flex items-center gap-2">
        <span
          className={`capitalize line-clamp-1 ${
            finalPathName !== "/" ? "cursor-pointer" : "opacity-80"
          }`}
          onClick={() => handleNavigate(-1)}
        >
          Home
        </span>
        {activePaths.length > 0 && <DropdownIcon className="-rotate-90" />}
      </div>

      {activePaths.map((path, index) => {
        const targetPath = "/" + activePaths.slice(0, index + 1).join("/");
        const isLast = index === activePaths.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <span
              className={`capitalize line-clamp-1 ${
                !isLast && finalPathName !== targetPath
                  ? "cursor-pointer"
                  : "opacity-80"
              }`}
              onClick={!isLast ? () => handleNavigate(index) : undefined}
            >
              {path}
            </span>
            {!isLast && <DropdownIcon className="-rotate-90" />}
          </div>
        );
      })}
    </div>
  );
};

export default PathNavigation;
