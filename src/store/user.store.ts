import { create } from "zustand";
import { UserStoreType, UserTypes } from "../types";
import { decryptData, encryptData, removeStorageToken } from "../utils";

export const useUserStore = create<UserStoreType>((set) => {
  const encrypted = sessionStorage.getItem("admin");
  let user: UserTypes | null = null;
  const decrypted = decryptData(encrypted ?? "");
  if (decrypted && typeof decrypted === "object") {
    user = decrypted as UserTypes;
  }

  return {
    user,
    isAuthenticated: !!user,

    setUser: (user) => {
      const encryptedUser = encryptData(user);

      sessionStorage.setItem("admin", encryptedUser);
      set({ user, isAuthenticated: true });
    },

    logout: () => {
      sessionStorage.removeItem("admin");
      removeStorageToken();
      set({ user: null, isAuthenticated: false });
    },
  };
});
