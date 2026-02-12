import type { Restaurant } from '../types';

/**
 * Free Place Photo Service
 * Uses OpenStreetMap Nominatim + Wikidata + Wikimedia Commons + Wikipedia
 * to find real photos of restaurants — 100% free, no API keys needed.
 *
 * Photo lookup chain:
 * 1. Nominatim search → get extratags (wikidata, wikimedia_commons, image)
 * 2. If wikidata Q-ID → Wikidata P18 (image) → Wikimedia Commons thumbnail
 * 3. If wikimedia_commons tag → Wikimedia Commons thumbnail
 * 4. Wikipedia geosearch nearby → article thumbnail
 * 5. Fallback → Unsplash cuisine placeholder (handled by caller)
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';

const USER_AGENT = 'ClawFood/1.0 (restaurant-finder)';

// --- Rate limiting for Nominatim (max 1 req/sec) ---
let lastNominatimCall = 0;

async function nominatimThrottle(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastNominatimCall;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastNominatimCall = Date.now();
}

// --- Nominatim: search for a place on OpenStreetMap ---

interface NominatimResult {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
  extratags?: {
    wikidata?: string;
    wikimedia_commons?: string;
    wikipedia?: string;
    image?: string;
    website?: string;
    opening_hours?: string;
    cuisine?: string;
    phone?: string;
  };
}

async function searchNominatim(
  name: string,
  address: string | undefined,
  latitude: number,
  longitude: number
): Promise<NominatimResult | null> {
  await nominatimThrottle();

  try {
    const query = address ? `${name}, ${address}` : name;
    const params = new URLSearchParams({
      q: query,
      format: 'jsonv2',
      limit: '1',
      extratags: '1',
      addressdetails: '1',
      viewbox: `${longitude - 0.05},${latitude + 0.05},${longitude + 0.05},${latitude - 0.05}`,
      bounded: '0',
    });

    const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;

    const results: NominatimResult[] = await response.json();
    return results[0] || null;
  } catch {
    return null;
  }
}

// --- Wikidata: get image (P18) from a wikidata entity ---

async function getWikidataImage(wikidataId: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      action: 'wbgetclaims',
      entity: wikidataId,
      property: 'P18', // P18 = "image"
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${WIKIDATA_API}?${params}`);
    if (!response.ok) return null;

    const data = await response.json();
    const claims = data.claims?.P18;
    if (!claims || claims.length === 0) return null;

    const filename: string = claims[0].mainsnak?.datavalue?.value;
    if (!filename) return null;

    return getCommonsThumbUrl(filename);
  } catch {
    return null;
  }
}

// --- Wikimedia Commons: convert a filename to a thumbnail URL ---

async function getCommonsThumbUrl(
  filename: string,
  width = 400
): Promise<string | null> {
  try {
    // Normalize filename: replace spaces with underscores
    const normalizedName = filename.replace(/ /g, '_');
    const params = new URLSearchParams({
      action: 'query',
      titles: `File:${normalizedName}`,
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: String(width),
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${COMMONS_API}?${params}`);
    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    // Get the first page result (could be keyed by any page ID)
    const page = Object.values(pages)[0] as {
      imageinfo?: { thumburl?: string; url?: string }[];
    };
    return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null;
  } catch {
    return null;
  }
}

// --- Wikimedia Commons: search directly by filename/category ---

function extractCommonsFilename(commonsTag: string): string {
  // extratags.wikimedia_commons can be "File:Something.jpg" or "Category:Something"
  if (commonsTag.startsWith('File:')) {
    return commonsTag.replace('File:', '');
  }
  return commonsTag;
}

// --- Wikipedia: geosearch nearby for articles with images ---

interface WikiGeoPage {
  pageid: number;
  title: string;
  thumbnail?: { source: string; width: number; height: number };
}

async function getWikipediaNearbyImage(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      action: 'query',
      generator: 'geosearch',
      ggscoord: `${latitude}|${longitude}`,
      ggsradius: '500',
      ggslimit: '5',
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '400',
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${WIKIPEDIA_API}?${params}`);
    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    // Find first page with a thumbnail
    const pagesArray: WikiGeoPage[] = Object.values(pages);
    for (const page of pagesArray) {
      if (page.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// --- Main: find photo for a single restaurant ---

async function findPlacePhoto(
  name: string,
  address: string | undefined,
  latitude: number,
  longitude: number
): Promise<{ photoUrl?: string; osmAddress?: string } | null> {
  // Step 1: Search Nominatim
  const nominatimResult = await searchNominatim(name, address, latitude, longitude);

  if (nominatimResult?.extratags) {
    const tags = nominatimResult.extratags;

    // Step 2a: Direct image URL in extratags
    if (tags.image) {
      return {
        photoUrl: tags.image,
        osmAddress: nominatimResult.display_name,
      };
    }

    // Step 2b: Wikimedia Commons file
    if (tags.wikimedia_commons && tags.wikimedia_commons.startsWith('File:')) {
      const filename = extractCommonsFilename(tags.wikimedia_commons);
      const thumbUrl = await getCommonsThumbUrl(filename);
      if (thumbUrl) {
        return {
          photoUrl: thumbUrl,
          osmAddress: nominatimResult.display_name,
        };
      }
    }

    // Step 2c: Wikidata entity → P18 image
    if (tags.wikidata) {
      const wikidataUrl = await getWikidataImage(tags.wikidata);
      if (wikidataUrl) {
        return {
          photoUrl: wikidataUrl,
          osmAddress: nominatimResult.display_name,
        };
      }
    }

    // Step 2d: Wikipedia article → try to get image from the article
    if (tags.wikipedia) {
      // wikipedia tag format: "en:Article Name" or "vi:Tên bài"
      const parts = tags.wikipedia.split(':');
      if (parts.length >= 2) {
        const lang = parts[0];
        const article = parts.slice(1).join(':');
        const wikiThumb = await getWikipediaArticleImage(lang, article);
        if (wikiThumb) {
          return {
            photoUrl: wikiThumb,
            osmAddress: nominatimResult.display_name,
          };
        }
      }
    }
  }

  // Step 3: Wikipedia geosearch — find nearby articles with images
  const lat = nominatimResult ? parseFloat(nominatimResult.lat) : latitude;
  const lon = nominatimResult ? parseFloat(nominatimResult.lon) : longitude;
  const wikiNearbyImage = await getWikipediaNearbyImage(lat, lon);
  if (wikiNearbyImage) {
    return {
      photoUrl: wikiNearbyImage,
      osmAddress: nominatimResult?.display_name,
    };
  }

  // No photo found, return OSM address if available
  if (nominatimResult) {
    return { osmAddress: nominatimResult.display_name };
  }

  return null;
}

// --- Wikipedia: get image from a specific article ---

async function getWikipediaArticleImage(
  lang: string,
  title: string
): Promise<string | null> {
  try {
    const apiBase = `https://${lang}.wikipedia.org/w/api.php`;
    const params = new URLSearchParams({
      action: 'query',
      titles: title,
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '400',
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${apiBase}?${params}`);
    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0] as WikiGeoPage;
    return page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

// --- Public API ---

/**
 * Build a Google Maps search URL (free — no API key needed, it's just a link)
 */
