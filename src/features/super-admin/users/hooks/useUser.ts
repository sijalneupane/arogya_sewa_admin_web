import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi, UserSearchParams } from '@/api/user.api';
import { User, PaginationMeta, UserListResponse } from '@/types/user.type';

const DEBOUNCE_MS = 500;
const PAGE_SIZE = 10;

interface UseUserReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  fetchUsers: (page?: number) => void;
}

export const useUser = (filters: Omit<UserSearchParams, 'page' | 'size'> = {}): UseUserReturn => {
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Debounce only search query changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search ?? '');
      setPage(1);
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const queryKey = [
    'users',
    debouncedSearch,
    filters.role ?? '',
    page,
    PAGE_SIZE,
  ] as const;

  const { data, isFetching, error: queryError, refetch } = useQuery<UserListResponse>({
    queryKey,
    queryFn: async () =>
      (await userApi.getAll({
        search: debouncedSearch,
        role: filters.role,
        page,
        size: PAGE_SIZE,
      })) as unknown as UserListResponse,
    staleTime: 30_000,
  });

  /**
   * fetchUsers(page) — navigate to a page (changes queryKey → React Query fetches).
   * fetchUsers()     — retry the current page (calls refetch() to bypass cache).
   */
  const fetchUsers = useCallback((pg?: number) => {
    if (pg !== undefined && pg !== page) {
      setPage(pg);
    } else {
      refetch();
    }
  }, [page, refetch]);

  return {
    users: data?.data ?? [],
    loading: isFetching,
    error: queryError ? (queryError instanceof Error ? queryError.message : 'Failed to fetch users') : null,
    pagination: data?.paginationMeta ?? null,
    fetchUsers,
  };
};
