import { API_METHODS_AND_URLS, HEADERS_KEYS } from '@/constants/api.constants';
import type { TRole } from '@/types/api.type';
import type { TChangePassword, TEmail, TLogin, TOtp, TPasswords } from '@/types/schema.type';
import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.gateway.user_service.auth;

  constructor() {
    super('gateway-user-service');
  }

  /* ===================== LOGIN API ===================== */

  public login = (data: TLogin) => {
    return this.request({
      ...this.routes.login.manual,
      data,
      headers: { [HEADERS_KEYS.loginRole]: 'SELLER' as TRole },
    });
  };

  /* ===================== PASSWORD API ===================== */

  public forgotPasswordSendOtp = (data: TEmail) => {
    return this.request({ ...this.routes.password.forgot.send_otp, data });
  };

  public forgotPasswordResendOtp = (token: string) => {
    return this.request({
      ...this.routes.password.forgot.resend_otp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordVerifyOtp = ({ token, ...data }: TOtp & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.verify_otp,
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

  /* ===================== USER ===================== */

  // public getMe = () => {
  //   return this.request({
  //     method: 'GET',
  //     url: '/auth/me',
  //   });
  // };

  // public logout = () => {
  //   return this.request({
  //     method: 'POST',
  //     url: '/auth/logout',
  //   });
  // };
}
