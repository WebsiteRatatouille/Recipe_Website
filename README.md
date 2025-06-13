# Website Công Thức Nấu Ăn

Một website chia sẻ công thức nấu ăn, cho phép người dùng đăng ký tài khoản, tìm kiếm món ăn, xem chi tiết công thức, và quản lý nội dung thông qua giao diện quản trị.

## Tính năng chính

-   Tìm kiếm và lọc công thức theo tên món, danh mục
-   Xem chi tiết từng công thức: nguyên liệu, bước làm, thời gian nấu,...
-   Đăng ký / Đăng nhập người dùng
-   Giao diện quản trị: Thêm, sửa, xoá công thức nấu ăn
-   Dữ liệu lưu trữ bằng MongoDB, quản lý qua API backend

## Công nghệ sử dụng

### Frontend

-   React.js
-   React Router
-   Axios
-   Material UI / Tailwind CSS
-   SwiperJS

### Backend

-   Node.js + Express
-   MongoDB (Atlas)
-   Mongoose
-   Bcrypt

## Cấu trúc thư mục

```bash
recipe_website/
├── backend/              # API backend (Node.js + Express)
│   ├── config/
│   ├── controllers/
├   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   ├── utils/
│   ├── server/
│
├── frontend/             # Giao diện người dùng (React)
│   ├── public/
│   ├── src/
├── README.md
```

## Chạy và cài đặt dự án

git clone https://github.com/WebsiteRatatouille/Recipe_Website.git
cd recipe_website

### Cài đặt backend

cd backend 
npm install 
npm run dev 

### Cài đặt frontend

cd frontend 
npm install 
npm start 

## Thành viên thực hiện

Họ tên Mã sinh viên Lớp 
Nguyễn Đức Lộc N22DCCN150 D22CQCN02-N 
Nguyễn Hữu Huynh N22DCCN135 D22CQCN02-N 
Mai Vũ Tuấn Minh N22DCCN152 D22CQCN02-N 

## Ghi chú

Đây là đồ án môn học nhằm rèn luyện kỹ năng fullstack web development
