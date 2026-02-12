// Global types

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  distance?: string;
  distanceKm?: number;
  rating?: number;
  image?: string;
  address?: string;
  priceRange?: string;
  cuisine?: string;
  googleMapsUrl?: string;
  placeId?: string;
  totalRatings?: number;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchFilters {
  maxDistance: number;  // 0 = any
  minRating: number;    // 0 = any
  priceRange: string;   // '' = any
  sortBy: 'relevance' | 'rating-desc' | 'distance-asc';
}

export interface ChatGPTRequest {
  keyword: string;
  latitude: number;
  longitude: number;
}

export interface ChatGPTResponse {
  message: string;
  restaurants: Restaurant[];
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
