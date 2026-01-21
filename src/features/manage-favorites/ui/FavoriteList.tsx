import { useState } from 'react'
import type { FavoriteItem } from '../model/types'
import { EditNicknameModal } from './EditNicknameModal'

interface FavoriteListProps {
  favorites: FavoriteItem[]
  currentLocationId?: string
  onSelect: (item: FavoriteItem) => void
  onRemove: (id: string) => void
  onUpdateNickname: (id: string, newNickname: string) => void
}

/**
 * 즐겨찾기 목록 위젯
 */
export const FavoriteList = ({
  favorites,
  currentLocationId,
  onSelect,
  onRemove,
  onUpdateNickname,
}: FavoriteListProps) => {
  const [editingItem, setEditingItem] = useState<FavoriteItem | null>(null)

  if (favorites.length === 0) {
    return null
  }

  const handleEditClick = (e: React.MouseEvent, item: FavoriteItem) => {
    e.stopPropagation()
    setEditingItem(item)
  }

  const handleSaveNickname = (newName: string) => {
    if (editingItem) {
      onUpdateNickname(editingItem.id, newName)
    }
  }

  return (
    <>
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          즐겨찾기
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {favorites.map((item) => {
            const isActive = item.id === currentLocationId

            return (
              <div
                key={item.id}
                className={`relative group bg-white rounded-xl shadow-sm p-4 cursor-pointer
                            transition-all duration-200 hover:shadow-md
                            ${isActive ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onSelect(item)}
              >
                {/* 액션 버튼들 */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {/* 수정 버튼 */}
                  <button
                    onClick={(e) => handleEditClick(e, item)}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(item.id)
                    }}
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

                {/* 현재 선택 표시 */}
                {isActive && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-500">현재 보는 중</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 별칭 수정 모달 */}
      <EditNicknameModal
        isOpen={!!editingItem}
        currentName={editingItem?.name || ''}
        onSave={handleSaveNickname}
        onClose={() => setEditingItem(null)}
      />
    </>
  )
}

export default FavoriteList
