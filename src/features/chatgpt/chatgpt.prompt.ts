/**
 * Tạo prompt gửi ChatGPT để gợi ý quán ăn
 */
export function buildSearchPrompt(
  keyword: string,
  latitude: number,
  longitude: number
): string {
  return `Tôi đang ở vị trí latitude: ${latitude}, longitude: ${longitude}.
Tôi muốn tìm "${keyword}".
Hãy gợi ý 6 quán ăn/quán nước ngon và phù hợp gần vị trí của tôi.

Trả về kết quả dưới dạng JSON array với format sau (KHÔNG có text nào khác ngoài JSON):
[
  {
    "id": "1",
    "name": "Tên quán",
    "description": "Mô tả ngắn gọn về quán (1-2 câu)",
    "distance": "khoảng cách ước lượng (VD: 0.5km)",
    "rating": 4.5,
    "address": "Địa chỉ quán",
    "priceRange": "Khoảng giá (VD: 30k-50k)",
    "cuisine": "Loại món ăn"
  }
]

Lưu ý:
- Gợi ý quán ĐỜI THỰC, phổ biến tại khu vực đó
- Rating từ 1-5, có thể dùng số thập phân
- Khoảng cách ước lượng hợp lý
- Mô tả ngắn gọn, hấp dẫn`;
}

/**
 * System prompt cho ChatGPT
 */
export const SYSTEM_PROMPT = `Bạn là trợ lý gợi ý quán ăn thông minh. 
Bạn có kiến thức rộng về các quán ăn, nhà hàng, quán cà phê tại Việt Nam.
Hãy gợi ý dựa trên vị trí và nhu cầu của người dùng.
Luôn trả về kết quả dạng JSON array hợp lệ, KHÔNG kèm theo text giải thích nào khác.`;
