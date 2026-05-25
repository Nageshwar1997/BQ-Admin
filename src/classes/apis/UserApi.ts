import { API_METHODS_AND_URLS, HEADERS_KEYS } from '@/constants/api.constants';
import { ApiRequest } from '../ApiRequest';
import type { TChangePassword, TEmail, TLogin, TOtp, TPasswords } from '@/types/schema.type';
import type { TRole } from '@/types/api.type';


export class AuthApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.auth;

  /* ===================== LOGIN API ===================== */

  public login = (data: TLogin) => {
    return this.request({
      ...this.routes.login.manual,
      data,
      headers: { [HEADERS_KEYS.loginRole]: 'ADMIN' as TRole },
    });
  };

  /* ===================== PASSWORD API ===================== */

  public forgotPasswordSendOtp = (data: TEmail) => {
    return this.request({ ...this.routes.password.forgot.sendOtp, data });
  };

  public forgotPasswordResendOtp = (token: string) => {
    return this.request({
      ...this.routes.password.forgot.resendOtp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordVerifyOtp = ({ token, ...data }: TOtp & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.verifyOtp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordSave = ({ token, ...data }: TPasswords & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.save,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public changePassword = (data: TChangePassword) => {
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
