import React from "react";
import "./MyRecipes.css";

function MyRecipes() {
  return (
    <div className="my-recipes-container">
      <div className="recipes-header">
        <h1>Quản lý công thức</h1>
      </div>

      <div className="recipes-content">
        <div className="recipes-actions">
          <button className="add-recipe-btn">
            <i className="fas fa-plus"></i>
            Thêm công thức mới
          </button>
        </div>

        <div className="recipes-list">
          {/* TODO: Implement recipes list */}
          <p className="no-recipes-message">
            Bạn chưa có công thức nào. Hãy thêm công thức mới!
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyRecipes;
