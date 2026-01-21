import type { HourlyForecast } from '@shared/api'

interface ForecastListProps {
  forecasts: HourlyForecast[]
}

/**
 * 시간을 포맷팅합니다.
 * @param dtTxt "2024-01-21 12:00:00" 형식
 */
const formatTime = (dtTxt: string): string => {
  const date = new Date(dtTxt)
  const hours = date.getHours()
  const isToday = new Date().toDateString() === date.toDateString()
  
  if (isToday && hours === new Date().getHours()) {
    return '지금'
  }
  
  return `${hours}시`
}

/**
 * 날짜를 포맷팅합니다.
 */
const formatDate = (dtTxt: string): string => {
  const date = new Date(dtTxt)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[date.getDay()]
  
  return `${month}/${day} (${weekday})`
}

/**
 * OpenWeatherMap 아이콘 URL을 생성합니다.
 */
const getIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

/**
 * 5일 예보 가로 스크롤 리스트 위젯
 */
export const ForecastList = ({ forecasts }: ForecastListProps) => {
  if (!forecasts || forecasts.length === 0) {
    return null
  }

  // 날짜별로 그룹화
  const groupedByDate: Record<string, HourlyForecast[]> = {}
  forecasts.forEach((forecast) => {
    const dateKey = formatDate(forecast.dtTxt)
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = []
    }
    groupedByDate[dateKey].push(forecast)
  })

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        5일 예보
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-4 overflow-hidden">
        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
            {forecasts.map((forecast, index) => {
              // 날짜가 바뀌는 첫 아이템인지 확인
              const currentDate = formatDate(forecast.dtTxt)
              const prevDate = index > 0 ? formatDate(forecasts[index - 1].dtTxt) : null
              const isNewDay = currentDate !== prevDate

              return (
                <div key={forecast.dt} className="flex">
                  {/* 날짜 구분선 */}
                  {isNewDay && index > 0 && (
                    <div className="flex items-center px-2">
                      <div className="h-16 w-px bg-gray-200" />
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center p-3 rounded-xl hover:bg-blue-50 transition-colors min-w-[70px]">
                    {/* 날짜 (새 날짜일 때만 표시) */}
                    {isNewDay && (
                      <span className="text-xs text-blue-500 font-medium mb-1">
                        {currentDate.split(' ')[0]}
                      </span>
                    )}
                    
                    {/* 시간 */}
                    <span className="text-sm text-gray-600 font-medium">
                      {formatTime(forecast.dtTxt)}
                    </span>
                    
                    {/* 날씨 아이콘 */}
                    <img
                      src={getIconUrl(forecast.icon)}
                      alt={forecast.description}
                      className="w-10 h-10 -my-1"
                    />
                    
                    {/* 기온 */}
                    <span className="text-lg font-semibold text-gray-800">
                      {forecast.temp}°
                    </span>
                    
                    {/* 강수확률 */}
                    {forecast.pop > 0 && (
                      <div className="flex items-center gap-0.5 mt-1">
                        <svg
                          className="w-3 h-3 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z" />
                        </svg>
                        <span className="text-xs text-blue-500 font-medium">
                          {forecast.pop}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForecastList
