const express = require("express");
const router = express.Router();
const {
  getRecipeById,
  getTopLikedRecipes,
  getTopViewedRecipes,
  getRandomRecipes,
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRandomTags,
  getRecipesByTag,
} = require("../controllers/recipeController");
const favoriteRoutes = require("./favoriteRoutes");

// Sử dụng routes cho chức năng yêu thích
router.use("/", favoriteRoutes);

// GET /api/recipes
router.get("/", getAllRecipes);

// GET /api/recipes/top-liked
router.get("/top-liked", getTopLikedRecipes);

// GET /api/recipes/top-viewed
router.get("/top-viewed", getTopViewedRecipes);

// GET /api/recipes/random-recipes
router.get("/random-recipes", getRandomRecipes);

// GET /api/recipes/random-tags
router.get("/random-tags", getRandomTags);

// GET /api/recipes/search
router.get("/search", getRecipesByTag);

// GET /api/recipes/:id
router.get("/:id", getRecipeById);

// POST /api/recipes
router.post("/", createRecipe);

// PUT /api/recipes/:id
router.put("/:id", updateRecipe);

// DELETE /api/recipes/:id
router.delete("/:id", deleteRecipe);

module.exports = router;
