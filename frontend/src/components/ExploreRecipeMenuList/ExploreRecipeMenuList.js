import React from "react";
import "./ExploreRecipeMenuList.css";

function ExploreRecipeMenuList({ list, category, setCategory }) {
    return (
        <div className="explore-recipe-menu-list">
            {list.map((item, index) => (
                <div
                    onClick={() =>
                        setCategory((prev) =>
                            prev === item.menu_name
                                ? "All"
                                : item.menu_name
                        )
                    }
                    key={index}
                    className="explore-menu-item"
                >
                    <img
                        className={
                            category === item.menu_name
                                ? "active"
                                : ""
                        }
                        src={item.menu_image}
                        alt="Food image"
                    />
                    <p>{item.menu_name}</p>
                </div>
            ))}
        </div>
    );
}

export default ExploreRecipeMenuList;
