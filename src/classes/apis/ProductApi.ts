import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import { ApiRequest } from '../ApiRequest';

export class ProductApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.gateway.product_service;

  constructor() {
    super('gateway-product-service');
  }

  /* ===================== GET API ===================== */

  public getCategoriesByParentLevel = (params: { level?: number; parentId?: string }) => {
    return this.request({ ...this.routes.category.get.byParentLevel, params });
  };
}
