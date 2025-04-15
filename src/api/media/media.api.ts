import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getAdminToken } from "../../utils";
import { mediaRoutes } from "../api.routes";

export const upload_single_image = async (data: FormData) => {
  try {
    const admin_token = getAdminToken();

    const { method, url } = mediaRoutes.uploadSingleImage;
    const response = await api.request({
      method,
      url,
      data,
      headers: { Authorization: admin_token },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
