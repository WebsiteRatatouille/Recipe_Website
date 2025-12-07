import express from "express";
import { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "../controllers/cartController.js";

const router = express.Router();

// POST /cart - Thêm vào giỏ hàng
router.post("/", addToCart);

// GET /cart/:userId - Lấy giỏ hàng
router.get("/:userId", getCart);

// PUT /cart/:userId - Cập nhật số lượng sản phẩm
router.put("/:userId", updateCartItem);

// DELETE /cart/:userId/:productId - Xóa sản phẩm khỏi giỏ hàng
router.delete("/:userId/:productId", removeFromCart);

// DELETE /cart/:userId - Xóa toàn bộ giỏ hàng
router.delete("/:userId", clearCart);

export default router;
