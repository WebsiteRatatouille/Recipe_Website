const express = require("express");
const router = express.Router();
const {
    deleteImagesInRecipeFolder,
    deleteSelectedImages,
    uploadRecipeImage,
    createCustomUploader,
    createUploaderWithRecipeId,
} = require("../controllers/cloudinaryController");

// Xóa ảnh trong folder
router.delete("/recipes/:id/images", deleteImagesInRecipeFolder);

router.post("/recipes/:id/delete-images", deleteSelectedImages);

// Upload ảnh mới (1 ảnh tại 1 thời điểm)
router.post(
    "/recipes/upload-image",
    (req, res, next) => {
        const folderName = req.query.recipeId; // <-- Lấy từ query thay vì body
        if (!folderName) {
            return res.status(400).json({ msg: "Thiếu recipeId trong query" });
        }

        const upload = createCustomUploader(folderName).single("image");
        upload(req, res, function (err) {
            if (err) {
                return res.status(500).json({ msg: "Lỗi khi upload ảnh", error: err });
            }
            next();
        });
    },
    uploadRecipeImage
);

router.post("/recipes/upload-image", createUploaderWithRecipeId(), uploadRecipeImage);

module.exports = router;
