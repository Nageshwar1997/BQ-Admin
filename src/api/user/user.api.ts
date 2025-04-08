import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getUserToken } from "../../utils";
import { userRoutes } from "../api.routes";

export const get_user_details = async () => {
  try {
    const token = getUserToken();
    const { method, url } = userRoutes.getUser;
    const response = await api.request({
      method,
      url,
      headers: { Authorization: token },
    });

    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log("error", error);
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
