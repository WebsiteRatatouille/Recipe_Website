import React, { useEffect, useState } from "react";
import BlogPostCard from "./BlogPostCard";
import axios from "../../../../utils/axios";
import "./BlogList.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("/api/blogs")
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="blog-list-container">
      <h2 className="blog-list-title">Tìm Ý Tưởng Mới ? Đọc bài viết dưới đây</h2>
      {blogs.map(blog => (
        <BlogPostCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList; 