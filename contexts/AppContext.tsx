import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Listing } from '@/mocks/listings';

export type UserRole = 'user' | 'broker';
export type BrokerStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  brokerStatus?: BrokerStatus;
  zalo?: string;
  facebook?: string;
}

interface ViewHistory {
  listingId: string;
  timestamp: number;
}

interface AppState {
  user: User | null;
  favorites: string[];
  viewHistory: ViewHistory[];
  isLoading: boolean;
}

const STORAGE_KEYS = {
  USER: '@vungtauland:user',
  FAVORITES: '@vungtauland:favorites',
  VIEW_HISTORY: '@vungtauland:viewHistory',
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [state, setState] = useState<AppState>({
    user: null,
    favorites: [],
    viewHistory: [],
    isLoading: true,
  });

  const loadStoredData = useCallback(async () => {
    try {
      const [userStr, favoritesStr, historyStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.VIEW_HISTORY),
      ]);

      setState({
        user: userStr ? JSON.parse(userStr) : null,
        favorites: favoritesStr ? JSON.parse(favoritesStr) : [],
        viewHistory: historyStr ? JSON.parse(historyStr) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading stored data:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  const login = useCallback(async (user: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setState((prev) => ({ ...prev, user }));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setState((prev) => ({ ...prev, user: null }));
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...updates };
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, [state.user]);

  const toggleFavorite = useCallback(async (listingId: string) => {
    const newFavorites = state.favorites.includes(listingId)
      ? state.favorites.filter((id) => id !== listingId)
      : [...state.favorites, listingId];

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
      setState((prev) => ({ ...prev, favorites: newFavorites }));
      return !state.favorites.includes(listingId);
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  }, [state.favorites]);

  const isFavorite = useCallback((listingId: string) => {
    return state.favorites.includes(listingId);
  }, [state.favorites]);

  const addToHistory = useCallback(async (listingId: string) => {
    const existingIndex = state.viewHistory.findIndex((h) => h.listingId === listingId);
    let newHistory: ViewHistory[];

    if (existingIndex >= 0) {
      newHistory = [...state.viewHistory];
      newHistory[existingIndex] = { listingId, timestamp: Date.now() };
    } else {
      newHistory = [{ listingId, timestamp: Date.now() }, ...state.viewHistory];
    }

    newHistory = newHistory.slice(0, 50);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VIEW_HISTORY, JSON.stringify(newHistory));
      setState((prev) => ({ ...prev, viewHistory: newHistory }));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [state.viewHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.VIEW_HISTORY);
      setState((prev) => ({ ...prev, viewHistory: [] }));
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  const getRecentlyViewed = useCallback((listings: Listing[], limit: number = 10) => {
    const sortedHistory = [...state.viewHistory].sort((a, b) => b.timestamp - a.timestamp);
    const recentIds = sortedHistory.slice(0, limit).map((h) => h.listingId);
    return listings.filter((listing) => recentIds.includes(listing.id));
  }, [state.viewHistory]);

  return useMemo(() => ({
    ...state,
    login,
    logout,
    updateUser,
    toggleFavorite,
    isFavorite,
    addToHistory,
    clearHistory,
    getRecentlyViewed,
  }), [state, login, logout, updateUser, toggleFavorite, isFavorite, addToHistory, clearHistory, getRecentlyViewed]);
});
