import { useCallback } from 'react'
import { useWeatherQuery } from '@entities/weather'
import { SearchBar } from '@features/search-location'
import {
  useFavorites,
  FavoriteButton,
  FavoriteList,
} from '@features/manage-favorites'
import type { FavoriteItem } from '@features/manage-favorites'
import { formatDistrictName } from '@entities/district'
import { ForecastList, ForecastSkeleton } from '@widgets/weather-forecast'
import { WeatherCardSkeleton } from '@shared/ui'

/**
 * 로딩 상태 타입 정의
 */
type LoadingStatus = 
  | 'waiting_permission'   // 위치 권한 요청 대기 중
  | 'location_denied'      // 위치 권한 거부됨
  | 'fetching_weather'     // 좌표 확보 후 날씨 데이터 로딩 중
  | 'searching'            // 검색 중
  | 'ready'                // 데이터 준비 완료
  | 'error'                // 에러 발생

interface LoadingStatusInfo {
  status: LoadingStatus
  title: string
  message: string
  showSkeleton: boolean
  iconType: 'location' | 'weather' | 'search' | 'denied' | 'error' | 'none'
}

/**
 * 현재 로딩 상태 정보를 반환하는 함수
 */
const getLoadingStatusInfo = (params: {
  geoLoading: boolean
  geoLocation: { lat: number; lon: number } | null
  geoError: string | null
  currentWeatherLoading: boolean
  isSearching: boolean
  locationSource: 'geolocation' | 'search'
  hasCurrentWeather: boolean
  isError: boolean
}): LoadingStatusInfo => {
  const {
    geoLoading,
    geoLocation,
    geoError,
    currentWeatherLoading,
    isSearching,
    locationSource,
    hasCurrentWeather,
    isError,
  } = params

  // 1. 검색 중인 경우
  if (isSearching) {
    return {
      status: 'searching',
      title: '지역 검색 중',
      message: '선택한 지역의 좌표를 찾고 있습니다...',
      showSkeleton: true,
      iconType: 'search',
    }
  }

  // 2. 위치 권한 거부된 경우 (geolocation 모드에서만)
  if (geoError && locationSource === 'geolocation' && !hasCurrentWeather) {
    return {
      status: 'location_denied',
      title: '위치 권한 필요',
      message: '위치 권한이 거부되었습니다.\n검색창을 이용해 지역을 직접 선택해 주세요.',
      showSkeleton: false,
      iconType: 'denied',
    }
  }

  // 3. 위치 권한 요청 대기 중 (geolocation 모드에서만)
  if (geoLoading && !geoLocation && locationSource === 'geolocation') {
    return {
      status: 'waiting_permission',
      title: '위치 권한 요청 중',
      message: '현재 위치의 날씨를 확인하려면\n위치 권한을 허용해 주세요.',
      showSkeleton: true,
      iconType: 'location',
    }
  }

  // 4. 좌표 확보 후 날씨 데이터 로딩 중
  if (geoLocation && currentWeatherLoading && locationSource === 'geolocation') {
    return {
      status: 'fetching_weather',
      title: '내 위치를 찾았습니다',
      message: '날씨 정보를 가져오는 중입니다...',
      showSkeleton: true,
      iconType: 'weather',
    }
  }

  // 5. 검색된 위치의 날씨 로딩 중
  if (currentWeatherLoading && locationSource === 'search') {
    return {
      status: 'fetching_weather',
      title: '선택한 지역',
      message: '날씨 정보를 가져오는 중입니다...',
      showSkeleton: true,
      iconType: 'weather',
    }
  }

  // 6. 에러 상태
  if (isError && !hasCurrentWeather) {
    return {
      status: 'error',
      title: '오류 발생',
      message: '날씨 정보를 불러오는 데 실패했습니다.',
      showSkeleton: false,
      iconType: 'error',
    }
  }

  // 7. 데이터 준비 완료
  return {
    status: 'ready',
    title: '',
    message: '',
    showSkeleton: false,
    iconType: 'none',
  }
}

