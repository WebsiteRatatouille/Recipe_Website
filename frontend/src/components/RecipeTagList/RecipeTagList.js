import React from "react";
import "./RecipeTagList.css";
import RecipeTag from "../RecipeTag/RecipeTag";

function RecipeTagList() {
    const RecipeTags = [
        { name: "Bữa sáng", link: "#" },
        { name: "Bữa trưa", link: "#" },
        { name: "Bữa tối", link: "#" },
        { name: "Ăn nhẹ", link: "#" },
        { name: "Tráng miệng", link: "#" },
        { name: "Nước ép", link: "#" },
        { name: "Chế biến nhanh", link: "#" },
        { name: "Đồ chay", link: "#" },
    ];

    return (
        <div className="recipe-tag-list-wrapper">
            <h5 className="title">Khám phá</h5>
            <div className="recipe-tag-list">
                {RecipeTags.map((item, index) => (
                    <RecipeTag name={item.name} link={index.link} />
                ))}
            </div>
        </div>
    );
}

export default RecipeTagList;
