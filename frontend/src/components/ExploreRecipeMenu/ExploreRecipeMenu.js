import React from "react";
import "./ExploreRecipeMenu.css";

import ExploreRecipeMenuList from "../ExploreRecipeMenuList/ExploreRecipeMenuList";
import SmallLineSeparator from "../SmallLineSeparator/SmallLineSeparator";

function ExploreRecipeMenu({ category, setCategory, menu_list }) {
    return (
        <div className="explore-recipe-menu" id="explore-recipe-menu">
            <h2>Khám phá công thức</h2>
            <ExploreRecipeMenuList
                list={menu_list}
                category={category}
                setCategory={setCategory}
            />
            <SmallLineSeparator />
        </div>
    );
}

export default ExploreRecipeMenu;
