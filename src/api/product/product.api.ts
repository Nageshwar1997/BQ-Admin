import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getAdminToken } from "../../utils";
import { productRoutes } from "../api.routes";

export const upload_product = async (data: FormData) => {
  try {
    const admin_token = getAdminToken();

    const { method, url } = productRoutes.uploadProduct;
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

export const get_all_products = async ({
  data,
  params,
}: {
  data: Record<string, string[]>;
  params: { page: number; limit: number };
}) => {
  try {
    const { method, url } = productRoutes.getAllProducts;
    const response = await api.request({
      method,
      url,
      data: { populateFields: data }, // ✅ Wrap 'data' inside populateFields
      params, // ✅ page and limit as query params
    });

    console.log(
      "🚀 ~ file: product.api.ts:27 ~ get_all_products ~ response",
      response.data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!";
  }
};
