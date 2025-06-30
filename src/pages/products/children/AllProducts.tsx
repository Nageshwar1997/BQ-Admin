import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/button/Button";
import PathNavigation from "../../../components/ui/PathNavigation";
import { DeleteIcon, EditIcon, UploadCloudIcon } from "../../../icons";
import { toINRCurrency } from "../../../utils";
import {
  useDeleteProduct,
  useGetAllProducts,
} from "../../../api/product/product.service";
import { useEffect } from "react";
import { FetchedProductType } from "../../../types";
import LoadingPage from "../../../components/ui/loaders/LoadingPage";

const AllProducts = () => {
  const navigate = useNavigate();

  const getAllProducts = useGetAllProducts();
  const deleteProduct = useDeleteProduct();

  const handleGetAllProducts = (page: number, limit: number) => {
    getAllProducts.mutate(
      {
        data: {
          shades: ["shadeName", "colorCode", "images"],
          seller: ["firstName", "lastName", "email"],
          category: ["name", "category", "parentCategory", "level"],
        },
        params: { page, limit },
      },
      {
        onSuccess: (data) => {
          console.log("DATA", data);
        },
        onError: (error) => {
          console.log("ERROR", error);
        },
      }
    );
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct.mutate(productId);
  };

  useEffect(() => {
    handleGetAllProducts(1, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteProduct?.isSuccess]);

  return (
    <>
      {deleteProduct.isPending && <LoadingPage />}
      <div className="w-full space-y-3 px-2">
        <div className="w-full px-4 py-3 border-b border-primary-50 flex justify-end base:justify-between items-center sticky top-16 bg-primary-inverted z-10 shadow-lg">
          <PathNavigation className="hidden base:flex" />
          <Button
            pattern="secondary"
            content="Upload"
            className="max-w-36 !py-1.5 !px-4 !rounded-lg gap-2"
            onClick={() => navigate("upload")}
            rightIcon={
              <UploadCloudIcon className="w-5 h-5 [&>path]:stroke-[2.5] [&>path]:stroke-secondary-inverted" />
            }
          />
        </div>
        <div className="w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] base:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
          {getAllProducts.data?.products?.map((product: FetchedProductType) => {
            return (
              <div
                key={product?._id}
                className="p-4 rounded-lg shadow-sm bg-primary-inverted flex flex-col gap-4 border-rounded-corners-gradient cursor-pointer"
              >
                <div className="aspect-square overflow-hidden rounded-md relative group">
                  <img
                    src={product.commonImages[0]}
                    alt="Product"
                    className="w-full h-full object-fill aspect-auto hover:scale-105 transition-transform duration-500"
                  />
                  <span className="w-6 h-6 absolute top-0.5 left-0.5 text-[8px] flex flex-col items-center justify-center rounded-full font-semibold dark:bg-green-700 light:bg-green-600 leading-none">
                    {`-${product.discount.toFixed(0)}%`}
                  </span>
                  <div className="flex items-center gap-1 absolute top-0.5 right-0.5">
                    <button
                      className="rounded-full flex items-center justify-center bg-primary shadow-md"
                      onClick={() => navigate(`update/${product._id}`)}
                    >
                      <EditIcon className="w-6 h-6 p-1.5 [&>path]:stroke-[2.5] [&>path]:stroke-primary-inverted [&>path]:hover:stroke-blue-crayola-c" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="rounded-full flex items-center justify-center bg-primary shadow-md"
                    >
                      <DeleteIcon className="w-6 h-6 p-1.5 [&>path]:stroke-[2.5] [&>path]:stroke-primary-inverted [&>path]:hover:stroke-red-600" />
                    </button>
                  </div>
                </div>
                <hr className="h-px block border-none bg-gradient-line" />
                <div className="flex flex-col justify-between gap-2 grow">
                  <p className="text-sm font-semibold line-clamp-2 text-secondary">
                    {product.title}
                  </p>
                  <p className="text-xs font-semibold line-clamp-1 text-secondary opacity-70">
                    {product.category.name}
                  </p>
                  <p className="text-xs text-tertiary line-clamp-1 border border-primary-50 w-fit px-3 py-1 rounded-full">
                    {product.brand}
                  </p>
                  <div className="text-sm font-medium text-tertiary flex items-center gap-3">
                    <span>Price:</span>
                    <span className="text-green-500">
                      {toINRCurrency(product.sellingPrice)}
                    </span>
                    <span className="text-red-600 line-through">
                      {toINRCurrency(product.originalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
