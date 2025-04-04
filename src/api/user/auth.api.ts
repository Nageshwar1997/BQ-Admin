import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";

// Using Email Id or Phone Number & Password (Type Manually)
export const login_user = async (bodyData: FormData) => {
  try {
    const response = await api.post("/auth/login", bodyData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
