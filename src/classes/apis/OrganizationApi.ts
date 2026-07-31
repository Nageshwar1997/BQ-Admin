import type { IListContactQueriesQuery, TContactQueryStatus } from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';

import { ApiRequest } from '../ApiRequest';

export class ContactApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.organization_service.contact;

  /* ================== GET CONTACT QUERIES LIST ================== */
  public getContactQueries(params: IListContactQueriesQuery) {
    return this.request({ ...this.routes.list, params });
  }

  /* ================== UPDATE CONTACT QUERY STATUS ================== */
  public updateContactQueryStatus(ticketId: string, status: TContactQueryStatus) {
    const { method, url } = this.routes.updateStatus;
    return this.request({ method, url: url({ ticketId }), data: { status } });
  }
}
