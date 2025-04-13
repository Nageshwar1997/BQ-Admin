import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getAdminToken } from "../../utils";
import { userRoutes } from "../api.routes";

export const get_user_details = async () => {
  try {
    const admin_token = getAdminToken();
    const { method, url } = userRoutes.getUser;
    const response = await api.request({
      method,
      url,
      headers: { Authorization: admin_token },
    });
    return response.data;
  } catch (error) {
    console.log("error", error);
    const admin = sessionStorage.getItem("admin");
    if (admin) {
      sessionStorage.removeItem("admin");
    }
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
