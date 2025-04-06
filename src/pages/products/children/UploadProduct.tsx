import Button from "../../../components/button/Button";
import PathNavigation from "../../../components/PathNavigation";
import { UploadCloudIcon } from "../../../icons";
import ProductForm from "./ProductForm";
import useQueryParams from "../../../hooks/useQueryParams";
import ShadeForm from "./ShadeForm";
// import { ProductType } from "../../../types";
// import { useState } from "react";

const UploadProduct = () => {
  // const [shades, setShades] = useState<ProductType[]>([]);
  const { setParams, queryParams } = useQueryParams();

  return (
    <div className="w-full space-y-3">
      {queryParams.shade && <ShadeForm />}
      <div className="w-full px-4 py-2 border-b border-primary-50 flex justify-between items-center sticky top-16 bg-primary-inverted z-10 shadow-lg">
        <PathNavigation />
        <Button
          pattern="outline"
          content="Add Shade"
          className="max-w-40 !py-1.5 my-1.5 !px-5 !rounded-lg gap-2"
          onClick={() => setParams({ shade: "true" })}
          rightIcon={<UploadCloudIcon className="w-5 h-5" />}
        />
      </div>
      <div className="mx-auto rounded-lg shadow-light-dark-soft bg-platinum-black">
        <div className="w-full h-full flex flex-col lg:flex-row gap-5">
          {/* Product Form */}
          <ProductForm />
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
