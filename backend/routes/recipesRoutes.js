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
} = require("../controllers/recipeController");

// GET /api/recipes
router.get("/", getAllRecipes);
// GET /api/recipes/top-liked
router.get("/top-liked", getTopLikedRecipes);
// GET /api/recipes/top-viewed
router.get("/top-viewed", getTopViewedRecipes);
// GET /api/recipes/random-recipes
router.get("/random-recipes", getRandomRecipes);
// GET /api/recipes/:id
router.get("/:id", getRecipeById);

// POST /api/recipes (requires authentication)
// router.route('/').post(protect, createRecipe); // Example with authentication middleware
router.route("/").post(createRecipe); // Temporarily without auth middleware for easier testing

// PUT /api/recipes/:id and DELETE /api/recipes/:id (requires authentication)
// router.route('/:id').put(protect, updateRecipe).delete(protect, deleteRecipe); // Example with authentication middleware
router.route("/:id").put(updateRecipe).delete(deleteRecipe); // Temporarily without auth middleware for easier testing

module.exports = router;
