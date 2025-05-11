# Hướng dẫn phát triển

Tài liệu này dành cho các nhà phát triển muốn đóng góp vào dự án Tài Xỉu Prediction Tool.

## Cấu trúc dự án

```
├── client/                  # Frontend React app
│   ├── src/                 # Source code
│   │   ├── components/      # UI components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Thư viện & utilities
│   │   │   ├── cau_analyzer.ts    # Phân tích cầu
│   │   │   ├── patterns.ts        # Phân tích mẫu
│   │   │   ├── predictors.ts      # Thuật toán dự đoán
│   │   │   ├── statistics.ts      # Phân tích thống kê
│   │   │   └── utils.ts           # Các tiện ích
│   │   ├── pages/           # Các trang của ứng dụng
│   │   └── App.tsx          # Component chính
│   └── index.html           # HTML entry point
├── server/                  # Backend Express server
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   └── storage.ts           # Data storage abstraction
├── shared/                  # Shared code between frontend & backend
│   └── schema.ts            # Database schema & types
└── package.json             # Project dependencies & scripts
```

## Kiến trúc phần mềm

### Frontend

- **React**: Thư viện UI
- **TypeScript**: Ngôn ngữ lập trình tĩnh
- **TailwindCSS & Shadcn/UI**: Hệ thống UI components
- **Recharts**: Thư viện biểu đồ
- **Context API**: Quản lý state toàn cục

### Backend

- **Express**: Web server
- **In-memory Storage**: Lưu trữ dữ liệu

## Hướng dẫn phát triển

### Thuật toán dự đoán

Các thuật toán dự đoán chính nằm trong `client/src/lib/`. Khi phát triển thuật toán mới, cần đảm bảo:

1. **Tính nhất quán**: Đảm bảo thuật toán trả về kết quả định dạng nhất quán với các thuật toán khác
2. **Xác suất/Độ tin cậy**: Luôn bao gồm độ tin cậy (confidence) của dự đoán
3. **Giải thích**: Mô tả cách thuật toán đưa ra dự đoán

Ví dụ kết quả trả về:

```typescript
{
  prediction: "T" | "X" | null,  // Dự đoán
  confidence: number,  // 0-1, độ tin cậy
  description?: string  // Mô tả thuật toán
}
```

### Phân tích cầu

Module `client/src/lib/cau_analyzer.ts` chứa logic phân tích cầu. Khi làm việc với module này:

1. Tập trung vào phân tích các đặc điểm cầu: độ dài, tính ổn định, điểm bẻ cầu
2. Phân tích mối tương quan với các mẫu khác
3. Đánh giá chất lượng và độ mạnh của cầu

### Frontend components

Components nằm trong `client/src/components/`. Khi phát triển UI mới:

1. Sử dụng các components có sẵn từ Shadcn/UI
2. Tuân thủ thiết kế chung và tính nhất quán
3. Tối ưu hóa hiệu suất, đặc biệt là với các biểu đồ

## Quy trình phát triển

1. **Fork & Clone**: Fork repository và clone về máy của bạn
2. **Cài đặt dependencies**: `npm install`
3. **Chạy ở môi trường phát triển**: `npm run dev`
4. **Tạo branch mới** cho tính năng của bạn: `git checkout -b feature/amazing-feature`
5. **Commit code** và push lên repository của bạn
6. **Mở Pull Request** vào repository chính

## Kiểm thử

Khi thêm tính năng mới, cần đảm bảo:

1. Kiểm tra tính năng với nhiều dữ liệu đầu vào khác nhau
2. So sánh hiệu suất với các thuật toán hiện có
3. Đảm bảo không có lỗi trong console
4. Tương thích trên các trình duyệt khác nhau

## Tài liệu hóa

Khi thêm tính năng hoặc thuật toán mới:

1. Cập nhật README.md nếu cần
2. Thêm JSDoc cho các functions mới
3. Mô tả cách hoạt động của thuật toán trong code comments

## Liên hệ

Nếu bạn có câu hỏi về quy trình phát triển, vui lòng tạo issue hoặc liên hệ với chúng tôi qua email.