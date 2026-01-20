import { useState, useEffect, useCallback } from 'react'

interface GeolocationState {
  location: { lat: number; lon: number } | null
  error: string | null
  loading: boolean
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000, // 10초
  maximumAge: 0,
}

/**
 * 브라우저의 Geolocation API를 사용하여 현재 위치를 가져오는 커스텀 훅
 * @param options Geolocation API 옵션
 * @returns { location, error, loading, refetch }
 */
export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  })

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  /**
   * Geolocation 에러 코드에 따른 에러 메시지 반환
   */
  const getErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
      case error.POSITION_UNAVAILABLE:
        return '위치 정보를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.'
      case error.TIMEOUT:
        return '위치 정보 요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.'
      default:
        return '알 수 없는 오류가 발생했습니다.'
    }
  }

  /**
   * 위치 정보 요청 성공 핸들러
   */
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      location: {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      },
      error: null,
      loading: false,
    })
  }, [])

  /**
   * 위치 정보 요청 실패 핸들러
   */
  const handleError = useCallback((error: GeolocationPositionError) => {
    setState({
      location: null,
      error: getErrorMessage(error),
      loading: false,
    })
  }, [])

  /**
   * 위치 정보 다시 요청
   */
  const refetch = useCallback(() => {
    // 브라우저 지원 여부 확인
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: '이 브라우저는 위치 서비스를 지원하지 않습니다.',
        loading: false,
      })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      mergedOptions
    )
  }, [handleSuccess, handleError, mergedOptions])

  useEffect(() => {
    // 브라우저 지원 여부 확인
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: '이 브라우저는 위치 서비스를 지원하지 않습니다.',
        loading: false,
      })
      return
    }

    // 위치 정보 요청
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      mergedOptions
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 마운트 시 한 번만 실행

  return {
    ...state,
    refetch,
  }
}

export default useGeolocation
