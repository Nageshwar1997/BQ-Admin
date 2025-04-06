import { useLocation } from "react-router-dom";
import { DropdownIcon } from "../icons";

const PathNavigation = () => {
  const { pathname } = useLocation();
  const paths = pathname.split("/").filter((path) => path !== "");
  return (
    <div className="flex items-center gap-2 text-tertiary">
      {["Home", ...paths].map((path, ind) => (
        <div key={ind} className="flex items-center gap-2">
          <span className="capitalize line-clamp-1">{path}</span>
          {ind < paths.length - 1 && <DropdownIcon className="-rotate-90" />}
        </div>
      ))}
    </div>
  );
};

export default PathNavigation;
