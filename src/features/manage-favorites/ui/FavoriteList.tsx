import { useState } from 'react'
import type { FavoriteItem } from '../model/types'
import { EditNicknameModal } from './EditNicknameModal'
import { FavoriteCard } from './FavoriteCard'

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

  const handleRemoveClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onRemove(id)
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
          {favorites.map((item) => (
            <FavoriteCard
              key={item.id}
              item={item}
              isActive={item.id === currentLocationId}
              onSelect={() => onSelect(item)}
              onEdit={(e) => handleEditClick(e, item)}
              onRemove={(e) => handleRemoveClick(e, item.id)}
            />
          ))}
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
