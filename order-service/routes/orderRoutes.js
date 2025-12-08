import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
  getAllOrders
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getOrdersByUser);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/status", updateOrderStatus);
router.delete("/:orderId", deleteOrder);

export default router;
