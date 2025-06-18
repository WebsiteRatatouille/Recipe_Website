import React from "react";
import { Link } from "react-router-dom";
import "./BlogPostCard.css";

const BlogPostCard = ({ blog }) => (
  <div className="blog-post-item">
    <div className="blog-post-image">
      <Link to={`/blogs/${blog._id}`}>
        <img src={blog.image} alt={blog.title} />
      </Link>
    </div>
    <div className="blog-post-content">
      <Link to={`/blogs/${blog._id}`} className="blog-post-title">
        <h2>{blog.title}</h2>
      </Link>
      <p className="blog-post-desc">{blog.content.slice(0, 120)}...</p>
      <Link to={`/blogs/${blog._id}`} className="blog-post-readmore">
        Đọc tiếp &rarr;
      </Link>
    </div>
  </div>
);

export default BlogPostCard; 