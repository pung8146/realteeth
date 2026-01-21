import { useQuery } from '@tanstack/react-query'
import { getCurrentWeather, getWeatherForecast, processCurrentWeather } from '@shared/api'
import type { FavoriteItem } from '../model/types'

interface FavoriteCardProps {
  item: FavoriteItem
  isActive: boolean
  onSelect: () => void
  onEdit: (e: React.MouseEvent) => void
  onRemove: (e: React.MouseEvent) => void
}

/**
 * 오늘 날짜의 예보에서 최저/최고 기온을 계산합니다.
 */
const getTodayMinMax = (forecastList: { dt: number; main: { temp_min: number; temp_max: number } }[]) => {
  const today = new Date()
  const todayStr = today.toDateString()

  const todayForecasts = forecastList.filter((item) => {
    const itemDate = new Date(item.dt * 1000)
    return itemDate.toDateString() === todayStr
  })

  if (todayForecasts.length === 0) {
    // 오늘 데이터가 없으면 첫 8개(24시간) 사용
    const next24h = forecastList.slice(0, 8)
    const temps = next24h.map((f) => f.main.temp_min).concat(next24h.map((f) => f.main.temp_max))
    return {
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps)),
    }
  }

  const minTemps = todayForecasts.map((f) => f.main.temp_min)
  const maxTemps = todayForecasts.map((f) => f.main.temp_max)

  return {
    min: Math.round(Math.min(...minTemps)),
    max: Math.round(Math.max(...maxTemps)),
  }
}

/**
 * 즐겨찾기 카드 컴포넌트
 * 각 카드별로 날씨 정보를 가져와 표시합니다.
 */
export const FavoriteCard = ({
  item,
  isActive,
  onSelect,
  onEdit,
  onRemove,
}: FavoriteCardProps) => {
  // 해당 지역의 현재 날씨 정보 가져오기
  const { data: weather, isLoading: isWeatherLoading, isError: isWeatherError } = useQuery({
    queryKey: ['weather', 'favorite', item.lat, item.lon],
    queryFn: async () => {
      const response = await getCurrentWeather(item.lat, item.lon)
      return processCurrentWeather(response)
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  // 예보 데이터에서 오늘의 최저/최고 기온 가져오기
  const { data: todayMinMax, isLoading: isForecastLoading } = useQuery({
    queryKey: ['weather', 'favorite-forecast', item.lat, item.lon],
    queryFn: async () => {
      const response = await getWeatherForecast(item.lat, item.lon)
      return getTodayMinMax(response.list)
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  const isLoading = isWeatherLoading || isForecastLoading
  const isError = isWeatherError

  return (
    <div
      className={`relative group bg-white rounded-xl shadow-sm p-4 cursor-pointer
                  transition-all duration-200 hover:shadow-md
                  ${isActive ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      {/* 액션 버튼들 */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        {/* 수정 버튼 */}
        <button
          onClick={onEdit}
          className="p-1 rounded-full bg-gray-100 hover:bg-blue-100 
                     text-gray-400 hover:text-blue-500 transition-colors"
          title="별칭 수정"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>

        {/* 삭제 버튼 */}
        <button
          onClick={onRemove}
          className="p-1 rounded-full bg-gray-100 hover:bg-red-100 
                     text-gray-400 hover:text-red-500 transition-colors"
          title="즐겨찾기에서 삭제"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 지역 이름 */}
      <p className="text-sm font-medium text-gray-800 truncate pr-12">
        {item.name}
      </p>

      {/* 날씨 정보 */}
      <div className="mt-2">
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        )}
        {isError && (
          <p className="text-xs text-gray-400">해당 장소의 정보가 제공되지 않습니다.</p>
        )}
        {weather && !isLoading && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-gray-700">
              {weather.temp}°
            </span>
            {todayMinMax && (
              <span className="text-xs text-gray-400">
                <span className="text-red-400">최고 {todayMinMax.max}°</span>
                {' / '}
                <span className="text-blue-400">최저 {todayMinMax.min}°</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 현재 선택 표시 */}
      {isActive && (
        <div className="flex items-center gap-1 mt-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs text-blue-500">현재 보는 중</span>
        </div>
      )}
    </div>
  )
}

export default FavoriteCard
