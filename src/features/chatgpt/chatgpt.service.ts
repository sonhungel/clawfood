import { buildSearchPrompt } from './chatgpt.prompt';
import { callChatGPT } from '../../services/openai.service';
import { enrichWithFreePhotos, buildGoogleMapsUrl } from '../../services/freePlaces.service';
import type { Restaurant, ChatGPTResponse } from '../../types';

/**
 * Search for restaurants via ChatGPT, then enrich with Google Places data
 */
export async function searchRestaurants(
  keyword: string,
  latitude: number,
  longitude: number
): Promise<ChatGPTResponse> {
  const prompt = buildSearchPrompt(keyword, latitude, longitude);

  try {
    const rawResponse = await callChatGPT(prompt);

    // Parse JSON from response
    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    let restaurants: Restaurant[] = JSON.parse(jsonMatch[0]).map(
      (r: Restaurant, index: number) => ({
        ...r,
        id: r.id || String(index + 1),
        image: r.image || getPlaceholderImage(r.cuisine || keyword, index),
        googleMapsUrl: buildGoogleMapsUrl(r.name, r.address, r.latitude, r.longitude),
      })
    );

    // Enrich with free sources (OSM Nominatim → Wikidata → Wikimedia Commons → Wikipedia)
    restaurants = await enrichWithFreePhotos(restaurants, latitude, longitude);

    return {
      message: `Found ${restaurants.length} great spots for "${keyword}" near you!`,
      restaurants,
    };
  } catch (error) {
    // If no API key, return mock data
    if (error instanceof Error && error.message.includes('VITE_GEMINI_API_KEY')) {
      return getMockResponse(keyword);
    }
    throw error;
  }
}

/**
 * Cuisine-specific placeholder images from Unsplash
 */
const CUISINE_IMAGES: Record<string, string[]> = {
  vietnamese: [
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  ],
  pho: [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
  ],
  coffee: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
  ],
  boba: [
    'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1525803377221-ed018a781e90?w=400&h=300&fit=crop',
  ],
  tea: [
    'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1525803377221-ed018a781e90?w=400&h=300&fit=crop',
  ],
  japanese: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop',
  ],
  sushi: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
  ],
  korean: [
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1590301157890-4810ed352768?w=400&h=300&fit=crop',
  ],
  bbq: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
  ],
  grill: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
  ],
  italian: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
  ],
  pizza: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
  ],
  thai: [
    'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
  ],
  chinese: [
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
  ],
  healthy: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  ],
  salad: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  ],
};

function getPlaceholderImage(cuisine: string, index: number): string {
  const lc = cuisine.toLowerCase();
  const matchedKey = Object.keys(CUISINE_IMAGES).find((key) => key !== 'default' && lc.includes(key));
  const images = matchedKey ? CUISINE_IMAGES[matchedKey] : CUISINE_IMAGES.default;
  return images[index % images.length];
}

/**
 * Mock data when no API key is configured
 */
function getMockResponse(keyword: string): ChatGPTResponse {
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Bun Cha Huong Lien',
      description: 'Famous grilled pork noodle spot with rich dipping sauce and aromatic charcoal-grilled meat. A must-visit for locals and tourists alike.',
      distance: '0.5km',
      rating: 4.5,
      address: '24 Le Van Huu, Hai Ba Trung, Hanoi',
      priceRange: '$3-$6',
      cuisine: 'Vietnamese',
      latitude: 21.0155,
      longitude: 105.8529,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
      googleMapsUrl: buildGoogleMapsUrl('Bun Cha Huong Lien', '24 Le Van Huu, Hai Ba Trung, Hanoi', 21.0155, 105.8529),
    },
    {
      id: '2',
      name: 'Pho Thin Bo Ho',
      description: 'Traditional beef pho with rich bone broth simmered for hours. Silky noodles and tender beef slices.',
      distance: '1.2km',
      rating: 4.7,
      address: '13 Lo Duc, Hai Ba Trung, Hanoi',
      priceRange: '$4-$7',
      cuisine: 'Vietnamese',
      latitude: 21.0122,
      longitude: 105.8590,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
      googleMapsUrl: buildGoogleMapsUrl('Pho Thin Bo Ho', '13 Lo Duc, Hai Ba Trung, Hanoi', 21.0122, 105.8590),
    },
    {
      id: '3',
      name: 'Banh Mi Huynh Hoa',
      description: 'Legendary banh mi stall known for generous fillings — pâté, cold cuts, and crispy baguette.',
      distance: '0.8km',
      rating: 4.3,
      address: '26 Le Thi Rieng, District 1, Ho Chi Minh City',
      priceRange: '$2-$5',
      cuisine: 'Vietnamese',
      latitude: 10.7711,
      longitude: 106.6898,
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
      googleMapsUrl: buildGoogleMapsUrl('Banh Mi Huynh Hoa', '26 Le Thi Rieng, District 1, Ho Chi Minh City', 10.7711, 106.6898),
    },
    {
      id: '4',
      name: 'Com Tam Sai Gon',
      description: 'Authentic broken rice with grilled pork chop, egg cake, and sweet fish sauce. A Saigon classic.',
      distance: '1.5km',
      rating: 4.4,
      address: '78 Pasteur, District 3, Ho Chi Minh City',
      priceRange: '$3-$7',
      cuisine: 'Vietnamese',
      latitude: 10.7832,
      longitude: 106.6943,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
      googleMapsUrl: buildGoogleMapsUrl('Com Tam Sai Gon', '78 Pasteur, District 3, Ho Chi Minh City', 10.7832, 106.6943),
    },
    {
      id: '5',
      name: 'Bun Thit Nuong Co Ba',
      description: 'Grilled pork vermicelli with crispy spring rolls, fresh herbs, and tangy fish sauce dressing.',
      distance: '2.0km',
      rating: 4.6,
      address: '112 Tran Hung Dao, District 5, Ho Chi Minh City',
      priceRange: '$3-$5',
      cuisine: 'Vietnamese',
      latitude: 10.7560,
      longitude: 106.6802,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
      googleMapsUrl: buildGoogleMapsUrl('Bun Thit Nuong Co Ba', '112 Tran Hung Dao, District 5, Ho Chi Minh City', 10.7560, 106.6802),
    },
    {
      id: '6',
      name: 'The Coffee House',
      description: 'Modern Vietnamese coffee chain with great ambiance, diverse drink menu, and cozy workspace.',
      distance: '0.3km',
      rating: 4.2,
      address: '56 Nguyen Trai, District 1, Ho Chi Minh City',
      priceRange: '$2-$6',
      cuisine: 'Coffee',
      latitude: 10.7718,
      longitude: 106.6930,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      googleMapsUrl: buildGoogleMapsUrl('The Coffee House', '56 Nguyen Trai, District 1, Ho Chi Minh City', 10.7718, 106.6930),
    },
  ];

  return {
    message: `Found ${mockRestaurants.length} great spots for "${keyword}" near you!`,
    restaurants: mockRestaurants,
  };
}
