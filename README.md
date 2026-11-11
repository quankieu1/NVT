# Website Thiệp Cưới Online — Phong Cách Seoul Ivory (Song Ngữ Việt - Anh)

Dự án website thiệp cưới online cao cấp lấy cảm hứng từ mẫu **Seoul Ivory (`tpl-seoul-ivory`)**, được tùy biến **Song ngữ Việt - Anh** tinh tế, tích hợp **Google Sheets** làm nơi lưu trữ Lời chúc (Sổ Lưu Bút) & Xác nhận tham dự (RSVP) hoàn toàn miễn phí mà không cần thuê Database.

---

## 1. Cấu Trúc Thư Mục Chính

- [`src/data/wedding-config.ts`](src/data/wedding-config.ts): **File cấu hình trung tâm duy nhất** chứa toàn bộ thông tin Cô Dâu & Chú Rể, Hai Bên Gia Đình, Thời gian & Địa điểm 3 buổi lễ, Album 10 ảnh cưới, Mã QR Mừng cưới, Nhạc nền và Bộ nhãn song ngữ Việt - Anh.
- [`src/components/InvitationClient.tsx`](src/components/InvitationClient.tsx): Giao diện tổng thể 11 phân đoạn của thiệp cưới.
- [`src/app/tao-link/page.tsx`](src/app/tao-link/page.tsx): Công cụ `/tao-link` giúp tạo nhanh danh sách link mời cá nhân hóa tên khách (`?guest=Anh+Tuấn`).
- [`src/app/api/guestbook/route.ts`](src/app/api/guestbook/route.ts) & [`src/app/api/rsvp/route.ts`](src/app/api/rsvp/route.ts): API kết nối Google Sheets.
- [`scripts/google-apps-script.js`](scripts/google-apps-script.js): Mã nguồn Google Apps Script để gắn vào file Google Sheets của bạn.

---

## 2. Chỉnh Sửa Thông Tin Thiệp Cưới

1. Thay ảnh cưới của bạn vào thư mục `public/uploads/...` và nhạc nền `.mp3` vào `public/music/`.
2. Mở file [`src/data/wedding-config.ts`](src/data/wedding-config.ts) để sửa tên Cô Dâu, Chú Rể, phụ huynh, ngày giờ, tọa độ bản đồ Google Maps (`mapLat`, `mapLng`), số tài khoản & ảnh QR.

---

## 3. Kết Nối Google Sheets (Không Cần Database)

1. Tạo một file **Google Sheets** mới trên Google Drive của bạn.
2. Đổi tên 2 trang tính (sheet tab) ở góc dưới thành:
   - `LoiChuc`
   - `RSVP`
3. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** → **Apps Script**.
4. Xóa đoạn mã mặc định và dán toàn bộ nội dung từ file [`scripts/google-apps-script.js`](scripts/google-apps-script.js) vào, sau đó nhấn biểu tượng **Lưu (Save)**.
5. Nhấn nút **Triển khai (Deploy)** → **Tùy chọn triển khai mới (New deployment)**:
   - Chọn loại: **Ứng dụng web (Web app)**.
   - Thực thi dưới dạng (Execute as): **Tôi (Me)**.
   - Ai có quyền truy cập (Who has access): **Bất kỳ ai (Anyone)**.
   - Nhấn **Triển khai (Deploy)**, cấp quyền truy cập và copy đường dẫn **Web App URL** (`https://script.google.com/macros/s/.../exec`).
6. Tạo file `.env.local` ở thư mục gốc dự án (hoặc thêm vào Environment Variables trên Vercel):
   ```env
   GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
   ```

---

## 4. Hướng Dẫn Deploy Lên Vercel (Miễn Phí)

1. Đẩy mã nguồn dự án lên **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial wedding invitation website"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
   git push -u origin main
   ```
2. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
3. Nhấn **Add New...** → **Project** → Chọn repository thiệp cưới vừa tạo → Nhấn **Import**.
4. Tại mục **Environment Variables**, thêm biến:
   - Key: `GOOGLE_SCRIPT_URL`
   - Value: Đường dẫn Web App Google Script của bạn.
5. Nhấn **Deploy**. Sau khoảng 1 phút, website sẽ có ngay link chạy chính thức.

---

## 5. Hướng Dẫn Mua Tên Miền Riêng & Gắn Vào Vercel

### Bước 1: Mua tên miền
- **Nhà cung cấp quốc tế (rẻ, quản lý DNS cực nhanh)**: **Cloudflare Registrar**, **Porkbun**, hoặc **Namecheap** (các đuôi `.com`, `.love`, `.wedding`, `.online`, `.site` giá chỉ từ 2$ – 10$/năm).
- **Nhà cung cấp Việt Nam (đuôi `.vn`, `.com.vn`)**: **Tenten.vn**, **Matbao.net**, **PA Vietnam**, **iNET.vn**.

### Bước 2: Thêm tên miền vào Vercel
1. Vào trang quản trị dự án trên **Vercel** → tab **Settings** → **Domains**.
2. Nhập tên miền bạn vừa mua (ví dụ: `vantuan-thaonguyen.com`) → nhấn **Add**.
3. Chọn cấu hình khuyến nghị của Vercel (thường là thêm cả `vantuan-thaonguyen.com` và `www.vantuan-thaonguyen.com`).

### Bước 3: Trỏ DNS từ nơi mua tên miền về Vercel
Đăng nhập vào trang quản lý DNS tại nơi bạn mua tên miền, thêm 2 bản ghi sau:

| Loại (Type) | Tên (Host / Name) | Giá trị (Value / Points to) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Tự động / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Tự động / 3600 |

Sau khi lưu cấu hình DNS khoảng 5–15 phút, Vercel sẽ tự động cấp chứng chỉ bảo mật **HTTPS (SSL)** miễn phí và website thiệp cưới của bạn sẽ hoạt động trên tên miền riêng!

