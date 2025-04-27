import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { RecipeMenuContext } from "../../../context/RecipeMenuContext";
import "./Recipes.css";
import { menu_list } from "../../../assets/frontend_assets/assets";

import RecipesPageBgImage from "../../../assets/img/recipes-background.webp";
import SearchBar from "../../../components/SearchBar/SearchBar";
import ExploreRecipeMenu from "../../../components/ExploreRecipeMenu/ExploreRecipeMenu";
import RecipeDisplay from "../../../components/RecipeDisplay/RecipeDisplay";
import RecipeTagList from "../../../components/RecipeTagList/RecipeTagList";
import PagePagination from "../../../components/PagePagination/PagePagination";

function Recipes() {
    const { food_list } = useContext(RecipeMenuContext);
    // console.log("food_list", food_list);

    const [category, setCategory] = useState("All");

    const [currPage, setCurrPage] = useState(1);
    const [limit, setLimit] = useState(16);

    // Filter the recipe list by category
    let filteredRecipes = [];
    filteredRecipes =
        category === "All" ? food_list : food_list.filter((recipe) => recipe.category === category);

    // Reset currPage to 1 whenever the selected category changes
    useEffect(() => {
        setCurrPage(1);
    }, [category]);

    // console.log("filteredRecipes", filteredRecipes);

    let totalPage = Math.ceil(filteredRecipes.length / limit);

    // Paginate the filtered recipes based on the current page and limit per page
    let paginatedRecipes = [];
    paginatedRecipes = filteredRecipes.slice((currPage - 1) * limit, currPage * limit);
    // console.log("paginatedRecipes", paginatedRecipes);

    // handle page change
    function handlePageChange(value) {
        console.log(currPage);
        if (value === "<<") {
            setCurrPage(1);
        } else if (value === "<") {
            if (currPage !== 1) {
                setCurrPage(currPage - 1);
            }
        } else if (value === ">") {
            if (currPage !== totalPage) {
                setCurrPage(currPage + 1);
            }
        } else if (value === ">>") {
            setCurrPage(totalPage);
        } else if (value === " ..." || value === "... ") {
            setCurrPage(currPage);
        } else {
            setCurrPage(value);
        }
    }

    return (
        <div className="recipes">
            <div className="recipes-background">
                <img src={RecipesPageBgImage} alt="Recipes page background" />
            </div>

            <div className="recipes-body-wrapper">
                <div className="title">
                    <h1>Công thức & Ý tưởng nấu ăn</h1>
                    <p>
                        Chúng tôi hiểu những băn khoăn của bạn. Chúng tôi đồng hành cùng bạn. Đây là
                        những công thức nấu ăn tuyệt vời, được thử nghiệm và tinh chỉnh để giúp bạn
                        chuẩn bị những bữa ăn ngon cho gia đình.
                    </p>
                </div>

                <SearchBar />
                <RecipeTagList />
                <ExploreRecipeMenu
                    category={category}
                    setCategory={setCategory}
                    menu_list={menu_list}
                />
                <RecipeDisplay paginatedRecipes={paginatedRecipes} />
                <PagePagination
                    totalPage={totalPage}
                    currPage={currPage}
                    limit={limit}
                    siblings={1}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default Recipes;
