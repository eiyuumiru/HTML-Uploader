# HTML Uploader - Vercel

Hệ thống upload và chia sẻ file HTML trên Vercel với giao diện phong cách Studygram, sử dụng Vercel Blob Storage.

## 🚀 Quick Start

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy development server
npm run dev

# 3. Mở trình duyệt tại http://localhost:3000
```

> 📖 **Xem hướng dẫn chi tiết**: [HUONG_DAN_CHAY.md](./HUONG_DAN_CHAY.md)  
> ⚡ **Hướng dẫn nhanh**: [QUICK_START.md](./QUICK_START.md)

## Tính năng

- ✅ Upload file HTML
- ✅ Lưu trữ trên Vercel Blob Storage
- ✅ Xem danh sách files đã upload
- ✅ Truy cập file qua URL công khai
- ✅ Responsive design

## Cài đặt

1. **Clone và cài đặt dependencies:**
```bash
npm install
```

2. **Cấu hình Vercel Blob Storage:**
   - Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
   - Vào **Storage** > **Create Database** > Chọn **Blob**
   - Tạo Blob Store mới
   - Copy **BLOB_READ_WRITE_TOKEN** từ Settings
   - Thêm biến môi trường vào Vercel project:
     - Vào Project Settings > Environment Variables
     - Thêm: `BLOB_READ_WRITE_TOKEN` = token vừa copy

3. **Chạy development server (local):**
```bash
# Tạo file .env.local với:
BLOB_READ_WRITE_TOKEN=your_token_here

npm run dev
```

4. **Deploy lên Vercel:**
```bash
# Cài Vercel CLI (nếu chưa có)
npm i -g vercel

# Deploy
vercel
```

Hoặc push code lên GitHub và connect với Vercel (khuyến nghị).

## Cấu trúc project

```
├── pages/
│   ├── index.js          # Trang chủ với form upload
│   ├── [filename].js     # Dynamic route để view HTML file
│   └── api/
│       ├── upload.js     # API xử lý upload
│       └── files.js      # API list files
├── package.json
├── next.config.js
└── vercel.json
```

## Sử dụng

1. Truy cập trang chủ
2. Chọn file HTML cần upload
3. Click "Upload"
4. Copy URL và chia sẻ

## Lưu ý

- File HTML sẽ được lưu với tên gốc
- Tất cả files đều public
- Không có giới hạn kích thước file (theo Vercel limits)

