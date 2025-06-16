const Recipe = require("../models/Recipe");
const mongoose = require("mongoose"); // Import mongoose để sử dụng Types.ObjectId

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";

    // LOGGING ĐỂ DEBUG
    // console.log("----------------- DEBUG getAllRecipes -----------------");
    // console.log("req.user:", req.user);
    // console.log("req.user.id:", req.user.id);
    // console.log("req.user.isAdmin:", req.user.isAdmin);
    // console.log("---------------------------------------------------");

    // Nếu là admin thì lấy tất cả, nếu không thì chỉ lấy công thức của user hiện tại
    let query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ];
    }
    // Nếu không phải admin thì chỉ lấy công thức của user hiện tại
    if (!req.user.isAdmin) {
      // Chuyển đổi chuỗi ID thành ObjectId để đảm bảo so sánh đúng
      query.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      recipes,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Lỗi khi lấy toàn bộ công thức:", error);
    res.status(500).json({ msg: "Lỗi server", error });
  }
};

const getAllRecipesOnly = async (req, res) => {
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
      createdBy: req.user.id,
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
  getAllRecipesOnly,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRandomTags,
  getRecipesByTag,
};
