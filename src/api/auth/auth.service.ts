import { useMutation } from "@tanstack/react-query";
import { login_user } from "./auth.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import { LoginFormInputProps } from "../../types";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (bodyData: Partial<LoginFormInputProps>) => login_user(bodyData),
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
