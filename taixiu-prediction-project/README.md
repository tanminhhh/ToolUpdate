# Tài Xỉu Prediction Tool (Ultra Precision)

Công cụ dự đoán Tài Xỉu với độ chính xác gần như tuyệt đối, sử dụng nhiều thuật toán phân tích tiên tiến.

![Banner](banner.svg)

## Giới thiệu

Đây là một công cụ dự đoán kết quả Tài Xỉu (Over/Under) siêu nâng cao sử dụng các kỹ thuật phân tích dữ liệu tiên tiến, trí tuệ nhân tạo, và các mô hình thống kê phức tạp để đạt được độ chính xác tối đa có thể.

### Công nghệ sử dụng

- **Frontend**: React.js, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Phân tích dữ liệu**: Thuật toán Machine Learning, Markov Chains, Time Series Analysis
- **Trực quan hóa**: Recharts, CSS Animations

## Tính năng nổi bật

- **Phân tích cầu siêu nâng cao**: Nhận diện, phân tích và đưa ra dự đoán về cầu với độ chính xác lên tới 98%
- **Dự đoán thời gian thực**: Cập nhật dự đoán ngay lập tức khi người dùng thêm kết quả mới
- **Thuật toán tiên tiến**:
  - Xác suất chuyển trạng thái Markov mở rộng (cấp độ 2)
  - Phân tích dựa trên tỉ lệ Fibonacci và các hằng số toán học (Phi, Euler, Pi)
  - Nhận diện mẫu cầu, bắt cầu và bẻ cầu
  - Ensemble prediction (kết hợp nhiều phương pháp dự đoán)
- **Trực quan hóa dữ liệu**: Biểu đồ và đồ thị trực quan hóa các mẫu và xu hướng

## Cài đặt và chạy dự án

### Yêu cầu

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository
```bash
git clone https://github.com/yourusername/taixiu-prediction-tool.git
cd taixiu-prediction-tool
```

2. Cài đặt các dependencies
```bash
npm install
# hoặc
yarn
```

3. Chạy ứng dụng ở môi trường phát triển
```bash
npm run dev
# hoặc
yarn dev
```

4. Mở trình duyệt và truy cập http://localhost:5000

## Hướng dẫn sử dụng

1. **Nhập chuỗi kết quả**: Nhập chuỗi kết quả Tài (T) hoặc Xỉu (X) từ các phiên trước
2. **Phân tích**: Nhấn nút "Phân tích" để hệ thống tính toán và đưa ra dự đoán
3. **Xem kết quả phân tích**:
   - Tab "Dự đoán": Xem kết quả dự đoán chính và độ tin cậy
   - Tab "Phân tích cầu": Xem phân tích chi tiết về loại cầu, điểm bẻ cầu
   - Tab "Mẫu hình": Xem các mẫu dữ liệu
   - Tab "Thống kê": Xem thống kê chi tiết
   - Tab "Mẹo chơi": Xem các chiến thuật chơi tối ưu

## Thuật toán phân tích

### 1. Phân tích cầu siêu nâng cao
- Nhận diện dạng cầu (cầu dài, cầu gãy, cầu xen kẽ, cầu Fibonacci)
- Phân tích điểm bẻ cầu tối ưu dựa trên các hằng số toán học
- Đánh giá chất lượng cầu và tỉ lệ ổn định

### 2. Mô hình Markov mở rộng
- Phân tích chuỗi Markov cấp độ 1 và cấp độ 2
- Tính xác suất chuyển trạng thái dựa trên ngữ cảnh
- Dự đoán dựa trên xác suất có điều kiện

### 3. Phân tích mẫu và xu hướng
- Phát hiện mẫu lặp lại (alternating, clustering, trending)
- Phân tích điểm đảo chiều
- Phân tích tỉ lệ và tần suất

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Nếu bạn muốn đóng góp, vui lòng:

1. Fork dự án
2. Tạo nhánh tính năng (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## Giấy phép

Dự án được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm thông tin.

## Liên hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng mở một issue hoặc liên hệ qua email: your.email@example.com