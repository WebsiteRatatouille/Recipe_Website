import React, { useEffect, useState } from "react";
import BlogPostCard from "../BlogPostCard/BlogPostCard";
import axios from "../../utils/axios";
import "./BlogList.css";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios
            .get("/api/blogs")
            .then((res) => setBlogs(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="blog-list-container">
            <h2 className="blog-list-title">Tìm Ý Tưởng Mới ? Đọc các bài viết do các Admin Ratatouille ngay !</h2>
            {blogs.map((blog) => (
                <BlogPostCard key={blog._id} blog={blog} />
            ))}
            <div className="forum-cta-box">
                THAM GIA NGAY DIỄN ĐÀN ĐỂ KẾT NỐI VỚI MỌI NGƯỜI
            </div>
        </div>
    );
};

export default BlogList;
