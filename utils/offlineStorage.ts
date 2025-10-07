import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'cache_';
const CACHE_EXPIRY_KEY = 'cache_expiry_';

interface CacheOptions {
  expiryInMinutes?: number;
}

export const offlineStorage = {
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const cacheKey = CACHE_PREFIX + key;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(value));
      
      if (options?.expiryInMinutes) {
        const expiryTime = Date.now() + options.expiryInMinutes * 60 * 1000;
        await AsyncStorage.setItem(CACHE_EXPIRY_KEY + key, expiryTime.toString());
      }
    } catch (error) {
      console.error('Error saving to offline storage:', error);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = CACHE_PREFIX + key;
      const expiryKey = CACHE_EXPIRY_KEY + key;
      
      const expiryTime = await AsyncStorage.getItem(expiryKey);
      if (expiryTime && Date.now() > parseInt(expiryTime, 10)) {
        await this.remove(key);
        return null;
      }
      
      const value = await AsyncStorage.getItem(cacheKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from offline storage:', error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_PREFIX + key,
        CACHE_EXPIRY_KEY + key,
      ]);
    } catch (error) {
      console.error('Error removing from offline storage:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        key => key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRY_KEY)
      );
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing offline storage:', error);
    }
  },

  async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null;
    } catch {
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  VIEW_HISTORY: 'view_history',
  RECENT_SEARCHES: 'recent_searches',
  DRAFT_POST: 'draft_post',
  USER_SESSION: 'user_session',
  LISTINGS_CACHE: 'listings_cache',
  NEWS_CACHE: 'news_cache',
} as const;
