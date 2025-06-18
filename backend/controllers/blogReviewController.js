const BlogReview = require('../models/BlogReview');

// Lấy danh sách review theo blogId
exports.getReviewsByBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    if (!blogId) return res.status(400).json({ message: 'Thiếu blogId' });
    const reviews = await BlogReview.find({ blogId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm review mới (yêu cầu userId)
exports.createReview = async (req, res) => {
  try {
    const { blogId, rating, text } = req.body;
    const userId = req.user?._id;
    const name = req.user?.username || req.user?.name || "User";
    if (!userId) {
      return res.status(401).json({ message: "Đăng nhập để sử dụng tính năng" });
    }
    if (!blogId || !rating || !text) {
      return res.status(400).json({ message: "Thiếu thông tin review" });
    }
    const review = new BlogReview({ blogId, userId, name, rating, text });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 