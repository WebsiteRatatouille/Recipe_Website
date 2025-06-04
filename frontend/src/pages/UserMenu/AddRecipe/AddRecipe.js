import React, { useState, useEffect } from "react";
import "./AddRecipe.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Define backend API base URL
const API_BASE_URL = "http://localhost:5000";

function AddRecipe() {
    const navigate = useNavigate();
    const { id: recipeId } = useParams();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        imageThumb: "",
        images: [],
        videoUrl: "",
        category: "",
        categoryDisplay: "",
        cookingTime: "",
        serves: 0,
        tags: "",
        calories: 0,
        origin: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
        if (recipeId) {
            setIsEditing(true);
            const fetchRecipe = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}`);
                    // Populate form data with fetched recipe data
                    setFormData({
                        title: response.data.title || "",
                        description: response.data.description || "",
                        ingredients: response.data.ingredients.join("\n") || "",
                        steps: response.data.steps.join("\n") || "",
                        imageThumb: response.data.imageThumb || "",
                        images: response.data.images || [],
                        videoUrl: response.data.videoUrl || "",
                        category: response.data.category || "",
                        categoryDisplay: response.data.categoryDisplay || "",
                        cookingTime: response.data.cookingTime || "",
                        serves: response.data.serves || 0,
                        tags: response.data.tags.join(", ") || "",
                        calories: response.data.calories || 0,
                        origin: response.data.origin || "",
                    });
                    setLoading(false);
                } catch (err) {
                    console.error("Error fetching recipe for editing:", err);
                    setError("Không thể tải dữ liệu công thức.");
                    setLoading(false);
                }
            };
            fetchRecipe();
        } else {
            setIsEditing(false);
            // Reset form for adding new recipe
            setFormData({
                title: "",
                description: "",
                ingredients: "",
                steps: "",
                imageThumb: "",
                images: [],
                videoUrl: "",
                category: "",
                categoryDisplay: "",
                cookingTime: "",
                serves: 0,
                tags: "",
                calories: 0,
                origin: "",
            });
        }
    }, [recipeId]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            setUploadError(null);
            const formData = new FormData();
            formData.append("image", file);

            try {
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
                const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, config);
                setFormData((prevData) => ({
                    ...prevData,
                    imageThumb: response.data.url,
                }));
                console.log("Image uploaded successfully:", response.data.url);
            } catch (err) {
                console.error("Error uploading image:", err);
                setUploadError("Không thể tải ảnh lên.");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleCancel = () => {
        navigate("/my-recipes");
    };
    // ======= thay doi o day
    const validateForm = () => {
        const {
            title,
            description,
            ingredients,
            steps,
            imageThumb,
            cookingTime,
            serves,
            calories,
            origin,
            videoUrl,
            tags,
        } = formData;

        return (
            title.trim() &&
            description.trim() &&
            ingredients.trim() &&
            steps.trim() &&
            imageThumb.trim() &&
            cookingTime.trim() &&
            origin.trim() &&
            videoUrl.trim() &&
            tags.trim() &&
            parseInt(serves) > 0 &&
            parseInt(calories) > 0
        );
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setError("Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const dataToSend = {
                ...formData,
                ingredients: formData.ingredients
                    .split("\n")
                    .map((item) => item.trim())
                    .filter((item) => item !== ""),
                steps: formData.steps
                    .split("\n")
                    .map((item) => item.trim())
                    .filter((item) => item !== ""),
                tags: formData.tags
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item !== ""),
                serves: parseInt(formData.serves) || 0,
                calories: parseInt(formData.calories) || 0,
            };

            if (isEditing) {
                await axios.put(`${API_BASE_URL}/api/recipes/${recipeId}`, dataToSend);
                console.log("Công thức đã được cập nhật.");
            } else {
                await axios.post(`${API_BASE_URL}/api/recipes`, dataToSend);
                console.log("Công thức mới đã được tạo.");
            }
            navigate("/my-recipes");
        } catch (err) {
            console.error("Error submitting recipe:", err);
            setError("Không thể lưu công thức.");
        } finally {
            setLoading(false);
        }
    };
    // ======= thay doi o day

    return (
        <div className="add-recipe-container">
            <div className="add-recipe-header">
                <h1>{isEditing ? "Chỉnh sửa công thức" : "Thêm công thức mới"}</h1>
            </div>

            <div className="add-recipe-form">
                <div className="image-upload-section">
                    <input
                        type="file"
                        id="imageFile"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                    />
                    <label htmlFor="imageFile" className="upload-box">
                        {uploading ? (
                            <p>Đang tải ảnh...</p>
                        ) : uploadError ? (
                            <p className="error-message">{uploadError}</p>
                        ) : formData.imageThumb ? (
                            <img
                                src={formData.imageThumb}
                                alt="Thumbnail"
                                className="uploaded-thumbnail"
                            />
                        ) : (
                            <>
                                <i className="fas fa-camera"></i>
                                <p>ĐĂNG TỪ 01 ĐẾN 06 HÌNH</p>
                            </>
                        )}
                    </label>
                </div>

                <div className="recipe-details-section">
                    {loading && <p>Đang tải dữ liệu...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <>
                            <div className="warning-message">
                                <i className="fas fa-exclamation-circle"></i>
                                <p>Vui lòng điền đầy đủ trước khi Đăng tải</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Tiêu đề món ăn</label>
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Mô tả</label>
                                <textarea
                                    id="description"
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ingredients">
                                    Nguyên liệu (mỗi nguyên liệu 1 dòng)
                                </label>
                                <textarea
                                    id="ingredients"
                                    required
                                    value={formData.ingredients}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="steps">Hướng dẫn (mỗi bước 1 dòng)</label>
                                <textarea
                                    id="steps"
                                    required
                                    value={formData.steps}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cookingTime">Thời gian nấu</label>
                                <input
                                    type="text"
                                    id="cookingTime"
                                    required
                                    value={formData.cookingTime}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="serves">Khẩu phần</label>
                                <input
                                    type="number"
                                    id="serves"
                                    value={formData.serves}
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="calories">Calories</label>
                                <input
                                    type="number"
                                    id="calories"
                                    required
                                    value={formData.calories}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="origin">Nguồn gốc</label>
                                <input
                                    type="text"
                                    id="origin"
                                    required
                                    value={formData.origin}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="videoUrl">Video URL</label>
                                <input
                                    type="text"
                                    id="videoUrl"
                                    required
                                    value={formData.videoUrl}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    required
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="form-actions">
                <button className="cancel_button" onClick={handleCancel}>
                    HỦY
                </button>
                <button className="submit_button" onClick={handleSubmit}>
                    ĐĂNG TẢI
                </button>
            </div>
        </div>
    );
}

export default AddRecipe;
