import React, { useEffect, useState } from "react";
import "./Recipes.css";

import axios from "axios";
import { startProgress, stopProgress } from "../../../utils/NProgress/NProgress";

import RecipesPageBgImage from "../../../assets/img/recipes-background.webp";
import SearchBar from "../../../components/SearchBar/SearchBar";
import ExploreRecipeMenu from "../../../components/ExploreRecipeMenu/ExploreRecipeMenu";
import RecipeTagList from "../../../components/RecipeTagList/RecipeTagList";
import PagePagination from "../../../components/PagePagination/PagePagination";
import RecipeGrid from "../../../components/RecipeGrid/RecipeGrid";
import RecipeSkeletonGrid from "../../../components/RecipeSkeletonGrid/RecipeSkeletonGrid";
import SmallLineSeparator from "../../../components/SmallLineSeparator/SmallLineSeparator";

function Recipes() {
    const [recipeList, setRecipeList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [randomTags, setRandomTags] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [categoryError, setCategoryError] = useState(null);
    const [recipeLoading, setRecipeLoading] = useState(true);
    const [recipeError, setRecipeError] = useState(null);
    const [recipeFilterLoading, setRecipeFilterLoading] = useState(false);
    const [category, setCategory] = useState("All");
    const [currPage, setCurrPage] = useState(1);
    const [limit, setLimit] = useState(16);
    const [searchQuery, setSearchQuery] = useState("");

    // Get All Categories
    useEffect(() => {
        const fetchCategories = async () => {
            startProgress();

            setCategoryLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
                setCategoryList(res.data);
            } catch (err) {
                console.error("Lỗi khi fetch danh mục:", err);
                setCategoryError("Không thể tải danh sách danh mục");
            } finally {
                setCategoryLoading(false);
                stopProgress();
            }
        };

        fetchCategories();
    }, []);

    // Get ALL Recipes
    useEffect(() => {
        const fetchRecipes = async () => {
            startProgress();
            setRecipeLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/all-recipes-only`
                );
                console.log("Dữ liệu lấy về:", res.data);
                // Đảm bảo recipeList luôn là một mảng
                const recipes = Array.isArray(res.data)
                    ? res.data
                    : res.data.recipes && Array.isArray(res.data.recipes)
                    ? res.data.recipes
                    : [];
                setRecipeList(recipes);
            } catch (err) {
                console.error("Lỗi khi fetch danh sách công thức:", err);
                setRecipeError("Không thể tải danh sách công thức");
                setRecipeList([]); // Đặt về mảng rỗng nếu có lỗi
            } finally {
                setRecipeLoading(false);
                stopProgress();
            }
        };

        fetchRecipes();
    }, []);

    useEffect(() => {
        const fetchRandomTags = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/random-tags`
                );
                console.log("Dữ liệu tag ngẫu nhiên:", res.data);
                setRandomTags(res.data);
            } catch (err) {
                console.error("Lỗi khi fetch tag ngẫu nhiên:", err);
            }
        };

        fetchRandomTags();
    }, []);

    // Display skeleton card when changing Category filter
    useEffect(() => {
        setRecipeFilterLoading(true);

        const timeout = setTimeout(() => {
            setRecipeFilterLoading(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [category]);

    // Filter the recipe list by category and search
    const searchLower = searchQuery.toLowerCase();

    let filteredRecipes = recipeList.filter((recipe) => {
        const matchCategory = category === "All" || recipe.category === category;
        const matchSearch =
            recipe.title?.toLowerCase().includes(searchLower) ||
            recipe.ingredients?.some((ing) => ing.toLowerCase().includes(searchLower)) ||
            recipe.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
            recipe.origin?.toLowerCase().includes(searchLower);
        return matchCategory && matchSearch;
    });

    // Reset currPage to 1 whenever the selected category changes
    useEffect(() => {
        setCurrPage(1);
    }, [category]);

    let totalPage = Math.ceil(filteredRecipes.length / limit);

    // Paginate the filtered recipes based on the current page and limit per page
    let paginatedRecipes = filteredRecipes.slice((currPage - 1) * limit, currPage * limit);

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
                <SearchBar onSearch={(query) => setSearchQuery(query)} />
                <RecipeTagList tags={randomTags} />

                {categoryLoading ? (
                    <>
                        <p className="category-loading">Đang tải danh mục...</p>
                    </>
                ) : categoryError ? (
                    <p>{categoryError}</p>
                ) : (
                    <ExploreRecipeMenu
                        category={category}
                        setCategory={setCategory}
                        categoryList={categoryList}
                    />
                )}

                <SmallLineSeparator />

                {recipeLoading || recipeFilterLoading ? (
                    <>
                        <p className="recipe-loading">Đang tải công thức...</p>
                        <RecipeSkeletonGrid number={8} />
                    </>
                ) : recipeError ? (
                    <p>{recipeError}</p>
                ) : (
                    <RecipeGrid recipeList={paginatedRecipes} />
                )}

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
