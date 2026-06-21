import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type {
  IId,
  ITimeStamp,
  TApiCategory,
  TApiL1Category,
  TApiL2Category,
  TApiL3Category,
  TProductStatus,
} from '@/types/api.type';
import type { TSort } from '@/types/component.type';
import { ApiRequest } from '../ApiRequest';

export class CategoryApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.product_service.category;

  /* ===================== POST API ===================== */

  public addCategory = (data: Omit<TApiCategory, 'slug' | '_id'>) => {
    return this.request({ ...this.routes.add, data });
  };

  /* ===================== PATCH API ===================== */

  public updateCategory = ({ _id, ...data }: Partial<Omit<TApiCategory, 'slug'>> & IId) => {
    const { method, url } = this.routes.update;
    return this.request({ method, url: url({ categoryId: _id }), data });
  };

  /* ===================== DELETE API ===================== */

  public deleteCategory = (categoryId: string) => {
    const { method, url } = this.routes.delete;
    return this.request({ method, url: url({ categoryId }) });
  };

  /* ===================== GET API ===================== */

  public getCategoriesByParentLevel = (
    params: Partial<
      | Pick<TApiL1Category, 'level'>
      | Pick<TApiL2Category, 'level' | 'parent'>
      | Pick<TApiL3Category, 'level' | 'parent'>
    >,
  ) => {
    return this.request({ ...this.routes.get.byParentLevel, params });
  };
}

export class ProductApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.product_service.product;

  /* ===================== POST API ===================== */

  public saveDraftProduct = (data: any) => {
    return this.request({ ...this.routes.draft.save, data });
  };

  /* ===================== PATCH API ===================== */

  public publishDraftProduct = () => {
    return this.request(this.routes.draft.publish);
  };

  /* ===================== DELETE API ===================== */

  /* ===================== GET API ===================== */

  public getDraftProduct = () => {
    return this.request(this.routes.draft.get);
  };

  public getDashboardProducts = (params: {
    page?: string;
    limit?: string;
    search?: string;
    status?: TProductStatus;
    category?: string;
    sortBy?: keyof ITimeStamp;
    sortOrder?: TSort;
  }) => {
    return this.request({ ...this.routes.get.dashboard.products, params });
  };
}
