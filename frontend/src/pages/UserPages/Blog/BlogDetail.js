import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../utils/axios";
import ReviewSection from "./components/ReviewSection";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`/api/blogs/${id}`)
      .then(res => setBlog(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!blog) return <div>Đang tải...</div>;

  return (
    <div className="blog-detail-container">
      <h1 className="blog-title">{blog.title}</h1>
      {/* Nếu có rating trung bình, hiển thị ở đây */}
      {/* <div className="blog-rating">★ 4.9</div> */}
      <div className="blog-desc">{blog.content}</div>
      <div className="blog-meta">
        <span>Submitted by <b>France C</b></span>
        <span className="blog-date"> | Updated on {new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="blog-actions">
        <button className="save-btn">SAVE <span>♡</span></button>
        {/* Thêm các nút khác nếu muốn */}
      </div>
      {blog.image && (
        <div className="blog-image">
          <img src={blog.image} alt={blog.title} />
        </div>
      )}
      <ReviewSection blogId={blog._id} />
    </div>
  );
};

export default BlogDetail; 