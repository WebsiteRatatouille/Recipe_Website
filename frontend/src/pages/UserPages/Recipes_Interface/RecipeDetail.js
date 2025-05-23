import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./RecipeDetail.css";

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/recipes/${id}`
        );
        setRecipe(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading)
    return <div className="recipe-detail-container">Đang tải...</div>;
  if (error) return <div className="recipe-detail-container">Lỗi: {error}</div>;
  if (!recipe)
    return (
      <div className="recipe-detail-container">Không tìm thấy công thức</div>
    );

  return (
    <div className="recipe-detail-container">
      <div className="recipe-content">
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.title}</h1>
        </div>

        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        )}

        <div className="recipe-info">
          <div className="info-item">
            <span className="text-xl">⏱️</span>
            <span>{recipe.cookingTime} phút</span>
          </div>
          <div className="info-item">
            <span className="text-xl">👥</span>
            <span>{recipe.servings} người</span>
          </div>
        </div>

        <div className="recipe-card">
          <p className="recipe-description">{recipe.description}</p>

          <div className="mb-6">
            <h2 className="section-title">Nguyên liệu</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="section-title">Cách làm</h2>
            <div className="instructions">{recipe.instructions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
