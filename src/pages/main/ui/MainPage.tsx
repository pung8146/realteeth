import { useEffect } from 'react'
import { useWeatherQuery } from '@entities/weather'
import { SearchBar } from '@features/search-location'
import { formatDistrictName } from '@entities/district'

const MainPage = () => {
  const {
    currentWeather,
    forecast,
    isLoading,
    isError,
    geoError,
    searchError,
    currentWeatherError,
    forecastError,
    locationSource,
    selectedDistrict,
    selectDistrict,
    clearSelectedLocation,
    refetchAll,
  } = useWeatherQuery()

  // 데이터 성공 시 콘솔에 출력
  useEffect(() => {
    if (currentWeather) {
      console.log('현재 날씨:', currentWeather)
    }
    if (forecast) {
      console.log('5일 예보:', forecast)
    }
  }, [currentWeather, forecast])

  // 현재 표시할 위치 이름 결정
  const displayLocationName =
    locationSource === 'search' && selectedDistrict
      ? formatDistrictName(selectedDistrict)
      : currentWeather?.cityName || '위치 확인 중...'

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

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-lg text-gray-600">날씨 정보를 불러오는 중입니다...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {isError && !isLoading && (
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
        {!isLoading && !isError && currentWeather && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* 위치 정보 */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
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
              <h1 className="text-3xl font-bold">{displayLocationName}</h1>
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
                    최고 <span className="text-red-500 font-medium">{currentWeather.tempMax}°</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    최저 <span className="text-blue-500 font-medium">{currentWeather.tempMin}°</span>
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
        )}
      </main>
    </div>
  )
}

export default MainPage
