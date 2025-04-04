import { useNavigate } from "react-router-dom";
import Button from "../../../components/button/Button";
import PathNavigation from "../../../components/PathNavigation";
import { UploadCloudIcon } from "../../../icons";

const UploadProduct = () => {
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
      <div className="p-4 mx-auto rounded-lg shadow-light-dark-soft bg-platinum-black">
        <div className="w-full h-full flex flex-col lg:flex-row gap-5">
          <form className="w-full flex flex-col gap-7 border h-[1000px]"></form>
          <form className="w-full flex flex-col gap-7 border h-[400px]"></form>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
