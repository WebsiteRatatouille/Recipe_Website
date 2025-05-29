const Recipe = require("../models/Recipe");

const getAllRecipes = async (req, res) => {
    try {
        const allRecipes = await Recipe.find().sort({ createdAt: -1 });
        res.status(200).json(allRecipes);
    } catch (error) {
        console.error("Lỗi khi lấy toàn bộ công thức:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getTopLikedRecipes = async (req, res) => {
    try {
        const topRecipes = await Recipe.find().sort({ likes: -1 }).limit(12);

        res.status(200).json(topRecipes);
    } catch (error) {
        console.error("Lỗi khi lấy top công thức:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getTopViewedRecipes = async (req, res) => {
    try {
        const topViewed = await Recipe.find().sort({ views: -1 }).limit(4);

        res.status(200).json(topViewed);
    } catch (error) {
        console.error("Lỗi khi lấy công thức nhiều lượt xem:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getRandomRecipes = async (req, res) => {
    try {
        const randomRecipes = await Recipe.aggregate([{ $sample: { size: 4 } }]);
        res.status(200).json(randomRecipes);
    } catch (error) {
        console.error("Lỗi khi lấy công thức ngẫu nhiên:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

module.exports = { getTopLikedRecipes, getTopViewedRecipes, getRandomRecipes, getAllRecipes };
