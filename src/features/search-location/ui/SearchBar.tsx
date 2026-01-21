import { useState, useRef, useEffect } from 'react'
import { useDebounce } from '@shared/lib'
import { searchDistricts, formatDistrictName } from '@entities/district'
import type { District } from '@entities/district'

interface SearchBarProps {
  placeholder?: string
  onSelect?: (district: District) => void
}

export const SearchBar = ({
  placeholder = '시/군/구를 검색하세요',
  onSelect,
}: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<District[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 300ms 디바운스 적용
  const debouncedQuery = useDebounce(query, 300)

  // 디바운스된 검색어로 검색 실행
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const { items, total } = searchDistricts(debouncedQuery, { limit: 10 })
      setResults(items)
      setTotalCount(total)
      setIsOpen(true)
    } else {
      setResults([])
      setTotalCount(0)
      setIsOpen(false)
    }
  }, [debouncedQuery])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 검색 결과 항목 클릭 핸들러
  const handleSelect = (district: District) => {
    setQuery(formatDistrictName(district))
    setIsOpen(false)
    onSelect?.(district)
  }

  // 입력 필드 포커스 시 결과가 있으면 드롭다운 열기
  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true)
    }
  }

  // 입력 초기화
  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* 검색 입력 필드 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white text-gray-900 placeholder-gray-400
                     transition-all duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 
                       text-gray-400 hover:text-gray-600 transition-colors"
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
        )}
      </div>

      {/* 자동완성 드롭다운 */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                        rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* 검색 결과 수 표시 */}
          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
            총 {totalCount}개 결과 중 상위 {results.length}개 표시
          </div>

          {/* 결과 목록 */}
          <ul>
            {results.map((district) => (
              <li key={district.fullPath}>
                <button
                  onClick={() => handleSelect(district)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 
                             transition-colors duration-150 border-b border-gray-100 
                             last:border-b-0"
                >
                  <span className="text-gray-900">
                    {formatDistrictName(district)}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {district.level === 1 && '시/도'}
                    {district.level === 2 && '시/군/구'}
                    {district.level === 3 && '읍/면/동'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 검색 결과 없음 */}
      {isOpen && debouncedQuery && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                        rounded-lg shadow-lg">
          <div className="px-4 py-6 text-center text-gray-500">
            <p>"{debouncedQuery}"에 대한 검색 결과가 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
