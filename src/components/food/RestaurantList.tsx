import type { Restaurant } from '../../types';
import RestaurantCard from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
  title?: string;
}

export default function RestaurantList({ restaurants, title = 'Recommendations' }: RestaurantListProps) {
  if (restaurants.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
        ))}
      </div>
    </section>
  );
}
