import { X, MapPin, Star, DollarSign, ArrowUpDown } from 'lucide-react';
import { DISTANCE_OPTIONS, RATING_OPTIONS, PRICE_OPTIONS, SORT_OPTIONS } from '../../utils/constants';
import type { SearchFilters } from '../../types';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose?: () => void;
  resultCount?: number;
}

export default function FilterPanel({ filters, onFiltersChange, onClose, resultCount }: FilterPanelProps) {
  const update = (partial: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const resetFilters = () => {
    onFiltersChange({
      maxDistance: 0,
      minRating: 0,
      priceRange: '',
      sortBy: 'relevance',
    });
  };

  const hasActiveFilters = filters.maxDistance > 0 || filters.minRating > 0 || filters.priceRange !== '' || filters.sortBy !== 'relevance';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-accent-dark/20 p-5 sm:p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-primary" />
          Filters & Sort
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
            >
              Reset all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent text-text-muted hover:text-text-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Distance filter */}
        <FilterGroup icon={<MapPin className="w-4 h-4" />} label="Distance">
          <div className="flex flex-wrap gap-1.5">
            {DISTANCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ maxDistance: opt.value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                  ${filters.maxDistance === opt.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-accent text-text-secondary hover:bg-accent-dark'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Rating filter */}
        <FilterGroup icon={<Star className="w-4 h-4" />} label="Min Rating">
          <div className="flex flex-wrap gap-1.5">
            {RATING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ minRating: opt.value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                  ${filters.minRating === opt.value
                    ? 'bg-star text-white shadow-sm'
                    : 'bg-accent text-text-secondary hover:bg-accent-dark'
                  }`}
              >
                {opt.value > 0 && '⭐ '}{opt.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Price filter */}
        <FilterGroup icon={<DollarSign className="w-4 h-4" />} label="Price Range">
          <div className="flex flex-wrap gap-1.5">
            {PRICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ priceRange: opt.value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                  ${filters.priceRange === opt.value
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-accent text-text-secondary hover:bg-accent-dark'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Sort by */}
        <FilterGroup icon={<ArrowUpDown className="w-4 h-4" />} label="Sort By">
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ sortBy: opt.value as SearchFilters['sortBy'] })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                  ${filters.sortBy === opt.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-accent text-text-secondary hover:bg-accent-dark'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterGroup>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">Active:</span>
          {filters.maxDistance > 0 && (
            <FilterTag label={`≤ ${filters.maxDistance} km`} onRemove={() => update({ maxDistance: 0 })} />
          )}
          {filters.minRating > 0 && (
            <FilterTag label={`⭐ ${filters.minRating}+`} onRemove={() => update({ minRating: 0 })} />
          )}
          {filters.priceRange && (
            <FilterTag label={filters.priceRange} onRemove={() => update({ priceRange: '' })} />
          )}
          {filters.sortBy !== 'relevance' && (
            <FilterTag
              label={SORT_OPTIONS.find(s => s.value === filters.sortBy)?.label || filters.sortBy}
              onRemove={() => update({ sortBy: 'relevance' })}
            />
          )}
          {resultCount !== undefined && (
            <span className="ml-auto text-xs text-text-muted">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-semibold text-text-primary">{label}</span>
      </div>
      {children}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent rounded-full text-xs font-medium text-text-primary">
      {label}
      <button onClick={onRemove} className="hover:text-primary transition-colors cursor-pointer">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
