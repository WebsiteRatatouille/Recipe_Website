const Recipe = require("../models/Recipe");

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username"); // Populate tên người dùng
        if (!recipe) {
            return res.status(404).json({ msg: "Không tìm thấy công thức" });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error("Lỗi khi lấy công thức theo ID:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getAllRecipes = async (req, res) => {
    try {
        const allRecipes = await Recipe.find()
            .populate("createdBy", "username")
            .sort({ createdAt: -1 });
        res.status(200).json(allRecipes);
    } catch (error) {
        console.error("Lỗi khi lấy toàn bộ công thức:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getTopLikedRecipes = async (req, res) => {
    try {
        const topRecipes = await Recipe.find()
            .populate("createdBy", "username")
            .sort({ likes: -1 })
            .limit(12);
        res.status(200).json(topRecipes);
    } catch (error) {
        console.error("Lỗi khi lấy top công thức:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getTopViewedRecipes = async (req, res) => {
    try {
        const topViewed = await Recipe.find()
            .populate("createdBy", "username")
            .sort({ views: -1 })
            .limit(4);
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

const getRandomTags = async (req, res) => {
    try {
        const tags = await Recipe.aggregate([
            { $unwind: { path: "$tags", preserveNullAndEmptyArrays: false } },
            { $group: { _id: "$tags" } },
            { $sample: { size: 20 } },
            { $project: { _id: 0, tag: "$_id" } },
        ]);

        const result = tags.map((t) => t.tag);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi lấy tag ngẫu nhiên:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getRecipesByTag = async (req, res) => {
    const tag = req.query.query?.toLowerCase() || "";

    try {
        const recipes = await Recipe.find({
            tags: { $regex: tag, $options: "i" },
        }).populate("createdBy", "username");

        res.status(200).json(recipes);
    } catch (error) {
        console.error("Lỗi khi tìm công thức theo tag:", error);
        res.status(500).json({ msg: "Lỗi server khi tìm theo tag", error });
    }
};

module.exports = {
    getRecipeById,
    getTopLikedRecipes,
    getTopViewedRecipes,
    getRandomRecipes,
    getAllRecipes,
    getRandomTags,
    getRecipesByTag,
};
