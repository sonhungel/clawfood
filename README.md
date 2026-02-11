🍽️ Website Gợi Ý Quán Ăn Gần Bạn

Website giúp người dùng tìm quán ăn ngon gần vị trí hiện tại, dựa trên:

📍 Vị trí hiện tại của người dùng

🔎 Nội dung tìm kiếm (ví dụ: bún bò, quán chay, trà sữa)

🤖 ChatGPT để gợi ý quán ăn phù hợp theo vị trí và nhu cầu

🎯 Mục Tiêu Dự Án

Lấy vị trí người dùng một cách chính xác

Cho phép nhập nội dung tìm kiếm linh hoạt

Gửi dữ liệu sang ChatGPT để:

Phân tích nhu cầu

Gợi ý quán ăn phù hợp gần vị trí

Code dễ đọc – dễ bảo trì – dễ mở rộng

🛠 Công Nghệ Sử Dụng

⚛️ React

🟦 TypeScript

🎨 TailwindCSS

🌍 Geolocation API (Browser)

🤖 OpenAI / ChatGPT API

📁 Cấu Trúc Thư Mục Chuẩn
src/
│
├── assets/                 # Hình ảnh, icon, logo
│
├── components/             # Component tái sử dụng
│   ├── common/              # Button, Input, Loading
│   ├── layout/              # Header, Footer
│   └── food/                # Card quán ăn, danh sách quán
│
├── features/               # Các tính năng chính
│   ├── location/            # Lấy vị trí người dùng
│   │   ├── useLocation.ts
│   │   └── location.types.ts
│   │
│   ├── search/              # Nhập nội dung tìm kiếm
│   │   ├── SearchInput.tsx
│   │   └── search.types.ts
│   │
│   └── chatgpt/             # Giao tiếp với ChatGPT
│       ├── chatgpt.service.ts
│       ├── chatgpt.prompt.ts
│       └── chatgpt.types.ts
│
├── pages/                  # Các trang
│   ├── Home.tsx
│   └── NotFound.tsx
│
├── services/               # API & HTTP client
│   ├── apiClient.ts
│   └── openai.service.ts
│
├── hooks/                  # Custom hooks dùng chung
│   └── useDebounce.ts
│
├── utils/                  # Hàm tiện ích
│   ├── formatLocation.ts
│   └── constants.ts
│
├── types/                  # Type dùng toàn dự án
│   └── index.ts
│
├── App.tsx
├── main.tsx
└── index.css

🔄 Luồng Hoạt Động Của Website
1️⃣ Lấy vị trí hiện tại của người dùng

Sử dụng Geolocation API

Đóng gói trong custom hook để tái sử dụng

📂 File:

src/features/location/useLocation.ts


Dữ liệu trả về:

{
  latitude: number
  longitude: number
}

2️⃣ Người dùng nhập nội dung tìm kiếm

Input cho phép nhập tự do

Có thể dùng debounce để tối ưu

📂 File:

src/features/search/SearchInput.tsx


Ví dụ nội dung:

"bún bò Huế"
"quán chay"
"trà sữa ít ngọt"

3️⃣ Gửi dữ liệu sang ChatGPT để hỏi quán ăn

Dữ liệu gửi đi gồm:

{
  keyword: string
  latitude: number
  longitude: number
}


📂 Xử lý tại:

src/features/chatgpt/chatgpt.service.ts

🤖 Cách Tạo Prompt Gửi ChatGPT

📂 File:

src/features/chatgpt/chatgpt.prompt.ts


Ví dụ prompt:

Tôi đang ở vị trí latitude: {lat}, longitude: {lng}.
Tôi muốn tìm {keyword}.
Hãy gợi ý các quán ăn ngon gần vị trí của tôi.


ChatGPT sẽ trả về:

Tên quán

Mô tả ngắn

Khoảng cách ước lượng (nếu có)

🎨 Giao Diện (TailwindCSS)

Không viết CSS thuần

Dùng utility class trực tiếp

Ví dụ:

<input
  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
/>

🚀 Chạy Dự Án
npm install
npm run dev

📌 Định Hướng Mở Rộng

🗺️ Tích hợp Google Maps

⭐ Đánh giá & review quán ăn

❤️ Lưu quán yêu thích

🔐 Đăng nhập người dùng

📍 Tìm quán theo bán kính

🌐 Đa ngôn ngữ

📄 License

MIT License