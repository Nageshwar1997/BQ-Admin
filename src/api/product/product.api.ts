import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getAdminToken } from "../../utils";
import { productRoutes } from "../api.routes";
import { IProductPossiblePopulateFields } from "../../types";

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
  data: IProductPossiblePopulateFields;
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

export const get_product_by_id = async ({
  data,
  params,
}: {
  data: IProductPossiblePopulateFields;
  params: { productId: string };
}) => {
  try {
    const { method, url } = productRoutes.getProductById;
    const response = await api.request({
      method,
      url: `${url}/${params.productId}`,
      data: { populateFields: data }, // ✅ Wrap 'data' inside populateFields
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!";
  }
};

export const update_product = async ({
  data,
  productId,
}: {
  data: FormData;
  productId: string;
}) => {
  try {
    const admin_token = getAdminToken();

    const { method, url } = productRoutes.updateProduct;
    const response = await api.request({
      method,
      url: `${url}/${productId}`,
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

export const delete_product = async (productId: string) => {
  try {
    const admin_token = getAdminToken();

    const { method, url } = productRoutes.deleteProduct;
    const response = await api.request({
      method,
      url: `${url}/${productId}`,
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
