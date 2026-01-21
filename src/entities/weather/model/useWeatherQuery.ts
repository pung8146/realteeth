import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getCurrentWeather,
  getWeatherForecast,
  processCurrentWeather,
  processForecast,
  getCoordsByDistrictName,
} from '@shared/api'
import type { Coord } from '@shared/api'
import { useGeolocation } from '@shared/lib'
import type { District } from '@entities/district'

// 위치 소스 타입
type LocationSource = 'geolocation' | 'search'

/**
 * 현재 위치 기반 또는 검색된 위치 기반으로 날씨 데이터를 가져오는 커스텀 훅
 * Geolocation + Tanstack Query를 결합하여 날씨 정보를 관리합니다.
 */
export const useWeatherQuery = () => {
  const {
    location: geoLocation,
    error: geoError,
    loading: geoLoading,
    refetch: refetchLocation,
  } = useGeolocation()

  // 검색으로 선택된 위치 상태
  const [selectedLocation, setSelectedLocation] = useState<Coord | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [locationSource, setLocationSource] = useState<LocationSource>('geolocation')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // 실제 사용할 좌표 (검색 위치 우선, 없으면 현재 위치)
  const activeLocation = selectedLocation || geoLocation
  const lat = activeLocation?.lat
  const lon = activeLocation?.lon
  const isLocationReady = lat !== undefined && lon !== undefined

  // 현재 날씨 쿼리
  const currentWeatherQuery = useQuery({
    queryKey: ['weather', 'current', lat, lon],
    queryFn: async () => {
      const response = await getCurrentWeather(lat!, lon!)
      return processCurrentWeather(response)
    },
    enabled: isLocationReady,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
  })

  // 5일 예보 쿼리
  const forecastQuery = useQuery({
    queryKey: ['weather', 'forecast', lat, lon],
    queryFn: async () => {
      const response = await getWeatherForecast(lat!, lon!)
      return processForecast(response)
    },
    enabled: isLocationReady,
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
  })

  /**
   * 행정구역 선택 시 좌표를 검색하고 해당 위치의 날씨를 가져옵니다.
   */
  const selectDistrict = useCallback(async (district: District) => {
    setIsSearching(true)
    setSearchError(null)
    
    try {
      const coords = await getCoordsByDistrictName(district)
      setSelectedLocation(coords)
      setSelectedDistrict(district)
      setLocationSource('search')
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : '위치 검색에 실패했습니다.'
      )
    } finally {
      setIsSearching(false)
    }
  }, [])

  /**
   * 검색된 위치를 초기화하고 현재 위치로 돌아갑니다.
   */
  const clearSelectedLocation = useCallback(() => {
    setSelectedLocation(null)
    setSelectedDistrict(null)
    setLocationSource('geolocation')
    setSearchError(null)
  }, [])

  return {
    // 위치 정보
    location: activeLocation,
    geoLocation,
    selectedLocation,
    selectedDistrict,
    locationSource,
    geoError,
    geoLoading,
    isSearching,
    searchError,
    refetchLocation,

    // 위치 선택 함수
    selectDistrict,
    clearSelectedLocation,

    // 현재 날씨
    currentWeather: currentWeatherQuery.data,
    currentWeatherLoading: currentWeatherQuery.isLoading,
    currentWeatherError: currentWeatherQuery.error,
    refetchCurrentWeather: currentWeatherQuery.refetch,

    // 5일 예보
    forecast: forecastQuery.data,
    forecastLoading: forecastQuery.isLoading,
    forecastError: forecastQuery.error,
    refetchForecast: forecastQuery.refetch,

    // 전체 로딩/에러 상태
    isLoading: geoLoading || isSearching || currentWeatherQuery.isLoading || forecastQuery.isLoading,
    isError: !!geoError || !!searchError || currentWeatherQuery.isError || forecastQuery.isError,

    // 전체 데이터 새로고침
    refetchAll: () => {
      if (locationSource === 'geolocation') {
        refetchLocation()
      }
      currentWeatherQuery.refetch()
      forecastQuery.refetch()
    },
  }
}

export default useWeatherQuery
