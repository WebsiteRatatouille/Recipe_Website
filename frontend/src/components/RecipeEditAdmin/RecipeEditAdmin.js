import React, { useEffect, useState } from "react";
import "./RecipeEditAdmin.css";
import axios from "axios";

function RecipeEditAdmin({ recipe }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        imageThumb: "",
        cookingTime: "",
        serves: 0,
        calories: 0,
        origin: "",
        videoUrl: "",
        tags: "",
    });

    useEffect(() => {
        if (recipe) {
            setFormData({
                title: recipe.title || "",
                description: recipe.description || "",
                ingredients: recipe.ingredients?.join("\n") || "",
                steps: recipe.steps?.join("\n") || "",
                imageThumb: recipe.imageThumb || "",
                images: recipe.images || "",
                cookingTime: recipe.cookingTime || "",
                serves: recipe.serves || 0,
                calories: recipe.calories || 0,
                origin: recipe.origin || "",
                videoUrl: recipe.videoUrl || "",
                tags: recipe.tags?.join(", ") || "",
            });
        }
    }, [recipe]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleChangeMainImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const form = new FormData();
        form.append("image", file);

        try {
            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };

            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/upload`,
                form,
                config
            );

            // update formData.imageThumb
            setFormData((prev) => ({
                ...prev,
                imageThumb: res.data.url,
            }));
        } catch (err) {
            console.error("Lỗi khi tải ảnh đại diện:", err);
            alert("Tải ảnh thất bại!");
        }
    };

    const mainImage = formData.imageThumb;
    const subImages = Array.isArray(formData.images)
        ? formData.images.filter((img) => img !== formData.imageThumb)
        : [];

    return (
        <div className="recipe-edit-admin-container">
            <div className="recipe-edit-admin-header">
                <h1>Chỉnh sửa công thức</h1>
            </div>

            <div className="recipe-edit-admin-form">
                <div className="image-upload-section">
                    {/* Ảnh đại diện */}
                    <div className="main-image-section">
                        <h4>Ảnh đại diện</h4>
                        <label
                            htmlFor="imageThumbInput"
                            style={{ display: "block", cursor: "pointer" }}
                        >
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt="Ảnh đại diện"
                                    style={{
                                        maxWidth: "100%",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        marginBottom: "10px",
                                    }}
                                />
                            ) : (
                                <p>Chưa có ảnh đại diện</p>
                            )}
                        </label>
                        <input
                            id="imageThumbInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleChangeMainImage}
                        />
                    </div>

                    {/* Ảnh phụ */}
                    <div className="sub-images-section">
                        <h4>Ảnh phụ</h4>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {subImages.length > 0 ? (
                                subImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Ảnh phụ ${idx + 1}`}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                ))
                            ) : (
                                <p>Không có ảnh phụ</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="recipe-details-section">
                    <div className="form-group">
                        <label htmlFor="title">Tiêu đề món ăn</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ingredients">Nguyên liệu (mỗi nguyên liệu 1 dòng)</label>
                        <textarea
                            id="ingredients"
                            value={formData.ingredients}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="steps">Hướng dẫn (mỗi bước 1 dòng)</label>
                        <textarea
                            id="steps"
                            value={formData.steps}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cookingTime">Thời gian nấu</label>
                        <input
                            type="text"
                            id="cookingTime"
                            value={formData.cookingTime}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="serves">Khẩu phần</label>
                        <input
                            type="number"
                            id="serves"
                            min="0"
                            value={formData.serves}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="calories">Calories</label>
                        <input
                            type="number"
                            id="calories"
                            min="0"
                            value={formData.calories}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="origin">Nguồn gốc</label>
                        <input
                            type="text"
                            id="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="videoUrl">Video URL</label>
                        <input
                            type="text"
                            id="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</label>
                        <input
                            type="text"
                            id="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button className="cancel_button">HỦY</button>
                <button className="submit_button">LƯU</button>
            </div>
        </div>
    );
}

export default RecipeEditAdmin;
