import { useState, useCallback, useEffect } from 'react';
import { Bot, Sparkles, Utensils, Filter } from 'lucide-react';
import { useLocation } from '../features/location/useLocation';
import SearchInput from '../features/search/SearchInput';
import { searchRestaurants } from '../features/chatgpt/chatgpt.service';
import RestaurantList from '../components/food/RestaurantList';
import Button from '../components/common/Button';
import { DEFAULT_CATEGORIES } from '../utils/constants';
import type { Restaurant, SearchStatus } from '../types';

export default function Home() {
  const { location, loading: locationLoading, address } = useLocation();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setStatus('error');
    }
  }, [keyword, location]);

  const handleCategoryClick = (label: string) => {
    setKeyword(label);
  };

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
              Tìm quán ngon
              <br />
              <span className="text-primary">gần bạn</span> với AI!
            </h1>
            <p className="text-text-muted text-sm sm:text-base max-w-md mx-auto">
              Chỉ cần cho biết bạn muốn ăn gì, AI sẽ gợi ý ngay
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
                      🤖 Hỏi AI tìm quán ngon ngay
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Utensils className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setKeyword('Quán ăn phổ biến');
                        handleSearch();
                      }}
                    >
                      Quick Ask
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Filter className="w-3.5 h-3.5" />}
                    >
                      Set filters
                    </Button>
                  </div>
                </>
              )}

              {status === 'loading' && (
                <div className="space-y-3">
                  <div className="bg-accent rounded-2xl rounded-bl-md px-5 py-3 inline-block">
                    <p className="text-sm font-medium text-primary">
                      AI đang tìm kiếm... 🔍
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 max-w-sm">
                    <TypingMessage text="Đang xử lý nhu cầu..." delay={0} />
                    <TypingMessage text="Tìm quán tốt nhất gần bạn..." delay={800} />
                    <TypingMessage text="Sắp có kết quả rồi..." delay={1600} />
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
                    ❌ {error || 'Có lỗi xảy ra. Vui lòng thử lại!'}
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
          <RestaurantList restaurants={restaurants} />
        </section>
      )}

      {/* Empty state when idle */}
      {status === 'idle' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">Gợi ý cho bạn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Bún Chả Hương Liên',
                desc: 'Quán bún chả nổi tiếng, thịt nướng thơm phức thấm đẫm gia vị.',
                distance: '0.5km',
                rating: 4.5,
                img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
                price: '35k-55k',
              },
              {
                title: 'Bún Chả Hương Liên',
                desc: 'Thịt nướng sấy để cuộn với bún tươi, rau sống theo kiểu truyền thống.',
                distance: '3.5km',
                rating: 4.5,
                img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
                price: '35k-55k',
              },
              {
                title: 'Bún Chả Hương Liên',
                desc: 'Không gian quán rộng rãi, phục vụ nhanh gọn với nhiều món ăn kèm.',
                distance: '0.5km',
                rating: 4.5,
                img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
                price: '30k-50k',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 
                           hover:-translate-y-1 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-text-primary px-2.5 py-1 rounded-full">
                    {item.price}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-text-primary text-base mb-1.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-3 line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-distance text-xs font-medium flex items-center gap-1">📍 {item.distance}</span>
                    <span className="text-star text-xs font-medium flex items-center gap-1">⭐ {item.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
