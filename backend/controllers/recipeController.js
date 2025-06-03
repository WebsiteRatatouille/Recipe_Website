const Recipe = require("../models/Recipe");

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "createdBy",
      "username"
    ); // Populate tên người dùng
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
    const keyword = req.query.keyword
      ? {
          // Case-insensitive search on title or description
          $or: [
            { title: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const pageSize = parseInt(req.query.limit) || 10; // Number of recipes per page, default 10
    const page = parseInt(req.query.page) || 1; // Current page number, default 1

    const count = await Recipe.countDocuments({ ...keyword }); // Get total number of recipes matching the keyword

    const recipes = await Recipe.find({ ...keyword })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      recipes,
      page,
      pages: Math.ceil(count / pageSize), // Total number of pages
      total: count, // Total number of recipes
    });
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

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private (requires user authentication)
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      imageThumb,
      images,
      videoUrl,
      category,
      categoryDisplay,
      cookingTime,
      serves,
      tags,
      calories,
      origin,
    } = req.body;

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      imageThumb,
      images,
      videoUrl,
      category,
      categoryDisplay,
      cookingTime,
      serves,
      tags,
      calories,
      origin,
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error("Lỗi khi tạo công thức:", error);
    res.status(500).json({ msg: "Lỗi server", error });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (requires user authentication)
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      const {
        title,
        description,
        ingredients,
        steps,
        imageThumb,
        images,
        videoUrl,
        category,
        categoryDisplay,
        cookingTime,
        serves,
        tags,
        calories,
        origin,
      } = req.body;

      recipe.title = title || recipe.title;
      recipe.description = description || recipe.description;
      recipe.ingredients = ingredients || recipe.ingredients;
      recipe.steps = steps || recipe.steps;
      recipe.imageThumb = imageThumb || recipe.imageThumb;
      recipe.images = images || recipe.images;
      recipe.videoUrl = videoUrl || recipe.videoUrl;
      recipe.category = category || recipe.category;
      recipe.categoryDisplay = categoryDisplay || recipe.categoryDisplay;
      recipe.cookingTime = cookingTime || recipe.cookingTime;
      recipe.serves = serves || recipe.serves;
      recipe.tags = tags || recipe.tags;
      recipe.calories = calories || recipe.calories;
      recipe.origin = origin || recipe.origin;
      recipe.updatedAt = Date.now();

      const updatedRecipe = await recipe.save();
      res.status(200).json(updatedRecipe);
    } else {
      res.status(404).json({ msg: "Không tìm thấy công thức" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật công thức:", error);
    res.status(500).json({ msg: "Lỗi server", error });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (requires user authentication)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      await recipe.deleteOne();
      res.status(200).json({ msg: "Công thức đã được xóa" });
    } else {
      res.status(404).json({ msg: "Không tìm thấy công thức" });
    }
  } catch (error) {
    console.error("Lỗi khi xóa công thức:", error);
    res.status(500).json({ msg: "Lỗi server", error });
  }
};

module.exports = {
  getRecipeById,
  getTopLikedRecipes,
  getTopViewedRecipes,
  getRandomRecipes,
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
