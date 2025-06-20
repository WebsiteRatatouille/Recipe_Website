import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Box } from "@mui/material";
import "./BlogEditAdmin.css";

const BlogEditAdmin = ({ blog, onClose, onUpdated }) => {
    const [title, setTitle] = useState(blog?.title || "");
    const [summary, setSummary] = useState(blog?.summary || "");
    const [content, setContent] = useState(blog?.content || "");
    const [author, setAuthor] = useState(blog?.author || "");
    const [image, setImage] = useState(blog?.image || "");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            let imageUrl = image;
            if (imageFile) {
                const form = new FormData();
                form.append("image", imageFile);
                const res = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/cloudinary/blogs/upload-image`,
                    form,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                imageUrl = res.data.url;
            }
            const token = localStorage.getItem("token");
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/blogs/${blog._id}`,
                { title, summary, content, author, image: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onUpdated) onUpdated();
            if (onClose) onClose();
        } catch (err) {
            setError("Cập nhật blog thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-edit-admin">
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} required />
                <TextField label="Tóm tắt" value={summary} onChange={e => setSummary(e.target.value)} required />
                <TextField label="Nội dung" value={content} onChange={e => setContent(e.target.value)} required multiline minRows={4} />
                <TextField label="Tác giả" value={author} onChange={e => setAuthor(e.target.value)} required />
                <TextField label="Ngày tạo" value={blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""} InputProps={{ readOnly: true }} disabled />
                <TextField label="Up date on" value={blog?.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : ""} InputProps={{ readOnly: true }} disabled />
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {image && !imagePreview && <img src={image} alt="current" style={{maxWidth: 200, marginTop: 8}} />}
                {imagePreview && <img src={imagePreview} alt="preview" style={{maxWidth: 200, marginTop: 8}} />}
                {error && <div style={{ color: "red" }}>{error}</div>}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button onClick={onClose} color="inherit" disabled={loading}>Huỷ</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>Lưu</Button>
                </Box>
            </Box>
        </div>
    );
};

export default BlogEditAdmin; 