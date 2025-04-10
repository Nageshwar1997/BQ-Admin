import { useMutation } from "@tanstack/react-query";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import { upload_product } from "./product.api";
import { useNavigate } from "react-router-dom";

export const useUploadProduct = () => {
  const navigate = useNavigate();
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
    onSettled: (data, error) => {
      if (data && !error) {
        navigate("/products");
      }
    },
  });
};
