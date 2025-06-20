import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Box, Snackbar, Alert } from "@mui/material";
import "./BlogAddAdmin.css";

const BlogAddAdmin = ({ onClose, onAdded }) => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="blog-add-admin">
            <Box component="form" onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setSuccess("");
                if (!title.trim() || !summary.trim() || !content.trim() || !author.trim()) {
                    setError("Vui lòng nhập tiêu đề, tóm tắt, nội dung và tác giả!");
                    return;
                }
                setLoading(true);
                try {
                    let imageUrl = "";
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
                    const updatedAt = new Date().toISOString();
                    await axios.post(
                        `${process.env.REACT_APP_API_URL}/api/blogs`,
                        { title, summary, content, author, image: imageUrl, updatedAt },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSuccess("Thêm blog thành công!");
                    setTitle("");
                    setSummary("");
                    setContent("");
                    setAuthor("");
                    setImageFile(null);
                    setImagePreview("");
                    if (onAdded) onAdded();
                    if (onClose) onClose();
                } catch (err) {
                    setError("Thêm blog thất bại!");
                } finally {
                    setLoading(false);
                }
            }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} required />
                <TextField label="Tóm tắt" value={summary} onChange={e => setSummary(e.target.value)} required />
                <TextField label="Nội dung" value={content} onChange={e => setContent(e.target.value)} required multiline minRows={4} />
                <TextField label="Tác giả" value={author} onChange={e => setAuthor(e.target.value)} required />
                <input
                    id="blog-image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
                <label htmlFor="blog-image-upload">
                    <Button variant="outlined" component="span">Chọn ảnh</Button>
                </label>
                {imagePreview && <img src={imagePreview} alt="preview" style={{maxWidth: 200, marginTop: 8}} />}
                {error && <div style={{ color: "red" }}>{error}</div>}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button onClick={onClose} color="inherit" disabled={loading}>Huỷ</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>Thêm</Button>
                </Box>
            </Box>
            <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={() => setSuccess("")} severity="success" variant="filled" sx={{ width: "100%", fontWeight: "bold" }}>{success}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={() => setError("")} severity="error" variant="filled" sx={{ width: "100%", fontWeight: "bold" }}>{error}</Alert>
            </Snackbar>
        </div>
    );
};

export default BlogAddAdmin; 