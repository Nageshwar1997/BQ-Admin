import { authApi } from '@/classes/apis';
import { USER_SERVICE_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { useMutation } from '@tanstack/react-query';

const QUERY_KEY = USER_SERVICE_QUERY_KEYS.auth;

/* ===================== LOGIN QUERIES ===================== */

export const useLogin = () => {
  return useMutation({
    mutationKey: QUERY_KEY.login,
    mutationFn: authApi.login,
    onMutate: () => {
      const toastId = toaster.loading({ title: 'Please wait...', description: 'Logging in...' });
      return { toastId };
    },
    onSuccess: async ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== PASSWORD QUERIES ===================== */

export const useForgotPasswordSendOtp = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.send_otp,
    mutationFn: authApi.forgotPasswordSendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending OTP to your email...',
      });

      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordResendOtp = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.resend_otp,
    mutationFn: authApi.forgotPasswordResendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Resending OTP to your email...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordVerifyOtp = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.verify_otp,
    mutationFn: authApi.forgotPasswordVerifyOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Verifying your OTP...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordSave = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.save,
    mutationFn: authApi.forgotPasswordSave,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your password...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.change,
    mutationFn: authApi.changePassword,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Changing your password...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};
