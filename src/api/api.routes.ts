export const authRoutes = {
  login: { method: "POST", url: "/auth/login" },
};

export const productRoutes = {
  uploadProduct: { method: "POST", url: "/products/upload" },
};

export const userRoutes = {
  getUser: { method: "GET", url: "/users/user" },
};

export const mediaRoutes = {
  uploadSingleImage: { method: "POST", url: "/media/image/upload" },
  uploadMultipleImages: { method: "POST", url: "/media/images/upload" },
  deleteSingleImage: { method: "DELETE", url: "/media/images/delete" },
  deleteMultipleImages: { method: "DELETE", url: "/media/images/delete" },
};
