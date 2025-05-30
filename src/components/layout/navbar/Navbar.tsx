import { useUserStore } from "../../../store/user.store";
import Button from "../../button/Button";
import DarkMode from "../../DarkMode";

const Navbar = () => {
  const { logout } = useUserStore();
  return (
    <div className="h-16 w-full px-4 flex items-center justify-between bg-tertiary-inverted text-tertiary rounded-lg">
      <p>Hello, Nageshwar</p>
      <div className="flex items-center gap-8">
        <DarkMode />
        <Button
          pattern="secondary"
          content={"Logout"}
          onClick={() => logout()}
          className="max-w-[180px] !rounded-[10px] !py-2"
        />
        <Button
          content="Manage Account"
          pattern="primary"
          className="min-w-[180px] !rounded-[10px] !py-2"
        />
      </div>
    </div>
  );
};

export default Navbar;
