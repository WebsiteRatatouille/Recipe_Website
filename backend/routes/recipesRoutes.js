const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getRecipeById,
    getTopLikedRecipes,
    getTopViewedRecipes,
    getRandomRecipes,
    getRandomRecipesForBigSwiper,
    getAllRecipes,
    getAllRecipesOnly,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRandomTags,
    getRecipesByTag,
    getRecipesByTitleAndIngredient,
    createRecipeL,
    updateRecipeL,
    deleteRecipeL,
    increaseViewCount,
} = require("../controllers/recipeController");
const favoriteRoutes = require("./favoriteRoutes");

// Sử dụng routes cho chức năng yêu thích
router.use("/", favoriteRoutes);

// GET /api/recipes
router.get("/", auth, getAllRecipes);

router.get("/all-recipes-only", getAllRecipesOnly);

// GET /api/recipes/top-liked
router.get("/top-liked", getTopLikedRecipes);

// GET /api/recipes/top-viewed
router.get("/top-viewed", getTopViewedRecipes);

// GET /api/recipes/random-recipes
router.get("/random-recipes", getRandomRecipes);

router.get("/random-recipes-big-swiper", getRandomRecipesForBigSwiper);

// GET /api/recipes/random-tags
router.get("/random-tags", getRandomTags);

// GET /api/recipes/search
router.get("/search-tags", getRecipesByTag);

router.get("/search-combined", getRecipesByTitleAndIngredient);

router.post("/create-l", auth, createRecipeL);

router.delete("/delete-l/:id", auth, deleteRecipeL);

router.put("/update-l/:id", updateRecipeL);

router.patch("/:id/view", increaseViewCount);

// GET /api/recipes/:id
router.get("/:id", getRecipeById);

// POST /api/recipes
router.post("/", auth, createRecipe);

// PUT /api/recipes/:id
router.put("/:id", auth, updateRecipe);

// DELETE /api/recipes/:id
router.delete("/:id", auth, deleteRecipe);

module.exports = router;
