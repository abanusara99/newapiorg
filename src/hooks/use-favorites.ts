"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Article } from '@/types';

const FAVORITES_KEY = 'news-wave-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(FAVORITES_KEY);
      if (items) {
        setFavorites(JSON.parse(items));
      }
    } catch (error) {
      console.error('Failed to read favorites from localStorage', error);
    }
  }, []);

  const saveFavorites = (newFavorites: Article[]) => {
    try {
      setFavorites(newFavorites);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
    }
  };

  const addFavorite = useCallback((article: Article) => {
    saveFavorites([...favorites, article]);
  }, [favorites]);

  const removeFavorite = useCallback((articleId: string) => {
    saveFavorites(favorites.filter((fav) => fav.id !== articleId));
  }, [favorites]);

  const isFavorite = useCallback((articleId: string) => {
    return favorites.some((fav) => fav.id === articleId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
