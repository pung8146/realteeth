interface FavoriteButtonProps {
  isFavorite: boolean
  isFull: boolean
  onClick: () => void
}

/**
 * 즐겨찾기 추가/해제 버튼 (별 아이콘)
 * 항상 클릭 가능하며, 가득 찼을 때의 처리는 onClick 핸들러에서 수행
 */
export const FavoriteButton = ({
  isFavorite,
  isFull,
  onClick,
}: FavoriteButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 cursor-pointer
        ${isFavorite
          ? 'text-yellow-400 hover:text-yellow-500'
          : 'text-gray-400 hover:text-yellow-400'
        }`}
      title={
        isFavorite
          ? '즐겨찾기 해제'
          : isFull
            ? '즐겨찾기 추가 (최대 6개)'
            : '즐겨찾기 추가'
      }
    >
      <svg
        className="w-6 h-6"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  )
}

export default FavoriteButton
