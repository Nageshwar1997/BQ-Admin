import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import { ApiRequest } from '../ApiRequest';

export class MediaApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.media_service;

  /* ===================== POST API ===================== */

  public uploadSingle = (data: FormData) => {
    return this.request({ ...this.routes.upload.single, data });
    };
    
  public uploadMultiple = (data: FormData) => {
    return this.request({ ...this.routes.upload.multiple, data });
  };
}
