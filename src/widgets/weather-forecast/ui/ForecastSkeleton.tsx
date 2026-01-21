/**
 * 5일 예보 로딩 스켈레톤
 */
export const ForecastSkeleton = () => {
  return (
    <div className="mt-6 animate-pulse">
      {/* 타이틀 스켈레톤 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-gray-200 rounded" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-3 min-w-[70px]"
            >
              <div className="h-4 w-8 bg-gray-200 rounded mb-2" />
              <div className="w-10 h-10 bg-gray-200 rounded-full mb-2" />
              <div className="h-5 w-10 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ForecastSkeleton
