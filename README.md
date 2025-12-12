# HTML Uploader

Ứng dụng web đơn giản để upload, chia sẻ và chạy file HTML trực tiếp trên trình duyệt. Không cần cài đặt server hay hosting, chỉ cần upload file HTML và nhận link để xem ngay. Xây dựng bằng Next.js và Vercel Blob Storage.

## Tính năng

- Upload file HTML với hỗ trợ kéo thả
- Xem file đã upload trực tiếp trên trình duyệt
- Liệt kê tất cả file đã upload kèm theo ngày tháng
- Sao chép link chia sẻ vào clipboard
- Giao diện responsive với phong cách vẽ tay
- Tự động xóa file sau 24 giờ

## Công nghệ sử dụng

- **Framework**: Next.js 14
- **Lưu trữ**: Vercel Blob Storage
- **Styling**: CSS-in-JS với styled-jsx
- **Font**: Google Fonts (Pacifico, Mali, Patrick Hand)

## Cấu trúc dự án

```
html-uploader/
├── pages/
│   ├── api/
│   │   ├── files.js      # API liệt kê file đã upload
│   │   ├── upload.js     # API xử lý upload file
│   │   └── cleanup.js    # API xóa file cũ hơn 24 giờ
│   ├── view/
│   │   └── [filename].js # Route động để render file HTML
│   └── index.js          # Giao diện upload chính
├── next.config.js        # Cấu hình Next.js
├── vercel.json           # Cài đặt deploy Vercel
└── package.json
```

## Bắt đầu

### Yêu cầu

- Node.js 18 trở lên
- Tài khoản Vercel đã kích hoạt Blob Storage

### Cài đặt

1. Clone repository:

```bash
git clone https://github.com/eiyuumiru/html-uploader.git
cd html-uploader
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env.local` với token Vercel Blob Storage:

```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

4. Chạy development server:

```bash
npm run dev
```

5. Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Deploy

Dự án này được thiết kế để deploy trên Vercel:

1. Đẩy code lên GitHub repository
2. Import dự án trong Vercel
3. Thêm biến môi trường `BLOB_READ_WRITE_TOKEN` trong cài đặt dự án Vercel
4. Deploy

## API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/upload` | POST | Upload file HTML (tối đa 10MB) |
| `/api/files` | GET | Liệt kê tất cả file HTML đã upload |
| `/api/cleanup` | GET | Xóa file cũ hơn 24 giờ (chạy tự động mỗi giờ) |
| `/view/[filename]` | GET | Render file HTML đã upload |

## Cấu hình

### vercel.json

```json
{
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Biến môi trường

| Biến | Mô tả |
|------|-------|
| `BLOB_READ_WRITE_TOKEN` | Token đọc/ghi Vercel Blob Storage |

## License

MIT
