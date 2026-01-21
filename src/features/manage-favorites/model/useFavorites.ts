import { useState, useEffect, useCallback } from 'react'
import type { FavoriteItem } from './types'

const STORAGE_KEY = 'weather-favorites'
const MAX_FAVORITES = 6

/**
 * LocalStorage에서 즐겨찾기 목록 불러오기
 */
const loadFavorites = (): FavoriteItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('즐겨찾기 로드 실패:', error)
  }
  return []
}

/**
 * LocalStorage에 즐겨찾기 목록 저장
 */
const saveFavorites = (favorites: FavoriteItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('즐겨찾기 저장 실패:', error)
  }
}

/**
 * 즐겨찾기 관리 커스텀 훅
 * LocalStorage를 사용하여 최대 6개의 즐겨찾기를 저장, 삭제, 조회합니다.
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 초기 로드
  useEffect(() => {
    const loaded = loadFavorites()
    setFavorites(loaded)
    setIsLoaded(true)
  }, [])

  // 즐겨찾기 추가
  const addFavorite = useCallback((item: FavoriteItem): boolean => {
    // 이미 존재하는지 확인
    const exists = favorites.some((fav) => fav.id === item.id)
    if (exists) {
      return false
    }

    // 최대 개수 확인
    if (favorites.length >= MAX_FAVORITES) {
      return false
    }

    const newFavorites = [...favorites, item]
    setFavorites(newFavorites)
    saveFavorites(newFavorites)
    return true
  }, [favorites])

  // 즐겨찾기 삭제
  const removeFavorite = useCallback((id: string): boolean => {
    const index = favorites.findIndex((fav) => fav.id === id)
    if (index === -1) {
      return false
    }

    const newFavorites = favorites.filter((fav) => fav.id !== id)
    setFavorites(newFavorites)
    saveFavorites(newFavorites)
    return true
  }, [favorites])

  // 즐겨찾기 토글
  const toggleFavorite = useCallback((item: FavoriteItem): boolean => {
    const exists = favorites.some((fav) => fav.id === item.id)
    if (exists) {
      return removeFavorite(item.id)
    } else {
      return addFavorite(item)
    }
  }, [favorites, addFavorite, removeFavorite])

  // 즐겨찾기 여부 확인
  const isFavorite = useCallback((id: string): boolean => {
    return favorites.some((fav) => fav.id === id)
  }, [favorites])

  // 즐겨찾기가 가득 찼는지 확인
  const isFull = favorites.length >= MAX_FAVORITES

  return {
    favorites,
    isLoaded,
    isFull,
    maxCount: MAX_FAVORITES,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}

export default useFavorites
