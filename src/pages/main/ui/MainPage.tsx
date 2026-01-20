import { useEffect } from 'react'
import { useWeatherQuery } from '@entities/weather'

const MainPage = () => {
  const {
    currentWeather,
    forecast,
    isLoading,
    isError,
    geoError,
    currentWeatherError,
    forecastError,
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

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">날씨 정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  // 에러 상태
  if (isError) {
    const errorMessage = geoError 
      || currentWeatherError?.message 
      || forecastError?.message 
      || '알 수 없는 오류가 발생했습니다.'

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-600">{errorMessage}</p>
        <button
          onClick={refetchAll}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  // 성공 상태
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentWeather?.cityName}
        </h1>
        <p className="text-5xl font-light text-gray-700 mt-4">
          {currentWeather?.temp}°C
        </p>
      </div>
    </div>
  )
}

export default MainPage
