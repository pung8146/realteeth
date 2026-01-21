/**
 * 날씨 카드 로딩 스켈레톤
 */
export const WeatherCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-gray-200/50 rounded" />
          <div className="h-4 w-16 bg-gray-200/50 rounded" />
        </div>
        <div className="h-8 w-48 bg-gray-200/50 rounded" />
      </div>

      {/* 본문 스켈레톤 */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-16 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="text-right space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
            <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
            <div className="h-4 w-16 bg-gray-200 rounded ml-auto mt-4" />
          </div>
        </div>

        {/* 추가 정보 스켈레톤 */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="h-4 w-8 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-6 w-12 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="text-center">
            <div className="h-4 w-8 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-6 w-16 bg-gray-200 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCardSkeleton
