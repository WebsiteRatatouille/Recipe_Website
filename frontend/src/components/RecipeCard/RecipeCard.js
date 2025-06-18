import React, { useState, useEffect } from "react";
import "./RecipeCard.css";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

function RecipeCard({ image, name, link, views, id }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem công thức có trong danh sách yêu thích không
    const checkFavoriteStatus = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}/favorite-status`);
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
      }
    };

    checkFavoriteStatus();
  }, [id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      toast.info("Vui lòng đăng nhập để sử dụng tính năng yêu thích!");
      return;
    }
    if (isLoading) return;
    try {
      setIsLoading(true);
      if (isFavorite) {
        await axios.delete(`/api/recipes/${id}/favorite`);
        setIsFavorite(false);
        toast.info("Đã xóa khỏi công thức yêu thích!");
      } else {
        await axios.post(`/api/recipes/${id}/favorite`);
        setIsFavorite(true);
        toast.success("Đã thêm vào công thức yêu thích!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recipe-card">
      <div className="col">
        <Link className="card-link" to={link}>
          <div className="card">
            <img loading="lazy" src={image} alt="Food" />
            <div className="card-body">
              <h5 className="card-title">{name}</h5>
              <p className="views"> {views} lượt xem</p>
            </div>
            <i
              className={`bx bxs-heart favorite-icon ${
                isFavorite ? "favorited" : ""
              }`}
              onClick={handleFavoriteClick}
            ></i>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default React.memo(RecipeCard);
