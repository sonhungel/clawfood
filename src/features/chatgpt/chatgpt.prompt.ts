/**
 * Build a prompt to send to ChatGPT for restaurant recommendations
 */
export function buildSearchPrompt(
  keyword: string,
  latitude: number,
  longitude: number
): string {
  return `I am currently at latitude: ${latitude}, longitude: ${longitude}.
I am looking for "${keyword}".
Please suggest 6 great restaurants/cafes/eateries near my location.

Return the results as a JSON array with this exact format (NO other text outside the JSON):
[
  {
    "id": "1",
    "name": "Restaurant Name (use real/official name)",
    "description": "Brief description of the place (1-2 sentences)",
    "distance": "estimated distance (e.g. 0.5km)",
    "rating": 4.5,
    "address": "Full street address of the restaurant",
    "priceRange": "Price range (e.g. $5-$15)",
    "cuisine": "Type of cuisine (e.g. Vietnamese, Japanese, Korean, Coffee, BBQ, Italian, Thai, Chinese, Healthy, Boba)",
    "latitude": 10.7769,
    "longitude": 106.7009
  }
]

Important:
- Suggest REAL, well-known restaurants in that area
- Use the actual name that would appear on Google Maps
- Include the full street address so it can be found on Google Maps
- You MUST provide accurate latitude and longitude coordinates for each restaurant (this is critical for map navigation)
- Rating from 1-5, decimals allowed
- Estimate distance reasonably
- Keep descriptions short and appealing`;
}

/**
 * System prompt for ChatGPT
 */
export const SYSTEM_PROMPT = `You are a smart restaurant recommendation assistant.
You have extensive knowledge about restaurants, cafes, and eateries worldwide.
Recommend places based on the user's location and preferences.
Always return results as a valid JSON array, with NO additional explanatory text.
Use real restaurant names and addresses that can be found on Google Maps.`;
