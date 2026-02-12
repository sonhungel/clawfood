// App constants

export const APP_NAME = 'ClawFood';

export const DEFAULT_CATEGORIES = [
  { id: 'coffee', label: 'Chill Coffee', icon: '☕' },
  { id: 'grilled', label: 'BBQ & Grill', icon: '🍖' },
  { id: 'lunch', label: 'Lunch Deals', icon: '🍱' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
];

export const GEMINI_MODEL = 'gemini-2.0-flash';

export const SEARCH_PLACEHOLDER = 'What are you craving?\n(e.g. pho, boba tea, BBQ...)';

export const DEFAULT_LOCATION_TEXT = 'Getting location...';

export const DEBOUNCE_DELAY = 300;

export const DISTANCE_OPTIONS = [
  { label: 'Any distance', value: 0 },
  { label: 'Within 1 km', value: 1 },
  { label: 'Within 3 km', value: 3 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
];

export const RATING_OPTIONS = [
  { label: 'Any rating', value: 0 },
  { label: '3+ stars', value: 3 },
  { label: '3.5+ stars', value: 3.5 },
  { label: '4+ stars', value: 4 },
  { label: '4.5+ stars', value: 4.5 },
];

export const PRICE_OPTIONS = [
  { label: 'Any price', value: '' },
  { label: 'Budget ($)', value: '$' },
  { label: 'Mid-range ($$)', value: '$$' },
  { label: 'Fine dining ($$$)', value: '$$$' },
];

export const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Rating (high to low)', value: 'rating-desc' },
  { label: 'Distance (nearest)', value: 'distance-asc' },
];
