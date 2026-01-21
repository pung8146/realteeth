/**
 * 행정구역 관련 타입 정의
 */

// JSON 데이터의 원본 타입 (문자열 배열)
export type DistrictRawData = string[]

// 파싱된 행정구역 정보
export interface District {
  /** 전체 경로 (예: "서울특별시-종로구-청운동") */
  fullPath: string
  /** 시/도 (예: "서울특별시") */
  sido: string
  /** 시/군/구 (예: "종로구") */
  sigungu: string | null
  /** 읍/면/동 (예: "청운동") */
  eupmyeondong: string | null
  /** 행정구역 레벨 (1: 시/도, 2: 시/군/구, 3: 읍/면/동) */
  level: 1 | 2 | 3
}

// 검색 결과 타입
export interface DistrictSearchResult {
  /** 검색된 행정구역 목록 */
  items: District[]
  /** 총 검색 결과 수 */
  total: number
}

// 검색 옵션 타입
export interface DistrictSearchOptions {
  /** 검색할 행정구역 레벨 (미지정 시 전체 레벨 검색) */
  level?: 1 | 2 | 3
  /** 최대 결과 수 (기본값: 20) */
  limit?: number
}
