import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

import { startProgress, stopProgress } from "../../../utils/NProgress/NProgress";

import Trending from "../../../components/Trending/Trending";
import LineSeparator from "../../../components/LineSeparator/LineSeparator";
import DontMiss from "../../../components/DontMiss/DontMiss";
import Explore from "../../../components/Explore/Explore";
import FeatureCollection from "../../../components/FeatureCollection/FeatureCollection";
import FanFavorite from "../../../components/FanFavorite/FanFavorite";
import BigSwiper from "../../../components/BigSwiper/BigSwiper";
import RecipeSkeletonGrid from "../../../components/RecipeSkeletonGrid/RecipeSkeletonGrid";

function Home() {
    const [topLikedRecipeList, setTopLikedRecipeList] = useState([]);
    const [topViewedRecipeList, setTopViewedRecipeList] = useState([]);
    const [randomRecipeList, setRandomRecipeList] = useState([]);
    const [randomRecipeListForSwiper, setRandomRecipeListForSwiper] = useState([]);

    const [loadingTopLiked, setLoadingTopLiked] = useState(true);
    const [loadingTopViewed, setLoadingTopViewed] = useState(true);
    const [loadingRandomRecipes, setLoadingRandomRecipes] = useState(true);

    const [errorTopLiked, setErrorTopLiked] = useState(true);
    const [errorTopViewed, setErrorTopViewed] = useState(true);
    const [errorRandomRecipes, setErrorRandomRecipes] = useState(true);

    // get top viewed recipe for Trending
    useEffect(() => {
        const fetchTopViewed = async () => {
            setLoadingTopViewed(true);
            startProgress();

            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/top-viewed`
                );
                setTopViewedRecipeList(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy công thức nhiều lượt xem:", err);
            } finally {
                stopProgress();
                setLoadingTopViewed(false);
            }
        };

        fetchTopViewed();
    }, []);

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
                console.error("Lỗi khi fetch công thức nhiều like:", err);
            } finally {
                stopProgress();
                setLoadingTopLiked(false);
            }
        };

        fetchTopLikedRecipeList();
    }, []);

    // get random recipes for Explore component
    useEffect(() => {
        const fetchRandomRecipes = async () => {
            setLoadingRandomRecipes(true);

            startProgress();
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/random-recipes`
                );
                setRandomRecipeList(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy công thức ngẫu nhiên:", err);
            } finally {
                stopProgress();
                setLoadingRandomRecipes(false);
            }
        };

        fetchRandomRecipes();
    }, []);

    useEffect(() => {
        const fetchRandomRecipesForSwiper = async () => {
            startProgress();
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/random-recipes-big-swiper`
                );
                setRandomRecipeListForSwiper(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy công thức ngẫu nhiên cho Swiper:", err);
            } finally {
                stopProgress();
            }
        };

        fetchRandomRecipesForSwiper();
    }, []);

    return (
        <div className="home">
            <BigSwiper recipeList={randomRecipeListForSwiper} />

            <LineSeparator />
            {loadingTopViewed ? (
                <>
                    <p className="recipe-loading">Đang tải công thức...</p>
                    <RecipeSkeletonGrid number={4} />
                </>
            ) : (
                <Trending topViewedRecipeList={topViewedRecipeList} />
            )}

            <DontMiss />

            {/* Explore Component */}
            {loadingRandomRecipes ? (
                <>
                    <p className="recipe-loading">Đang tải công thức...</p>
                    <RecipeSkeletonGrid number={4} />
                </>
            ) : (
                <Explore randomRecipeList={randomRecipeList} />
            )}

            <LineSeparator />
            <FeatureCollection />

            {loadingTopLiked ? (
                <>
                    <p className="recipe-loading">Đang tải công thức...</p>
                    <RecipeSkeletonGrid number={8} />
                </>
            ) : (
                <FanFavorite topLikedRecipeList={topLikedRecipeList} />
            )}
        </div>
    );
}

export default Home;
