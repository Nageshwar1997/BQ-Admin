import CryptoJS from "crypto-js";

import { ENCRYPTION_SECRET_KEY } from "../envs/index.env";

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_SECRET_KEY).toString();
};

export const saveUserLocal = (data: string) => {
  removeUserSession();
  localStorage.setItem("token", encryptData(JSON.stringify(data)));
};

export const saveUserSession = (data: string) => {
  removeUserLocal();
  sessionStorage.setItem("token", encryptData(JSON.stringify(data)));
};

export const removeUserLocal = () => {
  localStorage.removeItem("token");
};

export const removeUserSession = () => {
  sessionStorage.removeItem("token");
};

export const getUserToken = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    throw new Error("No Token found");
  }

  return JSON.parse(
    CryptoJS.AES.decrypt(token, ENCRYPTION_SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    )
  );
};
