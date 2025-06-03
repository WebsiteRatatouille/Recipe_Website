import React, { useState, useEffect } from "react";
import "./RecipeCard.css";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";

function RecipeCard({ image, name, link, id }) {
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
    if (isLoading) return;

    try {
      setIsLoading(true);
      if (isFavorite) {
        await axios.delete(`/api/recipes/${id}/favorite`);
      } else {
        await axios.post(`/api/recipes/${id}/favorite`);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", error);
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
