import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type { ICategory, IId } from '@/types/api.type';
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

  public updateCategory = ({ _id, ...data }: Partial<Omit<ICategory, 'slug'>> & IId) => {
    const { method, url } = this.routes.category.update;
    return this.request({ method, url: `${url}/${_id}`, data });
  };

  /* ===================== DELETE API ===================== */

  public deleteCategory = (categoryId: string) => {
    const { method, url } = this.routes.category.delete;
    return this.request({ method, url: `${url}/${categoryId}` });
  };

  /* ===================== GET API ===================== */

  public getCategoriesByParentLevel = (params: Partial<Pick<ICategory, 'level' | 'parent'>>) => {
    return this.request({ ...this.routes.category.get.byParentLevel, params });
  };
}
