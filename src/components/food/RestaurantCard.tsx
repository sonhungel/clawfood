import { MapPin, Star } from 'lucide-react';
import type { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export default function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 
                 hover:-translate-y-1 group animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {restaurant.priceRange && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium 
                           text-text-primary px-2.5 py-1 rounded-full">
            {restaurant.priceRange}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-text-primary text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-text-muted text-xs leading-relaxed mb-3 line-clamp-2">
          {restaurant.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {restaurant.distance && (
            <div className="flex items-center gap-1 text-distance">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{restaurant.distance}</span>
            </div>
          )}
          {restaurant.rating && (
            <div className="flex items-center gap-1 text-star">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-medium">{restaurant.rating}/5</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
