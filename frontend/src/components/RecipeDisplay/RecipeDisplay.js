import React from "react";
import "./RecipeDisplay.css";

import RecipeGrid from "../RecipeGrid/RecipeGrid";

function RecipeDisplay({ paginatedRecipes }) {
    return (
        <div className="recipe-display">
            <RecipeGrid recipeList={paginatedRecipes} />
        </div>
    );
}

export default RecipeDisplay;
