import React from "react";
import "./AdminRecipes.css";
import RecipeTable from "../../../components/RecipeTable/RecipeTable";

function AdminRecipes() {
    return (
        <div className="admin-recipes-wrapper">
            <h1>this is admin recipe </h1>
            <div className="content">
                <RecipeTable />
            </div>
        </div>
    );
}

export default AdminRecipes;
