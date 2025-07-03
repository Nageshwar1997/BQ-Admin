import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getAdminToken } from "../../utils";
import { productRoutes } from "../api.routes";
import { IProductPossibleBodyFields } from "../../types";

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
  data?: IProductPossibleBodyFields;
  params: { page: number; limit: number };
}) => {
  try {
    const { method, url } = productRoutes.getAllProducts;
    const response = await api.request({
      method,
      url,
      data: {
        populateFields: data?.populateFields, // shades, category, seller, reviews
        requiredFields: data?.requiredFields, // requiredFields
      },
      params, // ✅ page & limit as query params
    });

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
  data: IProductPossibleBodyFields;
  params: { productId: string };
}) => {
  try {
    const { method, url } = productRoutes.getProductById;
    const response = await api.request({
      method,
      url: `${url}/${params.productId}`,
      data: {
        populateFields: data?.populateFields, // shades, category, seller, reviews
        requiredFields: data?.requiredFields, // requiredFields
      },
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
