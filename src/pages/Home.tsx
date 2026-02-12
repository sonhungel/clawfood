import { useState, useCallback, useEffect, useMemo } from 'react';
import { Bot, Sparkles, Utensils, SlidersHorizontal } from 'lucide-react';
import { useLocation } from '../features/location/useLocation';
import SearchInput from '../features/search/SearchInput';
import { searchRestaurants } from '../features/chatgpt/chatgpt.service';
import RestaurantList from '../components/food/RestaurantList';
import FilterPanel from '../components/common/FilterPanel';
import Button from '../components/common/Button';
import { DEFAULT_CATEGORIES } from '../utils/constants';
import type { Restaurant, SearchStatus, SearchFilters } from '../types';

const DEFAULT_FILTERS: SearchFilters = {
  maxDistance: 0,
  minRating: 0,
  priceRange: '',
  sortBy: 'relevance',
};

/** Parse "1.5km" or "0.5km" into a number */
function parseDistanceKm(dist?: string): number {
  if (!dist) return Infinity;
  const match = dist.match(/([\d.]+)\s*km/i);
  return match ? parseFloat(match[1]) : Infinity;
}

/** Check if a price string matches a filter category */
function matchesPrice(priceRange?: string, filter?: string): boolean {
  if (!filter) return true;
  if (!priceRange) return true;
  const dollarCount = (priceRange.match(/\$/g) || []).length;
  if (filter === '$') return dollarCount <= 1;
  if (filter === '$$') return dollarCount === 2;
  if (filter === '$$$') return dollarCount >= 3;
  return true;
}

