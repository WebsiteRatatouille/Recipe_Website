const express = require("express");
const router = express.Router();
const {
    getRecipeById,
    getTopLikedRecipes,
    getTopViewedRecipes,
    getRandomRecipes,
    getAllRecipes,
    getRandomTags,
    getRecipesByTag,
} = require("../controllers/recipeController");

// GET /api/recipes
router.get("/", getAllRecipes);
// GET /api/recipes/top-liked
router.get("/top-liked", getTopLikedRecipes);
// GET /api/recipes/top-viewed
router.get("/top-viewed", getTopViewedRecipes);
// GET /api/recipes/random-recipes
router.get("/random-recipes", getRandomRecipes);

router.get("/random-tags", getRandomTags);
router.get("/search", getRecipesByTag);

// GET /api/recipes/:id
router.get("/:id", getRecipeById);

module.exports = router;
