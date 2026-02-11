import { Search, MapPin } from 'lucide-react';

interface SearchInputProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  address: string | null;
  locationLoading: boolean;
  onSearch: () => void;
  isSearching: boolean;
}

export default function SearchInput({
  keyword,
  onKeywordChange,
  address,
  locationLoading,
  onSearch,
  isSearching,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search input */}
        <div className="flex items-center gap-2 flex-1 px-3 py-2">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bạn đang tìm kiếm món gì? (VD: Phở rạng, cơm văn phòng...)"
            className="w-full text-sm outline-none bg-transparent text-text-primary placeholder:text-text-muted"
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-secondary border-t sm:border-t-0 sm:border-l border-gray-200 shrink-0">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate max-w-[160px]">
            {locationLoading ? 'Đang lấy vị trí...' : address || 'Chưa xác định'}
          </span>
        </div>

        {/* Search button */}
        <button
          onClick={onSearch}
          disabled={isSearching || !keyword.trim()}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     text-sm whitespace-nowrap shrink-0 cursor-pointer"
        >
          Hỏi AI ngay
        </button>
      </div>
    </div>
  );
}
