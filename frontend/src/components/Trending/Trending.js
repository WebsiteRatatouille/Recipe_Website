import React, { useEffect, useState } from "react";
import "./Trending.css";
import RecipeGrid from "../RecipeGrid/RecipeGrid";
import axios from "axios";

import TrendingRecipeImage1 from "../../assets/img/trending-now.webp";
import TrendingRecipeImage2 from "../../assets/img/trending-now-2.webp";
import TrendingRecipeImage3 from "../../assets/img/trending-now-3.webp";
import TrendingRecipeImage4 from "../../assets/img/trending-now-4.webp";

function Trending() {
  const trendingRecipes = [
    {
      image: TrendingRecipeImage1,
      name: "Bánh waffle siro bơ",
      link: "/recipe/6830a2c80cf4221ecc6f1ef8",
    },
    {
      image: TrendingRecipeImage2,
      name: "Bò hầm kiểu Pháp",
      link: "#",
    },
    {
      image: TrendingRecipeImage3,
      name: "Bánh táo Crumble",
      link: "#",
    },
    {
      image: TrendingRecipeImage4,
      name: "Chocolate Mousse",
      link: "#",
    },
  ];

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  }, [id]);

  if (!recipe && !loading) return <div>Không tìm thấy công thức</div>;

  return (
    <div className="trending-wrapper">
      <div className="trending-title">
        <h2>Xu hướng</h2>
      </div>
      <RecipeGrid recipeList={trendingRecipes} />
    </div>
  );
}

export default Trending;
