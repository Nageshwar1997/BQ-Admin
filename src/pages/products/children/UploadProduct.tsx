import { useNavigate } from "react-router-dom";
import Button from "../../../components/button/Button";
import PathNavigation from "../../../components/PathNavigation";
import { InfoIcon, UploadCloudIcon } from "../../../icons";
import Input from "../../../components/input/Input";
import Select from "../../../components/input/Select";

const FormTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-1">
      <h3 className="text-lg">{title}</h3>
      <InfoIcon className="cursor-pointer" />
    </div>
  );
};
const UploadProduct = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-3">
      <div className="w-full px-4 py-2 border-b border-primary-50 flex justify-between items-center sticky top-16 bg-primary-inverted z-10 shadow-lg shadow-primary-inverted">
        <PathNavigation />
        <Button
          pattern="secondary"
          content="Upload"
          className="max-w-28 !py-1.5 my-1.5 !px-5 !rounded-lg gap-2"
          onClick={() => navigate("upload")}
          rightIcon={
            <UploadCloudIcon className="w-5 h-5 [&>path]:stroke-primary-inverted" />
          }
        />
      </div>
      <div className="mx-auto rounded-lg shadow-light-dark-soft bg-platinum-black">
        <div className="w-full h-full flex flex-col lg:flex-row gap-5">
          <form className="w-full p-4 flex flex-col gap-7 border h-[1000px]">
            <FormTitle title="Product Details" />
            <Input
              name="title"
              label="Title"
              placeholder="Enter Product title"
            />
            <Input
              name="brand"
              label="Brand"
              placeholder="Enter Product brand"
            />
            <Select
              name="category-1"
              label="Category One"
              placeholder="Select a level one category"
            />
            <Select
              name="category-2"
              label="Category Two"
              placeholder="Select a level two category"
            />
            <Select
              name="category-3"
              label="Category Three"
              placeholder="Select a level three category"
            />
          </form>
          <form className="w-full flex flex-col gap-7 border h-[400px] sticky top-[141px]"></form>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
