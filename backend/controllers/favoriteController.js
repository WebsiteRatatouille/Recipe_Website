const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

// @desc    Lấy danh sách công thức yêu thích của user
// @route   GET /api/recipes/favorites
// @access  Private
const getFavoriteRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: "recipe",
        populate: {
          path: "createdBy",
          select: "username",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Favorite.countDocuments({ user: req.user.id });

    const recipes = favorites.map((fav) => fav.recipe);

    res.status(200).json({
      recipes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức yêu thích:", error);
    res.status(500).json({ msg: "Lỗi server", error: error.message });
  }
};

// @desc    Kiểm tra trạng thái yêu thích của một công thức
// @route   GET /api/recipes/:id/favorite-status
// @access  Private
const getFavoriteStatus = async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "ID công thức không hợp lệ" });
    }

    const favorite = await Favorite.findOne({
      user: req.user.id,
      recipe: req.params.id,
    });

    res.status(200).json({
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
    res.status(500).json({ msg: "Lỗi server", error: error.message });
  }
};

// @desc    Thêm công thức vào danh sách yêu thích
// @route   POST /api/recipes/:id/favorite
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "ID công thức không hợp lệ" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Không tìm thấy công thức" });
    }

    const favorite = new Favorite({
      user: req.user.id,
      recipe: recipe._id,
    });

    await favorite.save();
    res.status(201).json({ msg: "Đã thêm vào danh sách yêu thích" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ msg: "Công thức đã có trong danh sách yêu thích" });
    }
    console.error("Lỗi khi thêm vào danh sách yêu thích:", error);
    res.status(500).json({ msg: "Lỗi server", error: error.message });
  }
};

// @desc    Xóa công thức khỏi danh sách yêu thích
// @route   DELETE /api/recipes/:id/favorite
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "ID công thức không hợp lệ" });
    }

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      recipe: req.params.id,
    });

    if (!favorite) {
      return res
        .status(404)
        .json({ msg: "Không tìm thấy công thức trong danh sách yêu thích" });
    }

    res.status(200).json({ msg: "Đã xóa khỏi danh sách yêu thích" });
  } catch (error) {
    console.error("Lỗi khi xóa khỏi danh sách yêu thích:", error);
    res.status(500).json({ msg: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getFavoriteRecipes,
  getFavoriteStatus,
  addToFavorites,
  removeFromFavorites,
};
