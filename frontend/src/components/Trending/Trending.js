import React from "react";
import "./Trending.css";
import RecipeGrid from "../RecipeGrid/RecipeGrid";

import TrendingRecipeImage1 from "../../assets/img/trending-now.webp";
import TrendingRecipeImage2 from "../../assets/img/trending-now-2.webp";
import TrendingRecipeImage3 from "../../assets/img/trending-now-3.webp";
import TrendingRecipeImage4 from "../../assets/img/trending-now-4.webp";

function Trending() {
    const trendingRecipes = [
        {
            image: TrendingRecipeImage1,
            name: "Bánh waffle siro bơ",
            link: "#",
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
