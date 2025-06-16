// RecipeSearchResult.jsx
import React, { useEffect, useState } from "react";
import "./RecipeSearchResult.css";

import axios from "axios";
import RecipesPageBgImage from "../../../assets/img/recipes-background.webp";
import PagePagination from "../../../components/PagePagination/PagePagination";
import RecipeGrid from "../../../components/RecipeGrid/RecipeGrid";
import SmallLineSeparator from "../../../components/SmallLineSeparator/SmallLineSeparator";

import { useLocation } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function RecipeSearchResult() {
    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currPage, setCurrPage] = useState(1);
    const [limit, setLimit] = useState(16);

    const query = useQuery();
    const searchQuery = query.get("query") || "";

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/recipes/search?query=${encodeURIComponent(
                        searchQuery
                    )}`
                );
                setAllResults(res.data);
            } catch (err) {
                console.error("Lỗi khi tìm kiếm:", err);
                setError("Không thể tải kết quả tìm kiếm.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
        setCurrPage(1); // reset về trang 1 khi đổi query
    }, [searchQuery]);

    const totalPage = Math.ceil(allResults.length / limit);
    const paginatedRecipes = allResults.slice((currPage - 1) * limit, currPage * limit);

    function handlePageChange(value) {
        if (value === "<<") setCurrPage(1);
        else if (value === "<" && currPage > 1) setCurrPage(currPage - 1);
        else if (value === ">" && currPage < totalPage) setCurrPage(currPage + 1);
        else if (value === ">>") setCurrPage(totalPage);
        else if (![" ...", "... "].includes(value)) setCurrPage(value);
    }

    return (
        <div className="recipes-search-result">
            <div className="recipes-search-result-background">
                <img src={RecipesPageBgImage} alt="Recipes page background" />
            </div>

            <div className="recipes-search-result-body-wrapper">
                <div className="title">
                    <h1>Kết quả tìm kiếm</h1>
                    <p>
                        Những công thức khớp với từ khóa của bạn. Hãy thử điều chỉnh từ khóa nếu
                        chưa đúng mong muốn.
                    </p>
                </div>

                <h2>
                    Kết quả tìm kiếm của: <strong>{searchQuery || "(Trống)"}</strong>
                </h2>

                <SmallLineSeparator />

                {loading ? (
                    <p>Đang tải kết quả...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : allResults.length === 0 ? (
                    <p>Không tìm thấy công thức nào phù hợp với từ khóa.</p>
                ) : (
                    <>
                        <RecipeGrid recipeList={paginatedRecipes} />
                        {allResults.length > limit && (
                            <PagePagination
                                totalPage={totalPage}
                                currPage={currPage}
                                limit={limit}
                                siblings={1}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default RecipeSearchResult;
