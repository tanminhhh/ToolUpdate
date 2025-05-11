# Hướng dẫn triển khai trên GitHub

Tài liệu này cung cấp hướng dẫn chi tiết để triển khai ứng dụng Tài Xỉu Prediction Tool trên GitHub và các dịch vụ hosting phổ biến.

## Bước 1: Chuẩn bị repository

1. Tạo một repository mới trên GitHub
2. Clone repository về máy tính của bạn:

```bash
git clone https://github.com/your-username/tai-xiu-prediction.git
cd tai-xiu-prediction
```

3. Copy toàn bộ mã nguồn vào thư mục đã clone
4. Thêm các files và commit:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Bước 2: Thiết lập CI/CD với GitHub Actions

GitHub Actions đã được cấu hình sẵn trong thư mục `.github/workflows`. Mỗi khi bạn push code lên nhánh `main`, workflow sẽ tự động:

1. Build ứng dụng
2. Chạy các bài test
3. Tạo artifacts để triển khai

## Bước 3: Triển khai trên GitHub Pages

Để triển khai trên GitHub Pages, thêm bước sau vào file `.github/workflows/main.yml`:

```yaml
# Thêm vào phần jobs.deploy.steps
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

## Bước 4: Triển khai trên Vercel hoặc Netlify

### Vercel

1. Tạo tài khoản tại [Vercel](https://vercel.com)
2. Kết nối repository GitHub của bạn
3. Cấu hình như sau:
   - Framework preset: `Other`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm ci`

### Netlify

1. Tạo tài khoản tại [Netlify](https://netlify.com)
2. Kết nối repository GitHub của bạn
3. Cấu hình như sau:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Bước 5: Cấu hình môi trường

Đối với các biến môi trường:

1. Tạo file `.env` dựa trên `.env.example` (không đẩy lên GitHub)
2. Thêm các biến môi trường cần thiết vào settings của dịch vụ hosting

## Bước 6: Kiểm tra và theo dõi

Sau khi triển khai:

1. Kiểm tra ứng dụng có hoạt động bình thường không
2. Theo dõi logs để phát hiện lỗi
3. Cấu hình theo dõi hiệu suất nếu cần

---

Nếu có thắc mắc hoặc gặp vấn đề trong quá trình triển khai, vui lòng tạo một issue mới trong repository GitHub.