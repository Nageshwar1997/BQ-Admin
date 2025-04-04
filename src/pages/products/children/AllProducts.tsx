import { useNavigate } from "react-router-dom";
import Button from "../../../components/button/Button";
import PathNavigation from "../../../components/PathNavigation";
import { UploadCloudIcon } from "../../../icons";

const AllProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-3 px-2">
      <div className="w-full p-2 border-b border-primary-50 flex justify-between items-center">
        <PathNavigation />
        <Button
          pattern="secondary"
          content="Upload"
          className="max-w-28 !py-2.5 !px-5 !rounded-lg gap-2"
          onClick={() => navigate("upload")}
          rightIcon={
            <UploadCloudIcon className="w-5 h-5 [&>path]:stroke-primary-inverted" />
          }
        />
      </div>
    </div>
  );
};

export default AllProducts;
