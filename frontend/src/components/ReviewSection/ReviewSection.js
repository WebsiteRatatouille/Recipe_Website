import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./ReviewSection.css";

const ReviewSection = ({ blogId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    // Lấy danh sách review
    useEffect(() => {
        if (!blogId) return;
        setLoading(true);
        axios
            .get(`/api/blogreviews?blogId=${blogId}`)
            .then((res) => setReviews(res.data))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [blogId]);

    // Gửi review mới
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            await axios.post(
                "/api/blogreviews",
                { blogId, rating, text: review },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setReview("");
            setRating(0);
            // Reload reviews
            const res = await axios.get(`/api/blogreviews?blogId=${blogId}`);
            setReviews(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        }
        setSubmitting(false);
    };

    return (
        <div className="blog-review-section">
            <h2>Reviews ({reviews.length})</h2>
            {!user ? (
                <div className="review-login-warning">Đăng nhập để sử dụng tính năng</div>
            ) : (
                <form className="review-form" onSubmit={handleSubmit}>
                    <div className="rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= (hover || rating) ? "star filled" : "star"}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Bạn nghĩ gì về bài viết này?"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        disabled={submitting}
                    />
                    {error && <div className="review-error">{error}</div>}
                    <button type="submit" disabled={!rating || !review || submitting}>
                        Gửi đánh giá
                    </button>
                </form>
            )}
            {/* {loading ? (
                <div>Đang tải đánh giá...</div>
            ) : ( */}
            <div className="review-list">
                {reviews.map((r, idx) => (
                    <div className="review-item" key={r._id || idx}>
                        <div className="review-header">
                            <span className="review-name">{r.name}</span>
                            <span className="review-date">
                                {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                            <span className="review-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={star <= r.rating ? "star filled" : "star"}
                                    >
                                        ★
                                    </span>
                                ))}
                            </span>
                        </div>
                        <div className="review-text">{r.text}</div>
                    </div>
                ))}
            </div>
            {/* )} */}
        </div>
    );
};

export default ReviewSection;
