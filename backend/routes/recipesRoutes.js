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
    getAllRecipesApproved,
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
    getRecipeComments,
    addRecipeComment,
    updateRecipeComment,
    deleteRecipeComment,
    getTopCommentedRecipes,
    getRecipeOverview,
} = require("../controllers/recipeController");
const favoriteRoutes = require("./favoriteRoutes");

// Sử dụng routes cho chức năng yêu thích
router.use("/", favoriteRoutes);

// GET /api/recipes
router.get("/", auth, getAllRecipes);

router.get("/all-recipes-approved", getAllRecipesApproved);

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

// GET /api/recipes/top-comments
router.get("/top-comments", getTopCommentedRecipes);

// GET /api/recipes/overview
router.get("/overview", getRecipeOverview);

// Route động để sau cùng
router.get("/:id", getRecipeById);

// GET /api/recipes/:id/comments
router.get("/:id/comments", getRecipeComments);

// POST /api/recipes
router.post("/", auth, createRecipe);

// POST /api/recipes/:id/comments
router.post("/:id/comments", auth, addRecipeComment);

// PUT /api/recipes/:id
router.put("/:id", auth, updateRecipe);

// DELETE /api/recipes/:id
router.delete("/:id", auth, deleteRecipe);

// PUT /api/recipes/:recipeId/comments/:commentId
router.put("/:recipeId/comments/:commentId", auth, updateRecipeComment);

// DELETE /api/recipes/:recipeId/comments/:commentId
router.delete("/:recipeId/comments/:commentId", auth, deleteRecipeComment);

module.exports = router;