export function buildGoogleMapsUrl(
  name: string,
  address?: string,
  latitude?: number,
  longitude?: number
): string {
  const query = address ? `${name}, ${address}` : name;
  if (latitude && longitude) {
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${latitude},${longitude},17z`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Build an OpenStreetMap URL as alternative
 */
export function buildOsmUrl(
  name: string,
  latitude?: number,
  longitude?: number
): string {
  if (latitude && longitude) {
    return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(name)}`;
}

/**
 * Enrich a list of restaurants with real photos from free sources.
 * Data sources: Nominatim (OSM) → Wikidata → Wikimedia Commons → Wikipedia
 * No API keys required. Respects Nominatim rate limit (1 req/sec).
 */
export async function enrichWithFreePhotos(
  restaurants: Restaurant[],
  _latitude: number,
  _longitude: number
): Promise<Restaurant[]> {
  // Process sequentially to respect Nominatim rate limit (1 req/sec)
  const enriched: Restaurant[] = [];

  for (const restaurant of restaurants) {
    const placeData = await findPlacePhoto(
      restaurant.name,
      restaurant.address,
      restaurant.latitude || _latitude,
      restaurant.longitude || _longitude
    );

    const fallbackMapsUrl = buildGoogleMapsUrl(
      restaurant.name,
      restaurant.address,
      restaurant.latitude,
      restaurant.longitude
    );

    if (!placeData) {
      enriched.push({
        ...restaurant,
        googleMapsUrl: restaurant.googleMapsUrl || fallbackMapsUrl,
      });
      continue;
    }

    // Prefer real photo over Unsplash placeholder
    const hasRealImage =
      restaurant.image && !restaurant.image.includes('unsplash.com');

    enriched.push({
      ...restaurant,
      image: hasRealImage
        ? restaurant.image
        : placeData.photoUrl || restaurant.image,
      photoUrl: placeData.photoUrl || restaurant.photoUrl,
      address: placeData.osmAddress || restaurant.address,
      googleMapsUrl: restaurant.googleMapsUrl || fallbackMapsUrl,
    });
  }

  return enriched;
}
