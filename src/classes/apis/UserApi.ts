import { HEADERS_MAP, USER_ROLE_MAP } from '@beautinique/frontend-constants';
import type {
  TChangePasswordZodSchema,
  TEmailZodSchema,
  TLoginZodSchema,
  TOtpZodSchema,
  TPasswordsZodSchema,
} from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';

import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.auth;

  /* ===================== LOGIN API ===================== */

  public login = (data: TLoginZodSchema) => {
    return this.request({
      ...this.routes.login.manual,
      data,
      headers: { [HEADERS_MAP.loginRole]: USER_ROLE_MAP.ADMIN },
    });
  };

  /* ===================== PASSWORD API ===================== */

  public forgotPasswordSendOtp = (data: TEmailZodSchema) => {
    return this.request({ ...this.routes.password.forgot.sendOtp, data });
  };

  public forgotPasswordResendOtp = (token: string) => {
    return this.request({
      ...this.routes.password.forgot.resendOtp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordVerifyOtp = ({ token, ...data }: TOtpZodSchema & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.verifyOtp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordSave = ({ token, ...data }: TPasswordsZodSchema & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.save,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public changePassword = (data: TChangePasswordZodSchema) => {
    return this.request({ ...this.routes.password.change, data });
  };
}
export class UserApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.user;

  /* ===================== GET API ===================== */

  public getSessionUser = async () => {
    return this.request(this.routes.session);
  };
}
