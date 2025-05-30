import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/button/Button";
import PathNavigation from "../../../components/ui/PathNavigation";
import { UploadCloudIcon } from "../../../icons";
import { toINRCurrency } from "../../../utils";
import { useGetAllProducts } from "../../../api/product/product.service";
import { useEffect } from "react";

const AllProducts = () => {
  const navigate = useNavigate();

  const getAllProducts = useGetAllProducts();

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

  useEffect(() => {
    handleGetAllProducts(1, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
        {Array.from({ length: 21 }).map((_, ind) => {
          return (
            <div
              key={ind}
              className="p-4 rounded-lg shadow-sm bg-primary-inverted space-y-4 border-rounded-corners-gradient cursor-pointer"
            >
              <div className="aspect-square overflow-hidden rounded-md relative">
                <img
                  src={
                    ind % 2 === 0
                      ? "https://www.sugarcosmetics.com/cdn/shop/files/Ultrastay-Transferproof-Lipstick-4_4fc4742d.jpg"
                      : "https://cdn.shopify.com/s/files/1/0906/2558/files/658887719-artboard-1.jpg?v=1736853930"
                  }
                  alt="Product"
                  className="w-full h-full object-fill aspect-auto hover:scale-105 transition-transform duration-500"
                />
                <span className="w-8 h-8 absolute top-1 right-1 text-[10px] flex flex-col items-center justify-center rounded-full font-semibold dark:bg-green-700 light:bg-green-600 leading-none">
                  -23%
                </span>
              </div>
              <hr className="h-px block border-none bg-gradient-line" />
              <div className="space-y-3">
                <p className="text-sm font-semibold line-clamp-2 text-secondary">
                  Lorem ipsum dolor sit ame. Lorem, ipsum dolor. Lorem ipsum
                  dolor sit.
                </p>
                <p className="text-xs text-tertiary line-clamp-1 border border-primary-50 w-fit px-3 py-1 rounded-full">
                  {ind % 2 === 0
                    ? "Lipstick Primer"
                    : "Lip Balm Primer & Scrub"}
                </p>
                <div className="w-full space-y-1 text-sm font-medium text-tertiary">
                  <p className="flex items-center gap-1">
                    Selling Price:{" "}
                    <span className="text-green-500">
                      {toINRCurrency(9999)}
                    </span>
                  </p>
                  <p className="flex items-center gap-1">
                    Original Price:{" "}
                    <span className="text-red-600 line-through">
                      {toINRCurrency(8899)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    pattern="secondary"
                    content="Edit"
                    className="!py-1 !rounded-[5px] !text-sm"
                  />
                  <Button
                    pattern="primary"
                    content="Delete"
                    className="!py-1 !rounded-[5px] !text-sm"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllProducts;
