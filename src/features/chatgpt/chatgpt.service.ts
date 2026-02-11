import { buildSearchPrompt } from './chatgpt.prompt';
import { callChatGPT } from '../../services/openai.service';
import type { Restaurant, ChatGPTResponse } from '../../types';

/**
 * Gửi yêu cầu tìm quán ăn tới ChatGPT
 */
export async function searchRestaurants(
  keyword: string,
  latitude: number,
  longitude: number
): Promise<ChatGPTResponse> {
  const prompt = buildSearchPrompt(keyword, latitude, longitude);

  try {
    const rawResponse = await callChatGPT(prompt);

    // Parse JSON từ response
    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Không thể parse kết quả từ AI');
    }

    const restaurants: Restaurant[] = JSON.parse(jsonMatch[0]).map(
      (r: Restaurant, index: number) => ({
        ...r,
        id: r.id || String(index + 1),
        image: r.image || getPlaceholderImage(r.cuisine || keyword, index),
      })
    );

    return {
      message: `Đã tìm thấy ${restaurants.length} quán phù hợp với "${keyword}" gần bạn!`,
      restaurants,
    };
  } catch (error) {
    // Nếu không có API key, trả về mock data
    if (error instanceof Error && error.message.includes('VITE_OPENAI_API_KEY')) {
      return getMockResponse(keyword);
    }
    throw error;
  }
}

/**
 * Placeholder image cho quán ăn
 */
function getPlaceholderImage(_cuisine: string, index: number): string {
  const images = [
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
  ];
  return images[index % images.length];
}

/**
 * Mock data khi chưa có API key
 */
function getMockResponse(keyword: string): ChatGPTResponse {
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Bún Chả Hương Liên',
      description: 'Quán bún chả nổi tiếng với nước chấm đậm đà, thịt nướng thơm phức. Nơi từng đón tiếp nhiều du khách quốc tế.',
      distance: '0.5km',
      rating: 4.5,
      address: '24 Lê Văn Hưu, Quận 1',
      priceRange: '35k-55k',
      cuisine: keyword,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      name: 'Phở Thìn Bờ Hồ',
      description: 'Phở bò truyền thống với nước dùng hầm xương đậm đà, bánh phở mềm mịn đặc trưng.',
      distance: '1.2km',
      rating: 4.7,
      address: '13 Lò Đúc, Hai Bà Trưng',
      priceRange: '40k-60k',
      cuisine: keyword,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Báo Chả Hoàng Liên',
      description: 'Quán ăn truyền thống với không gian ấm cúng, món ăn đa dạng phục vụ từ sáng đến tối.',
      distance: '0.8km',
      rating: 4.3,
      address: '45 Nguyễn Huệ, Quận 1',
      priceRange: '30k-50k',
      cuisine: keyword,
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    },
    {
      id: '4',
      name: 'Cơm Tấm Sài Gòn',
      description: 'Cơm tấm sườn bì chả với nước mắm pha đặc biệt, cơm tấm dẻo thơm hấp dẫn.',
      distance: '1.5km',
      rating: 4.4,
      address: '78 Pasteur, Quận 3',
      priceRange: '35k-65k',
      cuisine: keyword,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    },
    {
      id: '5',
      name: 'Bún Thịt Nướng Cô Ba',
      description: 'Bún thịt nướng with chả giò giòn rụm, rau sống tươi mát và nước mắm chua ngọt.',
      distance: '2.0km',
      rating: 4.6,
      address: '112 Trần Hưng Đạo, Quận 5',
      priceRange: '30k-45k',
      cuisine: keyword,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    },
    {
      id: '6',
      name: 'Trà Sữa Bobapop',
      description: 'Quán trà sữa nổi tiếng với đa dạng hương vị, trân châu dai mềm và không gian hiện đại.',
      distance: '0.3km',
      rating: 4.2,
      address: '56 Nguyễn Trãi, Quận 1',
      priceRange: '25k-55k',
      cuisine: keyword,
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    },
  ];

  return {
    message: `Đã tìm thấy ${mockRestaurants.length} quán phù hợp với "${keyword}" gần bạn!`,
    restaurants: mockRestaurants,
  };
}
