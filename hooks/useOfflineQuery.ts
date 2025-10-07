import { useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { offlineStorage } from '@/utils/offlineStorage';

interface UseOfflineQueryOptions<TData> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  cacheExpiryInMinutes?: number;
}

export function useOfflineQuery<TData>({
  queryKey,
  queryFn,
  cacheExpiryInMinutes = 30,
  ...options
}: UseOfflineQueryOptions<TData>) {
  const cacheKey = queryKey.join('_');

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await queryFn();
        await offlineStorage.set(cacheKey, data, { expiryInMinutes: cacheExpiryInMinutes });
        return data;
      } catch (error) {
        const cachedData = await offlineStorage.get<TData>(cacheKey);
        if (cachedData) {
          console.log('Using cached data due to network error');
          return cachedData;
        }
        throw error;
      }
    },
    ...options,
  });

  useEffect(() => {
    if (!query.data && !query.isLoading) {
      offlineStorage.get<TData>(cacheKey).then(cachedData => {
        if (cachedData && !query.data) {
          console.log('Loading initial data from cache');
        }
      });
    }
  }, [cacheKey, query.data, query.isLoading]);

  return query;
}
