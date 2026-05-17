import { productApi } from '@/classes/apis';
import { PRODUCT_SERVICE_QUERY_KEYS } from '@/constants/api.constants';
import type { ICategory } from '@/types/api.type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const { get } = PRODUCT_SERVICE_QUERY_KEYS.category;

export const useGetCategoriesByParentLevel = ({
  enabled = true,
  level,
  parentId,
}: {
  enabled?: boolean;
  level?: ICategory['level'];
  parentId?: string;
}) => {
  return useQuery({
    queryKey: [...get.all, level, parentId],
    queryFn: () => productApi.getCategoriesByParentLevel({ level, parentId }),
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled: enabled,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => data?.categories || [],
  });
};
