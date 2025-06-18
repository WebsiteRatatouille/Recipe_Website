import React, { useEffect, useState } from "react";
import BlogPostCard from "./components/BlogPostCard";
import axios from "../../../utils/axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("/api/blogs")
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Tìm Ý Tưởng Mới ? Đọc bài viết dưới đây</h2>
      {blogs.map(blog => (
        <BlogPostCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList; 