import { useMutation } from "@tanstack/react-query";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toast.util";
import { upload_single_image } from "./media.api";

export const useUploadSingleImage = () => {
  return useMutation({
    mutationFn: (bodyData: FormData) => upload_single_image(bodyData),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Image uploaded successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to upload image!"
      );
    },
  });
};
