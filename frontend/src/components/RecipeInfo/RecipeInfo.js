import React from "react";
import "./RecipeInfo.css";
import Profile from "../../assets/img/ratatouille-icon.png";
import RecipeSwiper from "../RecipeSwiper/RecipeSwiper";

import SmallLineSeparator from "../SmallLineSeparator/SmallLineSeparator";
import RecipeIngredient from "../RecipeIngredient/RecipeIngredient";
import RecipeDirection from "../RecipeDirection/RecipeDirection";

function RecipeInfo({ recipe, recipeImageList }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAuthor = currentUser && recipe.createdBy?._id === currentUser.id;

  return (
    <div className="recipe-info-wrapper">
      <h1 className="recipe-title">{recipe.title}</h1>

      <div className="recipe-detail">
        <div className="author">
          <span> Được đăng tải bởi</span>
          <img
            src={Profile}
            alt="User"
            className="user-icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
          <span style={{ fontWeight: "bold" }}>
            {isAuthor
              ? currentUser.name || currentUser.username
              : recipe.createdBy?.name || recipe.createdBy?.username}
          </span>
        </div>

        <p>&quot;{recipe.description}&quot;</p>

        <div className="swiper-container">
          <RecipeSwiper recipeImageList={recipeImageList} />
        </div>

        <div className="cooking-detail">
          <span>
            <i className="bx  bx-stopwatch"></i> Thời gian nấu:{" "}
            <span style={{ fontWeight: "bold" }}>{recipe.cookingTime}</span>
          </span>

          <span>
            <i className="bx  bx-bowl-hot"></i> Phục vụ:{" "}
            <span style={{ fontWeight: "bold" }}>{recipe.serves} người</span>
          </span>
          <span>
            <i class="bx  bx-fork"></i> Dinh dưỡng:{" "}
            <span style={{ fontWeight: "bold" }}>{recipe.calories} calo</span>
          </span>

          <span>
            <i class="bx  bx-globe"></i> Nguồn gốc:{" "}
            <span style={{ fontWeight: "bold" }}>{recipe.origin} </span>
          </span>
        </div>
        <SmallLineSeparator />
      </div>
    </div>
  );
                    <span>
                        <i class="bx  bx-globe"></i> Nguồn gốc:{" "}
                        <span style={{ fontWeight: "bold" }}>{recipe.origin} </span>
                    </span>
                </div>
                <SmallLineSeparator />
                <RecipeIngredient ingredients={recipe.ingredients} />
                <RecipeDirection steps={recipe.steps} />
            </div>
        </div>
    );
}

export default RecipeInfo;
