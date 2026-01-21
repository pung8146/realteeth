import { useState, useEffect, useRef } from 'react'

interface EditNicknameModalProps {
  isOpen: boolean
  currentName: string
  onSave: (newName: string) => void
  onClose: () => void
}

/**
 * 즐겨찾기 별칭 수정 모달
 */
export const EditNicknameModal = ({
  isOpen,
  currentName,
  onSave,
  onClose,
}: EditNicknameModalProps) => {
  const [nickname, setNickname] = useState(currentName)
  const inputRef = useRef<HTMLInputElement>(null)

  // 모달 열릴 때 초기값 설정 및 포커스
  useEffect(() => {
    if (isOpen) {
      setNickname(currentName)
      // 약간의 딜레이 후 포커스 (애니메이션 완료 후)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [isOpen, currentName])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nickname.trim()) {
      onSave(nickname.trim())
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">별칭 수정</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 본문 */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              새로운 별칭
            </label>
            <input
              ref={inputRef}
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="별칭을 입력하세요"
              maxLength={30}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         text-gray-900 placeholder-gray-400
                         transition-all duration-200"
            />
            <p className="mt-2 text-xs text-gray-400 text-right">
              {nickname.length}/30
            </p>
          </div>

          {/* 푸터 */}
          <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-lg
                         hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!nickname.trim()}
              className="px-4 py-2 text-sm font-medium text-white 
                         bg-blue-500 rounded-lg
                         hover:bg-blue-600 disabled:bg-gray-300 
                         disabled:cursor-not-allowed transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditNicknameModal
