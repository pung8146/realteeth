/**
 * 즐겨찾기 관련 타입 정의
 */

export interface FavoriteItem {
  /** 고유 식별자 (fullPath) */
  id: string
  /** 표시 이름 */
  name: string
  /** 위도 */
  lat: number
  /** 경도 */
  lon: number
}

export interface FavoritesState {
  /** 즐겨찾기 목록 */
  favorites: FavoriteItem[]
  /** 최대 저장 개수 */
  maxCount: number
}