const MainPage = () => {
  const {
    currentWeather,
    forecast,
    todayMinMax,
    isError,
    geoError,
    geoLoading,
    geoLocation,
    currentWeatherLoading,
    isSearching,
    searchError,
    currentWeatherError,
    forecastError,
    locationSource,
    selectedDistrict,
    selectedLocation,
    selectDistrict,
    clearSelectedLocation,
    refetchAll,
  } = useWeatherQuery()

  // 로딩 상태 정보 계산
  const loadingStatus = getLoadingStatusInfo({
    geoLoading,
    geoLocation,
    geoError,
    currentWeatherLoading,
    isSearching,
    locationSource,
    hasCurrentWeather: !!currentWeather,
    isError,
  })

  const {
    favorites,
    isFull,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    updateNickname,
  } = useFavorites()

  // 현재 표시할 위치 이름 결정
  const displayLocationName =
    locationSource === 'search' && selectedDistrict
      ? formatDistrictName(selectedDistrict)
      : currentWeather?.cityName || '위치 확인 중...'

  // 현재 위치의 즐겨찾기 ID (fullPath 또는 cityName 기반)
  const currentLocationId =
    locationSource === 'search' && selectedDistrict
      ? selectedDistrict.fullPath
      : currentWeather?.cityName || ''

  // 즐겨찾기 여부 확인
  const isCurrentFavorite = isFavorite(currentLocationId)

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = useCallback(() => {
    if (!currentWeather) return

    const item: FavoriteItem = {
      id: currentLocationId,
      name: displayLocationName,
      lat: selectedLocation?.lat ?? currentWeather.lat,
      lon: selectedLocation?.lon ?? currentWeather.lon,
    }

    toggleFavorite(item)
  }, [currentWeather, currentLocationId, displayLocationName, selectedLocation, toggleFavorite])

  // 즐겨찾기 선택 핸들러
  const handleSelectFavorite = useCallback((item: FavoriteItem) => {
    // 검색된 위치로 설정하기 위해 District 형태로 변환
    // id가 fullPath 형태면 District로 파싱, 아니면 직접 좌표 사용
    const parts = item.id.split('-')
    
    if (parts.length >= 1 && parts.length <= 3) {
      // fullPath 형태의 id인 경우
      selectDistrict({
        fullPath: item.id,
        sido: parts[0],
        sigungu: parts[1] || null,
        eupmyeondong: parts[2] || null,
        level: parts.length as 1 | 2 | 3,
      })
    }
  }, [selectDistrict])

  // 에러 메시지 결정
  const errorMessage =
    geoError ||
    searchError ||
    currentWeatherError?.message ||
    forecastError?.message ||
    '알 수 없는 오류가 발생했습니다.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* 헤더 영역: 검색바 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <SearchBar
            placeholder="지역을 검색하세요 (예: 강남구)"
            onSelect={selectDistrict}
          />
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 내 위치로 돌아가기 버튼 */}
        {locationSource === 'search' && (
          <div className="mb-4">
            <button
              onClick={clearSelectedLocation}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm 
                         bg-white text-blue-600 rounded-full shadow-sm
                         hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              내 위치로 돌아가기
            </button>
          </div>
        )}

        {/* 로딩 상태별 안내 카드 */}
        {loadingStatus.status !== 'ready' && loadingStatus.status !== 'error' && (
          <>
            {/* 위치 권한 거부 상태 */}
            {loadingStatus.status === 'location_denied' ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                    </div>
                    <div className="text-white">
                      <h2 className="text-lg font-semibold">{loadingStatus.title}</h2>
                      <p className="text-white/80 text-sm">위치 서비스를 사용할 수 없습니다</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6 text-center whitespace-pre-line">
                    {loadingStatus.message.split('\n').map((line, i) => (
                      <span key={i}>
                        {line.includes('검색창') ? (
                          <>
                            <span className="text-blue-600 font-medium">검색창</span>
                            {line.replace('검색창', '')}
                          </>
                        ) : (
                          line
                        )}
                        {i < loadingStatus.message.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-blue-500 animate-bounce">
                      <svg
                        className="w-5 h-5 rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                      <span className="text-sm font-medium">검색창에서 지역을 검색하세요</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 기타 로딩 상태 (권한 요청 중, 날씨 로딩 중, 검색 중) */
              <>
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                    ${loadingStatus.iconType === 'location' ? 'bg-blue-100' : ''}
                    ${loadingStatus.iconType === 'weather' ? 'bg-green-100' : ''}
                    ${loadingStatus.iconType === 'search' ? 'bg-purple-100' : ''}
                  `}>
                    {/* 위치 아이콘 */}
                    {loadingStatus.iconType === 'location' && (
                      <svg
                        className="w-8 h-8 text-blue-500 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                    {/* 날씨 아이콘 */}
                    {loadingStatus.iconType === 'weather' && (
                      <svg
                        className="w-8 h-8 text-green-500 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ animationDuration: '2s' }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    )}
                    {/* 검색 아이콘 */}
                    {loadingStatus.iconType === 'search' && (
                      <svg
                        className="w-8 h-8 text-purple-500 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {loadingStatus.title}
                  </h2>
                  <p className="text-gray-500 whitespace-pre-line">
                    {loadingStatus.message.split('\n').map((line, i) => (
                      <span key={i}>
                        {line.includes('위치 권한을 허용') ? (
                          <>
                            {line.replace('위치 권한을 허용', '')}
                            <span className="text-blue-600 font-medium">위치 권한을 허용</span>
                          </>
                        ) : (
                          line
                        )}
                        {i < loadingStatus.message.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  {/* 로딩 인디케이터 */}
                  {(loadingStatus.status === 'fetching_weather' || loadingStatus.status === 'searching') && (
                    <div className="mt-4 flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
                {loadingStatus.showSkeleton && (
                  <>
                    <WeatherCardSkeleton />
                    <ForecastSkeleton />
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* 에러 상태 (위치 권한 거부가 아닌 다른 에러) */}
        {loadingStatus.status === 'error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-lg text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={refetchAll}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg 
                         hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 성공 상태: 날씨 정보 표시 */}
        {loadingStatus.status === 'ready' && currentWeather && (
          <>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* 위치 정보 */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 relative">
                {/* 즐겨찾기 버튼 */}
                <div className="absolute top-4 right-4">
                  <FavoriteButton
                    isFavorite={isCurrentFavorite}
                    isFull={isFull}
                    onClick={handleToggleFavorite}
                  />
                </div>

                <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {locationSource === 'search' ? '검색된 위치' : '현재 위치'}
                </div>
                <h1 className="text-3xl font-bold pr-10">{displayLocationName}</h1>
              </div>

              {/* 현재 날씨 */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-6xl font-light text-gray-800">
                      {currentWeather.temp}°
                    </p>
                    <p className="text-gray-500 mt-1">
                      {currentWeather.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      최고 <span className="text-red-500 font-medium">{todayMinMax?.max ?? currentWeather.tempMax}°</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      최저 <span className="text-blue-500 font-medium">{todayMinMax?.min ?? currentWeather.tempMin}°</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      체감 {currentWeather.feelsLike}°
                    </p>
                  </div>
                </div>

                {/* 추가 정보 */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">습도</p>
                    <p className="text-lg font-medium text-gray-700">
                      {currentWeather.humidity}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">풍속</p>
                    <p className="text-lg font-medium text-gray-700">
                      {currentWeather.windSpeed} m/s
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5일 예보 */}
            {forecast && (
              <ForecastList forecasts={forecast.hourlyForecasts} />
            )}

            {/* 즐겨찾기 목록 */}
            <FavoriteList
              favorites={favorites}
              currentLocationId={currentLocationId}
              onSelect={handleSelectFavorite}
              onRemove={removeFavorite}
              onUpdateNickname={updateNickname}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default MainPage
