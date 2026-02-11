// Types dùng toàn dự án

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
  rating?: number;
  image?: string;
  address?: string;
  priceRange?: string;
  cuisine?: string;
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
