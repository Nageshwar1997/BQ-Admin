import { ProductApi } from './ProductApi';
import { AuthApi, UserApi } from './UserApi';

export const authApi = new AuthApi();
export const userApi = new UserApi();

export const productApi = new ProductApi();
