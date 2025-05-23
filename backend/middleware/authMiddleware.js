// backend/middleware/authMiddleware.js

// Middleware mẫu cho phép qua luôn (bỏ qua xác thực)
const protect = (req, res, next) => {
  next();
};

module.exports = { protect };
