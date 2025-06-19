const Recipe = require("../models/Recipe");
const mongoose = require("mongoose"); // Import mongoose để sử dụng Types.ObjectId
const cloudinary = require("cloudinary").v2;

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate("createdBy", "username")
            .populate("category", "name displayName");

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
        console.log("----------------- DEBUG getAllRecipes -----------------");
        console.log("req.user:", req.user);
        console.log("req.user.id:", req.user.id);
        console.log("req.user.isAdmin:", req.user.isAdmin);
        console.log("---------------------------------------------------");

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
            .populate("category", "displayName name")
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

const getAllRecipesApproved = async (req, res) => {
    try {
        const allRecipes = await Recipe.find({ isApproved: true })
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
        const topRecipes = await Recipe.find({ isApproved: true })
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
        const topViewed = await Recipe.find({ isApproved: true })
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
        const randomRecipes = await Recipe.aggregate([
            { $match: { isApproved: true } },
            { $sample: { size: 4 } },
        ]);
        res.status(200).json(randomRecipes);
    } catch (error) {
        console.error("Lỗi khi lấy công thức ngẫu nhiên:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

const getRandomRecipesForBigSwiper = async (req, res) => {
    try {
        const randomRecipes = await Recipe.aggregate([
            { $match: { isApproved: true } },
            { $sample: { size: 3 } },
        ]);
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

const createRecipeL = async (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            steps,
            cookingTime,
            serves,
            tags,
            calories,
            origin,
            videoUrl,
            category,
            isApproved,
        } = req.body;

        if (!title || !category) {
            return res.status(400).json({ msg: "Thiếu tiêu đề hoặc danh mục." });
        }

        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            steps,
            cookingTime,
            serves,
            tags,
            calories,
            origin,
            videoUrl,
            createdBy: req.user.id,
            category: new mongoose.Types.ObjectId(category),
            isApproved: isApproved ?? false,
        });

        const savedRecipe = await newRecipe.save();

        // Gửi lại bản đầy đủ có populate category
        const populatedRecipe = await Recipe.findById(savedRecipe._id).populate(
            "category",
            "displayName"
        );

        res.status(201).json(populatedRecipe);
    } catch (error) {
        console.error("Lỗi khi tạo công thức (L):", error);
        res.status(500).json({ msg: "Lỗi server khi tạo công thức", error });
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

const updateRecipeL = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: "Không tìm thấy công thức" });
        }

        const {
            title,
            description,
            ingredients,
            steps,
            imageThumb,
            images,
            videoUrl,
            category,
            cookingTime,
            serves,
            tags,
            calories,
            origin,
            isApproved,
        } = req.body;

        // Cập nhật dữ liệu nếu có
        recipe.title = title ?? recipe.title;
        recipe.description = description ?? recipe.description;
        recipe.ingredients = ingredients ?? recipe.ingredients;
        recipe.steps = steps ?? recipe.steps;
        recipe.imageThumb = imageThumb ?? recipe.imageThumb;
        recipe.images = images ?? recipe.images;
        recipe.videoUrl = videoUrl ?? recipe.videoUrl;
        recipe.cookingTime = cookingTime ?? recipe.cookingTime;
        recipe.serves = serves ?? recipe.serves;
        recipe.tags = tags ?? recipe.tags;
        recipe.calories = calories ?? recipe.calories;
        recipe.origin = origin ?? recipe.origin;

        if (category) {
            recipe.category = new mongoose.Types.ObjectId(category); // ✅ ép kiểu
        }

        if (isApproved !== undefined) {
            recipe.isApproved = isApproved;
        }

        recipe.updatedAt = Date.now();

        await recipe.save();

        // Populate lại category để client hiển thị
        const populatedRecipe = await Recipe.findById(recipe._id).populate(
            "category",
            "displayName"
        );

        res.status(200).json(populatedRecipe);
    } catch (error) {
        console.error("Lỗi khi cập nhật (updateRecipeL):", error);
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

const deleteRecipeL = async (req, res) => {
    try {
        const recipeId = req.params.id;

        // 1. Xoá công thức khỏi MongoDB
        const deleted = await Recipe.findByIdAndDelete(recipeId);
        if (!deleted) return res.status(404).json({ msg: "Không tìm thấy công thức." });

        // 2. Xoá ảnh trên Cloudinary (folder recipes/:id)
        const folderPath = `recipes/${recipeId}`;
        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: folderPath + "/",
            max_results: 100,
        });
        const publicIds = result.resources.map((file) => file.public_id);
        if (publicIds.length > 0) {
            await cloudinary.api.delete_resources(publicIds);
        }

        return res.status(200).json({ msg: "Đã xoá công thức và ảnh thành công." });
    } catch (err) {
        console.error("Lỗi xoá công thức:", err);
        return res.status(500).json({ msg: "Lỗi server", error: err });
    }
};

