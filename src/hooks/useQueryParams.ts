import type { TStringRecord } from '@/types/hook.type';
import usePathParams from './usePathParams';

const useQueryParams = () => {
  const { navigate, search, pathname } = usePathParams();

  const getParams = (): TStringRecord => {
    const searchParams = new URLSearchParams(search);
    const params: TStringRecord = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    return params;
  };

  const setParams = (
    params: TStringRecord | ((prevParams: TStringRecord) => TStringRecord),
  ): void => {
    const currentParams = getParams();

    const updatedParams =
      typeof params === 'function' ? params(currentParams) : { ...currentParams, ...params };

    const searchParams = new URLSearchParams();

    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      }
    });

    navigate({ pathname, search: searchParams.toString() });
  };

  const removeParams = (keys: string | string[]): void => {
    setParams((prevParams) => {
      const updatedParams = { ...prevParams };

      (Array.isArray(keys) ? keys : [keys]).forEach((key) => {
        delete updatedParams[key];
      });

      return updatedParams;
    });
  };

  const clearParams = (): void => {
    navigate({ pathname, search: '' });
  };

  return {
    queryParams: getParams(),
    setParams,
    removeParams,
    clearParams,
  };
};

export default useQueryParams;
