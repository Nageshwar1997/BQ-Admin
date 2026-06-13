import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type { ICategory, IId } from '@/types/api.type';
import { ApiRequest } from '../ApiRequest';

export class CategoryApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.product_service.category;

  /* ===================== POST API ===================== */

  public addCategory = (data: Omit<ICategory, 'slug' | '_id'>) => {
    return this.request({ ...this.routes.add, data });
  };

  /* ===================== PATCH API ===================== */

  public updateCategory = ({ _id, ...data }: Partial<Omit<ICategory, 'slug'>> & IId) => {
    const { method, url } = this.routes.update;
    return this.request({ method, url: url({ categoryId: _id }), data });
  };

  /* ===================== DELETE API ===================== */

  public deleteCategory = (categoryId: string) => {
    const { method, url } = this.routes.delete;
    return this.request({ method, url: url({ categoryId }) });
  };

  /* ===================== GET API ===================== */

  public getCategoriesByParentLevel = (params: Partial<Pick<ICategory, 'level' | 'parent'>>) => {
    return this.request({ ...this.routes.get.byParentLevel, params });
  };
}

export class ProductApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.product_service.product;

  /* ===================== POST API ===================== */

  public saveDraftProduct = (data: any) => {
    return this.request({ ...this.routes.draft.save, data });
  };

  /* ===================== POST API ===================== */

  /* ===================== DELETE API ===================== */

  /* ===================== GET API ===================== */
}
