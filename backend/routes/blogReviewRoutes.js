const express = require("express");
const router = express.Router();
const blogReviewController = require("../controllers/blogReviewController");
const auth = require("../middleware/auth"); // middleware xác thực

// Lấy danh sách review theo blogId
router.get("/", blogReviewController.getReviewsByBlog);
// Thêm review mới (yêu cầu đăng nhập)
router.post("/", auth, blogReviewController.createReview);

module.exports = router;
