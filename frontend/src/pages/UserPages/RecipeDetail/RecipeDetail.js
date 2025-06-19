import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RecipeDetail.css";

import { startProgress, stopProgress } from "../../../utils/NProgress/NProgress";

import RecipeInfo from "../../../components/RecipeInfo/RecipeInfo";
import RecipeGridOneColumn from "../../../components/RecipeGridOneColumn/RecipeGridOneColumn";
import RecipeSkeletonGrid from "../../../components/RecipeSkeletonGrid/RecipeSkeletonGrid";
import LineSeparator from "../../../components/LineSeparator/LineSeparator";
import FanFavorite from "../../../components/FanFavorite/FanFavorite";
import ReviewRecipeSection from "../../../components/ReviewRecipeSection/ReviewRecipeSection";
import SmallLineSeparator from "../../../components/SmallLineSeparator/SmallLineSeparator";

function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [maybeYouLikeList, setMaybeYouLikeList] = useState([]);
    const [topLikedRecipeList, setTopLikedRecipeList] = useState([]);

    const [loadingMaybeYouLikeList, setLoadingMaybeYouLikeList] = useState(true);
    const [loadingTopLiked, setLoadingTopLiked] = useState(true);
    const [loading, setLoading] = useState(true);

    const [errorMaybeYouLikeList, setErrorMaybeYouLikeList] = useState("");
    const [errorTopLiked, setErrorTopLiked] = useState("");
    const [error, setError] = useState("");

    // Fetch the main recipe for display
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`);
                if (!res.ok) throw new Error("Không tìm thấy món ăn");
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    useEffect(() => {
        axios
            .patch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}/view`)
            .catch((err) => console.error("Lỗi tăng views:", err));
    }, [id]);

    // Fetch random recipes for Có thể bạn thích
    useEffect(() => {
        const fetchRandomRecipes = async () => {
            setLoadingMaybeYouLikeList(true);
            startProgress();
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/random-recipes`
                );
                setMaybeYouLikeList(res.data);
            } catch (err) {
                setErrorMaybeYouLikeList("Lỗi khi lấy công thức ngẫu nhiên.");
                console.error("Lỗi khi lấy công thức ngẫu nhiên:", err);
            } finally {
                stopProgress();
                setLoadingMaybeYouLikeList(false);
            }
        };

        fetchRandomRecipes();
    }, [id]);

    // get top liked recipe for FanFavorite
    useEffect(() => {
        const fetchTopLikedRecipeList = async () => {
            setLoadingTopLiked(true);
            startProgress();
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/top-liked`
                );
                setTopLikedRecipeList(res.data);
            } catch (err) {
                setErrorTopLiked("Lỗi khi lấy công thức nhiều like");
                console.error("Lỗi khi fetch công thức nhiều like:", err);
            } finally {
                stopProgress();
                setLoadingTopLiked(false);
            }
        };

        fetchTopLikedRecipeList();
    }, [id]);

    if (loading) return <div>Đang tải công thức...</div>;
    if (error) return <div>{error}</div>;

    // For Display image
    const combinedImages =
        recipe?.images && recipe.images.length > 0
            ? [recipe.imageThumb, ...recipe.images.filter((img) => img !== recipe.imageThumb)]
            : [recipe.imageThumb];

    return (
        <>
            <div className="recipe-detail-background">
                <img src={recipe.imageThumb} alt="Recipes page background" />
            </div>
            <div className="recipe-detail-container">
                <div className="recipe-detail-wrapper">
                    <div className="main-page">
                        <RecipeInfo recipe={recipe} recipeImageList={combinedImages} />

                        <SmallLineSeparator />
                        <ReviewRecipeSection recipeId={id} />
                    </div>

                    <div className="widget">
                        <span className="title">Có thể bạn thích</span>
                        {loadingMaybeYouLikeList ? (
                            <>
                                <p className="recipe-loading">Đang tải công thức...</p>
                                <RecipeSkeletonGrid number={1} />
                            </>
                        ) : errorMaybeYouLikeList ? (
                            <p>{errorMaybeYouLikeList}</p>
                        ) : (
                            <RecipeGridOneColumn recipeList={maybeYouLikeList} />
                        )}
                    </div>
                </div>

                <div className="recipe-top-like">
                    <LineSeparator />
                    {loadingTopLiked ? (
                        <>
                            <p className="recipe-loading">Đang tải công thức...</p>
                            <RecipeSkeletonGrid number={8} />
                        </>
                    ) : errorTopLiked ? (
                        <p>{errorTopLiked}</p>
                    ) : (
                        <FanFavorite topLikedRecipeList={topLikedRecipeList} />
                    )}
                </div>
            </div>
        </>
    );
}

export default RecipeDetail;
