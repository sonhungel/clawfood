import { MapPin, Star, ExternalLink } from 'lucide-react';
import type { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export default function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  const handleClick = () => {
    if (restaurant.googleMapsUrl) {
      window.open(restaurant.googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 
                 hover:-translate-y-1 group animate-fade-in-up cursor-pointer"
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
        {/* Google Maps indicator */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ExternalLink className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-text-primary text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-text-muted text-xs leading-relaxed mb-3 line-clamp-2">
          {restaurant.description}
        </p>

        {/* Address */}
        {restaurant.address && (
          <p className="text-text-muted text-xs mb-3 line-clamp-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {restaurant.address}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {restaurant.distance && (
            <div className="flex items-center gap-1 text-distance">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{restaurant.distance}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {restaurant.rating && (
              <div className="flex items-center gap-1 text-star">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-medium">
                  {restaurant.rating}
                  {restaurant.totalRatings && (
                    <span className="text-text-muted ml-0.5">({restaurant.totalRatings})</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* View on Maps link */}
        <div className="mt-2 pt-2 border-t border-gray-50 text-center">
          <span className="text-xs text-primary font-medium group-hover:underline inline-flex items-center gap-1">
            View on Google Maps
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
