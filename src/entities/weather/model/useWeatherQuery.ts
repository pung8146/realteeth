import { useQuery } from '@tanstack/react-query'
import {
  getCurrentWeather,
  getWeatherForecast,
  processCurrentWeather,
  processForecast,
} from '@shared/api'
import { useGeolocation } from '@shared/lib'

/**
 * 현재 위치 기반으로 날씨 데이터를 가져오는 커스텀 훅
 * Geolocation + Tanstack Query를 결합하여 날씨 정보를 관리합니다.
 */
export const useWeatherQuery = () => {
  const {
    location,
    error: geoError,
    loading: geoLoading,
    refetch: refetchLocation,
  } = useGeolocation()

  const lat = location?.lat
  const lon = location?.lon
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

  return {
    // 위치 정보
    location,
    geoError,
    geoLoading,
    refetchLocation,

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
    isLoading: geoLoading || currentWeatherQuery.isLoading || forecastQuery.isLoading,
    isError: !!geoError || currentWeatherQuery.isError || forecastQuery.isError,

    // 전체 데이터 새로고침
    refetchAll: () => {
      refetchLocation()
      currentWeatherQuery.refetch()
      forecastQuery.refetch()
    },
  }
}

export default useWeatherQuery
