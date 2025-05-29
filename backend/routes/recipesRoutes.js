const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const {
    getTopLikedRecipes,
    getTopViewedRecipes,
    getRandomRecipes,
    getAllRecipes,
} = require("../controllers/recipeController");

// GET /api/recipes - All recipes
router.get("/", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (err) {
        res.status(500).json({ msg: "Lỗi server", error: err });
    }
});

// GET /api/recipes/top-liked
router.get("/", getAllRecipes);
router.get("/top-liked", getTopLikedRecipes);
router.get("/top-viewed", getTopViewedRecipes);
router.get("/random-recipes", getRandomRecipes);

module.exports = router;
