import koreaDistricts from '@shared/assets/data/korea_districts.json'
import type {
  District,
  DistrictRawData,
  DistrictSearchResult,
  DistrictSearchOptions,
} from '../model/types'

// JSON 데이터 타입 캐스팅
const rawData: DistrictRawData = koreaDistricts as DistrictRawData

/**
 * 원본 문자열을 District 객체로 파싱
 */
const parseDistrict = (fullPath: string): District => {
  const parts = fullPath.split('-')

  return {
    fullPath,
    sido: parts[0],
    sigungu: parts[1] || null,
    eupmyeondong: parts[2] || null,
    level: parts.length as 1 | 2 | 3,
  }
}

/**
 * 모든 행정구역 데이터를 파싱된 형태로 반환
 */
export const getAllDistricts = (): District[] => {
  return rawData.map(parseDistrict)
}

/**
 * 검색어로 행정구역 검색
 * @param query 검색어 (시/도, 시/군/구, 읍/면/동 이름)
 * @param options 검색 옵션
 */
export const searchDistricts = (
  query: string,
  options: DistrictSearchOptions = {}
): DistrictSearchResult => {
  const { level, limit = 20 } = options
  const trimmedQuery = query.trim().toLowerCase()

  if (!trimmedQuery) {
    return { items: [], total: 0 }
  }

  // 정규화: 모든 구분자(공백, 하이픈)를 제거한 버전으로 비교
  const normalizedQuery = trimmedQuery.replace(/[\s-]+/g, '')

  let filtered = rawData.filter((path) => {
    const pathLower = path.toLowerCase()
    // 원본 데이터도 정규화 (하이픈 제거)
    const normalizedPath = pathLower.replace(/-/g, '')
    // 공백으로 변환된 버전
    const pathWithSpaces = pathLower.replace(/-/g, ' ')
    
    // 여러 방식으로 매칭 시도
    return normalizedPath.includes(normalizedQuery) ||  // 정규화된 비교 (가장 유연)
           pathLower.includes(trimmedQuery) ||          // 원본 데이터에서 직접 검색
           pathWithSpaces.includes(trimmedQuery)        // 공백 버전에서 검색
  })

  // 레벨 필터링
  if (level) {
    filtered = filtered.filter((path) => {
      const parts = path.split('-')
      return parts.length === level
    })
  }

  const total = filtered.length
  const items = filtered.slice(0, limit).map(parseDistrict)

  return { items, total }
}

/**
 * 시/도 목록 조회
 */
export const getSidoList = (): District[] => {
  return rawData
    .filter((path) => !path.includes('-'))
    .map(parseDistrict)
}

/**
 * 특정 시/도의 시/군/구 목록 조회
 * @param sido 시/도 이름 (예: "서울특별시")
 */
export const getSigunguList = (sido: string): District[] => {
  return rawData
    .filter((path) => {
      const parts = path.split('-')
      return parts.length === 2 && parts[0] === sido
    })
    .map(parseDistrict)
}

/**
 * 특정 시/군/구의 읍/면/동 목록 조회
 * @param sido 시/도 이름
 * @param sigungu 시/군/구 이름
 */
export const getEupmyeondongList = (
  sido: string,
  sigungu: string
): District[] => {
  return rawData
    .filter((path) => {
      const parts = path.split('-')
      return parts.length === 3 && parts[0] === sido && parts[1] === sigungu
    })
    .map(parseDistrict)
}

/**
 * fullPath로 특정 행정구역 조회
 * @param fullPath 전체 경로 (예: "서울특별시-종로구-청운동")
 */
export const getDistrictByPath = (fullPath: string): District | null => {
  const found = rawData.find((path) => path === fullPath)
  return found ? parseDistrict(found) : null
}

/**
 * 표시용 문자열 생성 (예: "서울특별시 종로구 청운동")
 */
export const formatDistrictName = (district: District): string => {
  const parts = [district.sido]
  if (district.sigungu) parts.push(district.sigungu)
  if (district.eupmyeondong) parts.push(district.eupmyeondong)
  return parts.join(' ')
}
