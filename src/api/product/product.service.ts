import { useMutation } from "@tanstack/react-query";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toast.util";
import { get_all_products, upload_product } from "./product.api";

export const useUploadProduct = () => {
  return useMutation({
    mutationFn: (bodyData: FormData) => upload_product(bodyData),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product uploaded successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to upload product!"
      );
    },
  });
};

export const useGetAllProducts = () => {
  return useMutation({
    mutationFn: ({
      data,
      params,
    }: {
      data: Record<string, string[]>;
      params: { page: number; limit: number };
    }) => get_all_products({ data, params }),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product fetched successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to fetch product!"
      );
    },
  });
};
