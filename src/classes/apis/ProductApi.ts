import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type { ICategory } from '@/types/api.type';
import { ApiRequest } from '../ApiRequest';

export class ProductApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.gateway.product_service;

  constructor() {
    super('gateway-product-service');
  }

  /* ===================== POST API ===================== */

  public addCategory = (data: Omit<ICategory, 'slug' | '_id'>) => {
    return this.request({ ...this.routes.category.add, data });
  };

  /* ===================== POST API ===================== */

  public editCategory = (data: Omit<ICategory, 'slug'>) => {
    const { method, url } = this.routes.category.edit;
    const { _id, ...rest } = data;
    return this.request({ method, url: `${url}/${data._id}`, data: rest });
  };

  /* ===================== GET API ===================== */

  public getCategoriesByParentLevel = (params: Partial<Pick<ICategory, 'level' | 'parent'>>) => {
    return this.request({ ...this.routes.category.get.byParentLevel, params });
  };
}
