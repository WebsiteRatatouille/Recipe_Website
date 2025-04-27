import { createContext } from "react";
import React from "react";
import { food_list } from "../assets/frontend_assets/assets";

export const RecipeMenuContext = createContext(null);

function RecipeMenuProvider(props) {
    const contextValue = {
        food_list,
    };
    return (
        <RecipeMenuContext.Provider value={contextValue}>
            {props.children}
        </RecipeMenuContext.Provider>
    );
}

export default RecipeMenuProvider;
