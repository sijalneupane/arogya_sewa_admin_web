import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { User, UserResponse } from '@/types/user.type';

interface UseUserByIdReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserById = (userId: string): UseUserByIdReturn => {
  const { data, isFetching, error: queryError, refetch } = useQuery<UserResponse>({
    queryKey: ['user', userId],
    queryFn: async () =>
      (await userApi.getById(userId)) as unknown as UserResponse,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  });

  return {
    user: data?.data ?? null,
    loading: isFetching,
    error: queryError ? (queryError instanceof Error ? queryError.message : 'Failed to fetch user') : null,
    refetch,
  };
};