export default function Home() {
  const { location, loading: locationLoading, address } = useLocation();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsFetched, setRecsFetched] = useState(false);

  // Apply filters & sorting to the restaurant list
  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Filter by distance
    if (filters.maxDistance > 0) {
      result = result.filter((r) => parseDistanceKm(r.distance) <= filters.maxDistance);
    }

    // Filter by rating
    if (filters.minRating > 0) {
      result = result.filter((r) => (r.rating ?? 0) >= filters.minRating);
    }

    // Filter by price
    if (filters.priceRange) {
      result = result.filter((r) => matchesPrice(r.priceRange, filters.priceRange));
    }

    // Sort
    if (filters.sortBy === 'rating-desc') {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (filters.sortBy === 'distance-asc') {
      result.sort((a, b) => parseDistanceKm(a.distance) - parseDistanceKm(b.distance));
    }

    return result;
  }, [restaurants, filters]);

  // Auto-fetch recommendations when location becomes available
  useEffect(() => {
    if (!location || recsFetched || locationLoading) return;
    setRecsFetched(true);
    setRecsLoading(true);
    searchRestaurants('Popular restaurants nearby', location.latitude, location.longitude)
      .then((result) => setRecommendations(result.restaurants))
      .catch(() => setRecommendations([]))
      .finally(() => setRecsLoading(false));
  }, [location, recsFetched, locationLoading]);

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;

    setStatus('loading');
    setError(null);
    setRestaurants([]);

    try {
      const lat = location?.latitude || 10.7769;
      const lng = location?.longitude || 106.7009;
      const result = await searchRestaurants(keyword, lat, lng);
      setRestaurants(result.restaurants);
      setAiMessage(result.message);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }, [keyword, location]);

  const handleCategoryClick = (label: string) => {
    setKeyword(label);
  };

  const hasActiveFilters = filters.maxDistance > 0 || filters.minRating > 0 || filters.priceRange !== '' || filters.sortBy !== 'relevance';

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent via-warm-bg to-warm-bg">
        {/* Decorative food images */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 opacity-20">
            <img src="https://em-content.zobj.net/source/apple/391/steaming-bowl_1f35c.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute top-6 -right-6 w-32 h-32 sm:w-48 sm:h-48 opacity-20">
            <img src="https://em-content.zobj.net/source/apple/391/bento-box_1f371.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-10 -left-4 w-28 h-28 sm:w-40 sm:h-40 opacity-15 hidden sm:block">
            <img src="https://em-content.zobj.net/source/apple/391/bubble-tea_1f9cb.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-4 right-10 w-24 h-24 sm:w-36 sm:h-36 opacity-15 hidden sm:block">
            <img src="https://em-content.zobj.net/source/apple/391/green-salad_1f957.png" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16">
          {/* Title */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight mb-3">
              Find great food
              <br />
              <span className="text-primary">near you</span> with AI!
            </h1>
            <p className="text-text-muted text-sm sm:text-base max-w-md mx-auto">
              Just tell us what you're craving — AI will find the best spots
            </p>
          </div>

          {/* Search bar */}
          <SearchInput
            keyword={keyword}
            onKeywordChange={setKeyword}
            address={address}
            locationLoading={locationLoading}
            onSearch={handleSearch}
            isSearching={status === 'loading'}
          />

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6">
            {DEFAULT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.label)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full 
                           text-xs sm:text-sm text-text-secondary font-medium border border-accent-dark/50
                           hover:bg-primary hover:text-white hover:border-primary transition-all duration-200
                           cursor-pointer"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AI Bot Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-accent-dark/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Bot avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-accent rounded-full flex items-center justify-center relative">
                <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Bot message */}
            <div className="flex-1 text-center sm:text-left">
              {status === 'idle' && (
                <>
                  <div className="bg-accent rounded-2xl rounded-bl-md px-5 py-3 mb-4 inline-block">
                    <p className="text-sm sm:text-base font-medium text-text-primary">
                      🤖 Ask AI to find great food nearby
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Utensils className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setKeyword('Popular restaurants');
                        handleSearch();
                      }}
                    >
                      Quick Ask
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                      onClick={() => setShowFilters(!showFilters)}
                      className={hasActiveFilters ? 'text-primary font-semibold' : ''}
                    >
                      {showFilters ? 'Hide filters' : 'Set filters'}
                      {hasActiveFilters && (
                        <span className="ml-1 w-2 h-2 rounded-full bg-primary inline-block" />
                      )}
                    </Button>
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <div className="mt-3 animate-fade-in">
                      <FilterPanel
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClose={() => setShowFilters(false)}
                        resultCount={filteredRestaurants.length}
                      />
                    </div>
                  )}
                </>
              )}

              {status === 'loading' && (
                <div className="space-y-3">
                  <div className="bg-accent rounded-2xl rounded-bl-md px-5 py-3 inline-block">
                    <p className="text-sm font-medium text-primary">
                      AI is searching... 🔍
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 max-w-sm">
                    <TypingMessage text="Processing your request..." delay={0} />
                    <TypingMessage text="Finding the best spots near you..." delay={800} />
                    <TypingMessage text="Almost ready..." delay={1600} />
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="bg-accent rounded-2xl rounded-bl-md px-5 py-3 inline-block">
                  <p className="text-sm text-text-primary">
                    ✅ {aiMessage}
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 rounded-2xl rounded-bl-md px-5 py-3 inline-block">
                  <p className="text-sm text-red-600">
                    ❌ {error || 'Something went wrong. Please try again!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant results */}
      {restaurants.length > 0 && (
        <section className="pb-16">
          {filteredRestaurants.length > 0 ? (
            <RestaurantList restaurants={filteredRestaurants} />
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <SlidersHorizontal className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No restaurants match your filters</p>
              <p className="text-sm mt-1">Try adjusting your filters to see more results</p>
            </div>
          )}
        </section>
      )}

      {/* Recommendations based on location — only when idle and location available */}
      {status === 'idle' && location && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          {recsLoading ? (
            <div className="text-center py-12">
              <div className="flex justify-center gap-1 mb-3">
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" />
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" />
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" />
              </div>
              <p className="text-sm text-text-muted">Finding recommendations near you...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <RestaurantList restaurants={recommendations} title="Recommended near you" />
          ) : null}
        </section>
      )}
    </main>
  );
}

/** Typing message animation component */
function TypingMessage({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot" />
      </div>
      <span>{text}</span>
    </div>
  );
}