const getRandomTags = async (req, res) => {
    try {
        const tags = await Recipe.aggregate([
            { $match: { isApproved: true } },
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

const getRecipesByTitleAndIngredient = async (req, res) => {
    const keyword = req.query.query?.toLowerCase() || "";

    try {
        // Tìm theo title
        const byTitle = await Recipe.find({
            title: { $regex: keyword, $options: "i" },
        });

        // Lấy id của kết quả tìm theo title để loại khỏi nguyên liệu
        const titleIds = byTitle.map((r) => r._id.toString());

        // Tìm theo ingredients nhưng loại bỏ các recipe đã có trong title
        const byIngredients = await Recipe.find({
            ingredients: { $elemMatch: { $regex: keyword, $options: "i" } },
            _id: { $nin: titleIds }, // loại công thức đã tìm thấy theo title
        });

        res.status(200).json({
            byTitle,
            byIngredients,
        });
    } catch (error) {
        console.error("Lỗi khi tìm theo title và nguyên liệu:", error);
        res.status(500).json({ msg: "Lỗi server khi tìm kiếm", error });
    }
};

const increaseViewCount = async (req, res) => {
    try {
        const { id } = req.params;

        await Recipe.findByIdAndUpdate(id, { $inc: { views: 1 } });

        res.status(200).json({ msg: "Đã tăng lượt xem" });
    } catch (error) {
        res.status(500).json({ msg: "Lỗi khi tăng lượt xem", error });
    }
};

// @desc    Lấy danh sách bình luận của recipe
// @route   GET /api/recipes/:id/comments
// @access  Public
const getRecipeComments = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate(
            "comments.user",
            "username name"
        );
        if (!recipe) return res.status(404).json({ msg: "Không tìm thấy công thức" });
        res.status(200).json(recipe.comments || []);
    } catch (error) {
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

// @desc    Thêm bình luận cho recipe
// @route   POST /api/recipes/:id/comments
// @access  Private
const addRecipeComment = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content)
            return res.status(400).json({ msg: "Nội dung bình luận không được để trống" });
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: "Không tìm thấy công thức" });
        const userId = req.user._id || req.user.id;
        recipe.comments.push({ user: userId, content });
        await recipe.save();
        res.status(201).json({ msg: "Đã thêm bình luận thành công" });
    } catch (error) {
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

// @desc    Sửa bình luận cho recipe
// @route   PUT /api/recipes/:recipeId/comments/:commentId
// @access  Private
const updateRecipeComment = async (req, res) => {
    try {
        const { recipeId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id || req.user.id;
        console.log("[UPDATE COMMENT]", { recipeId, commentId, userId, content });
        if (!content)
            return res.status(400).json({ msg: "Nội dung bình luận không được để trống" });
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            console.log("[UPDATE COMMENT] Không tìm thấy recipe");
            return res.status(404).json({ msg: "Không tìm thấy công thức" });
        }
        const comment = recipe.comments.id(commentId);
        if (!comment) {
            console.log("[UPDATE COMMENT] Không tìm thấy comment");
            return res.status(404).json({ msg: "Không tìm thấy bình luận" });
        }
        if (comment.user.toString() !== userId.toString()) {
            console.log("[UPDATE COMMENT] Không phải chủ bình luận");
            return res.status(403).json({ msg: "Bạn không có quyền sửa bình luận này" });
        }
        comment.content = content;
        await recipe.save();
        res.status(200).json({ msg: "Đã sửa bình luận thành công" });
    } catch (error) {
        console.error("[UPDATE COMMENT] Lỗi:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

// @desc    Xóa bình luận cho recipe
// @route   DELETE /api/recipes/:recipeId/comments/:commentId
// @access  Private
const deleteRecipeComment = async (req, res) => {
    try {
        const { recipeId, commentId } = req.params;
        const userId = req.user._id || req.user.id;
        const isAdmin = req.user.isAdmin;
        console.log("[DELETE COMMENT]", { recipeId, commentId, userId, isAdmin });
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            console.log("[DELETE COMMENT] Không tìm thấy recipe");
            return res.status(404).json({ msg: "Không tìm thấy công thức" });
        }
        const comment = recipe.comments.id(commentId);
        if (!comment) {
            console.log("[DELETE COMMENT] Không tìm thấy comment");
            return res.status(404).json({ msg: "Không tìm thấy bình luận" });
        }
        if (comment.user.toString() !== userId.toString() && !isAdmin) {
            console.log("[DELETE COMMENT] Không phải chủ bình luận hoặc admin");
            return res.status(403).json({ msg: "Bạn không có quyền xóa bình luận này" });
        }
        // Xóa comment bằng filter
        recipe.comments = recipe.comments.filter((c) => c._id.toString() !== commentId.toString());
        await recipe.save();
        res.status(200).json({ msg: "Đã xóa bình luận thành công" });
    } catch (error) {
        console.error("[DELETE COMMENT] Lỗi:", error);
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

// @desc    Top công thức nhiều bình luận nhất
// @route   GET /api/recipes/top-comments
// @access  Public
const getTopCommentedRecipes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const recipes = await Recipe.find().populate("createdBy", "username").lean();
        // Thêm trường commentCount
        recipes.forEach((r) => (r.commentCount = r.comments ? r.comments.length : 0));
        // Sắp xếp giảm dần theo commentCount
        recipes.sort((a, b) => b.commentCount - a.commentCount);
        res.status(200).json(recipes.slice(0, limit));
    } catch (error) {
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

// @desc    Bảng tổng quan tất cả công thức, sắp xếp theo điểm trung bình cộng của views, likes, comments
// @route   GET /api/recipes/overview
// @access  Public
const getRecipeOverview = async (req, res) => {
    try {
        const recipes = await Recipe.find({ isApproved: true })
            .populate("createdBy", "username")
            .lean();
        // Tính max cho từng tiêu chí
        let maxViews = 1,
            maxLikes = 1,
            maxComments = 1;
        recipes.forEach((r) => {
            if (r.views > maxViews) maxViews = r.views;
            if (r.likes > maxLikes) maxLikes = r.likes;
            if ((r.comments?.length || 0) > maxComments) maxComments = r.comments.length;
        });
        // Tính điểm trung bình cộng (chuẩn hóa về 0-1)
        recipes.forEach((r) => {
            const viewScore = r.views / maxViews;
            const likeScore = r.likes / maxLikes;
            const commentScore = (r.comments?.length || 0) / maxComments;
            r.overviewScore = ((viewScore + likeScore + commentScore) / 3).toFixed(3);
            r.commentCount = r.comments?.length || 0;
        });
        // Sắp xếp giảm dần theo overviewScore
        recipes.sort((a, b) => b.overviewScore - a.overviewScore);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ msg: "Lỗi server", error });
    }
};

module.exports = {
    getRecipeById,
    getTopLikedRecipes,
    getTopViewedRecipes,
    getRandomRecipes,
    getRandomRecipesForBigSwiper,
    getAllRecipes,
    getAllRecipesApproved,
    createRecipe,
    createRecipeL,
    updateRecipe,
    updateRecipeL,
    deleteRecipe,
    deleteRecipeL,
    getRandomTags,
    getRecipesByTag,
    getRecipesByTitleAndIngredient,
    increaseViewCount,
    getRecipeComments,
    addRecipeComment,
    updateRecipeComment,
    deleteRecipeComment,
    getTopCommentedRecipes,
    getRecipeOverview,
};
