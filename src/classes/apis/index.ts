import { CategoryApi } from './ProductApi';
import { AuthApi, UserApi } from './UserApi';

export const authApi = new AuthApi();
export const userApi = new UserApi();

export const categoryApi = new CategoryApi();
