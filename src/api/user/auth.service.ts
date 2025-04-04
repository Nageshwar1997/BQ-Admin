import { useMutation } from "@tanstack/react-query";
import { login_user } from "./auth.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (bodyData: FormData) => login_user(bodyData),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Login successful!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};
